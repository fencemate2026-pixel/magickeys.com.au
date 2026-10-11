import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

// A small DOM harness checks state and event behaviour without a browser or dependencies.
// It deliberately uses the real generated HTML and the real page scripts.
class Element {
  constructor(tag,attributes={}) {
    this.tagName=tag;
    this.attributes={...attributes};
    this.dataset=Object.fromEntries(Object.entries(attributes).filter(([key])=>key.startsWith('data-')).map(([key,value])=>[key.slice(5).replace(/-([a-z])/g,(_,letter)=>letter.toUpperCase()),value]));
    this.childNodes=[]; this.listeners=new Map(); this.style={setProperty(){}};
    this.hidden=Object.hasOwn(attributes,'hidden'); this.disabled=Object.hasOwn(attributes,'disabled');
    this.open=Object.hasOwn(attributes,'open'); this.isConnected=true;
    this.clientWidth=640; this.scrollWidth=2400; this.scrollLeft=0; this._text='';
    const classes=new Set((attributes.class||'').split(/\s+/).filter(Boolean));
    this.classList={
      add:(...names)=>names.forEach(name=>classes.add(name)),
      remove:(...names)=>names.forEach(name=>classes.delete(name)),
      contains:name=>classes.has(name),
      toggle:(name,force)=>{
        const chosen=force??!classes.has(name);
        if(chosen) classes.add(name); else classes.delete(name);
        return chosen;
      }
    };
  }
  get id() {return this.attributes.id;}
  get lastChild() {return this.childNodes.at(-1);}
  get textContent() {return this._text+this.childNodes.map(child=>child.textContent).join('');}
  set textContent(text) {this._text=String(text);this.childNodes=[];}
  get src() {return this.attributes.src;}
  set src(value) {this.attributes.src=value;}
  get alt() {return this.attributes.alt||'';}
  set alt(value) {this.attributes.alt=value;}
  getAttribute(name) {return this.attributes[name]??null;}
  setAttribute(name,value) {this.attributes[name]=String(value);}
  addEventListener(name,handler) {if(!this.listeners.has(name))this.listeners.set(name,[]);this.listeners.get(name).push(handler);}
  dispatch(name,properties={}) {
    const event={target:this,preventDefault(){},...properties};
    let node=this;
    while(node) {
      for(const handler of node.listeners.get(name)||[]) handler(event);
      node=name==='click'?node.parentElement:null;
    }
  }
  click() {if(!this.disabled)this.dispatch('click');}
  focus() {this.document.activeElement=this;}
  closest(selector) {let node=this;while(node){if(matches(node,selector))return node;node=node.parentElement;}return null;}
  querySelectorAll(selector) {
    const selections=selector.split(',').map(value=>value.trim()), result=[];
    const visit=node=>{
      for(const child of node.childNodes) {
        if(child instanceof Element) {
          if(selections.some(selection=>matches(child,selection))) result.push(child);
          visit(child);
        }
      }
    };
    visit(this);return result;
  }
  querySelector(selector) {return this.querySelectorAll(selector)[0]||null;}
  replaceChildren(...children) {this._text='';this.childNodes=children;children.forEach(child=>{child.parentElement=this;child.document=this.document;});}
  getBoundingClientRect() {return {left:0,top:0,right:640,bottom:360,width:640,height:360};}
  showModal() {this.open=true;}
  close() {this.open=false;}
  scrollBy({left}) {this.scrollLeft=Math.min(this.scrollWidth-this.clientWidth,Math.max(0,this.scrollLeft+left));this.dispatch('scroll');}
  pause() {}
  load() {}
  play() {return Promise.resolve();}
}
class TextNode {
  constructor(text) {this.textContent=text;}
}
function matches(node,selector) {
  if(selector.startsWith('#')) return node.id===selector.slice(1);
  if(selector.startsWith('.')) return node.classList.contains(selector.slice(1));
  const attribute=selector.match(/^\[([\w-]+)(?:="([^"]*)")?\]$/);
  if(attribute) return Object.hasOwn(node.attributes,attribute[1])&&(attribute[2]===undefined||node.attributes[attribute[1]]===attribute[2]);
  return node.tagName===selector.toLowerCase();
}
function parse(html) {
  const document=new Element('#document'); document.document=document;
  document.createTextNode=text=>new TextNode(text);
  document.createElement=tag=>{const node=new Element(tag);node.document=document;return node;};
  document.getElementById=id=>document.querySelector('#'+id);
  const stack=[document], voidTags=new Set(['meta','link','img','br','hr','input','source','area','base','embed','wbr']);
  for(const match of html.matchAll(/<\/?[a-z][^>]*>|[^<]+/gi)) {
    const token=match[0];
    if(token.startsWith('</')) {if(stack.length>1)stack.pop();continue;}
    if(!token.startsWith('<')) {stack.at(-1).childNodes.push(new TextNode(token));continue;}
    const tag=token.match(/^<([a-z][\w-]*)/i)[1].toLowerCase();
    const attributeSource=token.slice(tag.length+1).replace(/\/?>$/,'');
    const attributes=Object.fromEntries([...attributeSource.matchAll(/([^\s=/>]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+)))?/g)].map(attr=>[attr[1],attr[2]??attr[3]??attr[4]??'']));
    const node=new Element(tag,attributes); node.document=document;node.parentElement=stack.at(-1);
    stack.at(-1).childNodes.push(node);
    if(!voidTags.has(tag)&&!token.endsWith('/>')) stack.push(node);
  }
  document.body=document.querySelector('body');document.activeElement=document.body;document.hidden=false;
  return document;
}
const scripts=['scene3d-mounts.js','site.js','multipage.js'].map(name=>[name,readFileSync('dist/assets/'+name,'utf8')]);
function environment(html,route,reduced=true,search='',hash='') {
  const document=parse(html), redirects=[];
  const location={pathname:route,search,hash,replace:destination=>redirects.push(destination)};
  let timer=0;
  const window={
    location,
    matchMedia:query=>({matches:query.includes('prefers-reduced-motion')&&reduced,addEventListener(){}}),
    addEventListener(){}
  };
  const context=vm.createContext({document,window,URLSearchParams,setTimeout:()=>++timer,clearTimeout(){},console});
  for(const [name,script] of scripts) vm.runInContext(script,context,{filename:name,timeout:2000});
  return {document,redirects};
}

export function verifyInteractions(pages) {
  let actions=0;
  for(const [route,page] of pages) {
    // The common script must work when the other pages' feature sections do not exist.
    environment(page.html,route,false);
    const {document}=environment(page.html,route);
    const node=id=>document.getElementById(id);
    const click=id=>{assert.ok(node(id),'Missing interactive target '+id);node(id).click();actions++;};
    document.querySelector('.nav-toggle').click();
    assert.equal(document.querySelector('.nav-toggle').getAttribute('aria-expanded'),'true');
    document.dispatch('keydown',{key:'Escape'});
    assert.equal(document.querySelector('.nav-toggle').getAttribute('aria-expanded'),'false');
    click('privacy-open');assert.equal(node('privacy-dialog').open,true);
    click('privacy-close');assert.equal(node('privacy-dialog').open,false);

    if(route==='/') {
      click('hero-gate-open');
      assert.equal(node('hero-gate-stage').dataset.state,'open');
      assert.equal(node('hero-gate-state').textContent,'OPEN');
      assert.equal(node('hero-gate-stage').querySelector('img').src,'/assets/model-single-open.svg');
      click('hero-gate-close');assert.equal(node('hero-gate-stage').dataset.state,'closed');
      click('hero-preview-toggle');assert.equal(node('hero-gate-stage').dataset.state,'open');
      click('intro-replay');assert.equal(node('site-intro').hidden,false);
      click('intro-skip');
    }
    if(route==='/gate-control/') {
      for(const [id,kind] of [['single','single'],['swing','double'],['sliding','sliding'],['boom','boom']]) {
        click('tab-'+id);click('demo-open');
        assert.equal(node('gate-stage').dataset.state,'open');
        assert.equal(node('gate-stage').querySelector('img').src,'/assets/model-'+kind+'-open.svg');
        assert.equal(node('demo-open').disabled,true);
        assert.equal(node('demo-close').disabled,false);
        click('demo-close');assert.equal(node('gate-stage').dataset.state,'closed');
      }
      click('tab-foyer');click('demo-alert');
      assert.equal(node('gate-stage').dataset.state,'alert');
      assert.equal(node('gate-stage').querySelector('img').src,'/assets/model-foyer-alert.svg');
      assert.equal(node('gate-controls').hidden,true);
      click('demo-reset');assert.equal(node('gate-stage').dataset.state,'closed');
    }
    if(route==='/platform/') {
      for(const tab of document.querySelectorAll('[data-portal-screen]')) {
        tab.click();actions++;
        assert.equal(node('portal-screen').src,tab.dataset.image);
        assert.equal(node('portal-screen').alt,tab.dataset.alt);
        assert.equal(node('portal-screen-panel').getAttribute('aria-labelledby'),tab.id);
      }
      click('portal-enlarge');assert.equal(node('image-dialog').open,true);
      click('image-dialog-close');assert.equal(node('image-dialog').open,false);
      click('media-next');assert.ok(node('media-gallery').scrollLeft>0);
    }
    if(route==='/solutions/') {
      for(const [sector,kind] of [['commercial','boom'],['residential','double'],['education','single'],['logistics','sliding']]) {
        click('sector-'+sector);
        assert.equal(node('solution-model-stage').querySelector('img').src,'/assets/model-'+kind+'-closed.svg');
        assert.equal(node('solution-content').getAttribute('aria-labelledby'),'sector-'+sector);
      }
    }
    if(route==='/emergency-guidance/') {
      for(const tab of document.querySelectorAll('[data-guidance-screen]')) {
        tab.click();actions++;assert.equal(node('guidance-screen').src,tab.dataset.image);
        assert.equal(node('guidance-screen-panel').getAttribute('aria-labelledby'),tab.id);
      }
    }
    if(route==='/customisation/') {
      const ids=['entry-boom','exit-boom','main-double','service-double'];
      for(const id of ids) {
        const buttons=document.querySelectorAll('[data-gate-target]').filter(button=>button.dataset.gateTarget===id);
        buttons.find(button=>button.dataset.gateState==='open').click();actions++;
        assert.equal(node(id).dataset.state,'open');assert.equal(node(id+'-status').textContent,'Demo: open');
        assert.equal(node(id).querySelector('img').src,'/assets/model-'+(id.includes('boom')?'boom':'double')+'-open.svg');
        ids.filter(other=>other!==id).forEach(other=>assert.equal(node(other).dataset.state,'closed','A control changed another gate'));
        buttons.find(button=>button.dataset.gateState==='closed').click();actions++;
        assert.equal(node(id).dataset.state,'closed');
      }
    }
    const preview=document.querySelector('[data-preview]');
    if(preview) {
      preview.click();actions++;
      assert.equal(node('image-dialog-image').src,preview.dataset.preview);
      assert.equal(node('image-dialog').open,true);
    }
  }
  const validInterest=environment(pages.get('/contact/').html,'/contact/',true,'?interest=Anti-Tailgating%20Systems').document;
  assert.equal(validInterest.getElementById('enquiry-context').hidden,false);
  assert.equal(validInterest.getElementById('enquiry-subject').textContent,'Discuss Anti-Tailgating Systems');
  const invalidInterest=environment(pages.get('/contact/').html,'/contact/',true,'?interest=%3Cscript%3E').document;
  assert.equal(invalidInterest.getElementById('enquiry-context').hidden,true);
  for(const [anchor,destination] of Object.entries({
    'portal-tour':'/platform/#portal-tour','platform':'/platform/#platform',
    'interactive-demo':'/gate-control/#interactive-demo','solutions':'/solutions/#solutions',
    'upgrades':'/cctv/','how-it-works':'/how-it-works/#how-it-works',
    'client-access':'/client-login/#client-access','contact':'/contact/#contact'
  })) {
    assert.deepEqual(environment(pages.get('/').html,'/',true,'','#'+anchor).redirects,[destination]);
  }
  assert.deepEqual(environment(pages.get('/platform/').html,'/platform/',true,'','#portal-tour').redirects,[]);
  console.log('Checked scripts on every page with and without reduced motion, '+actions+' control actions, safe enquiry context and legacy bookmarks.');
}

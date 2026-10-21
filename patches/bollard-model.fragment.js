    } else if (kind === 'bollard') {
      // Three 220 mm retractable posts, 800 mm raised. Only the exposed shaft
      // is modelled: lowering retracts it into the ground sleeve, never below
      // the displayed road surface. A fixed envelope prevents camera pumping.
      foundation(meshes, 3.45, 1.65, 0, 0);
      const exposed = .80 * (1 - progress) + .001;
      for (const [index, x] of [-1.08, 0, 1.08].entries()) {
        const group = 'bollard-' + index;
        cylinder(meshes, group + '-ground-ring', point(x, .019, 0), .165, .035, 'steelDark', {}, 'y', 24);
        cylinder(meshes, group + '-sleeve', point(x, .04, 0), .135, .025, 'charcoal', {}, 'y', 24);
        cylinder(meshes, group + '-shaft', point(x, .035 + exposed / 2, 0), .11, exposed, 'steel', {group}, 'y', 28);
        cylinder(meshes, group + '-cap', point(x, .035 + exposed, 0), .113, .025, 'steelDark', {group}, 'y', 28);
        if (exposed > .17) {
          cylinder(meshes, group + '-reflector', point(x, .035 + exposed - .11, 0), .112, .055, 'orange', {group}, 'y', 28);
          cylinder(meshes, group + '-led', point(x, .035 + exposed - .035, 0), .114, .024, progress > .96 ? 'open' : 'closed', {group}, 'y', 28);
        }
        for (const dx of [-.115, .115]) for (const dz of [-.09, .09]) {
          cylinder(meshes, group + '-bolt-' + dx + '-' + dz, point(x + dx, .04, dz), .009, .012, 'steel', {}, 'y', 6);
        }
      }
      metadata.dimensions = {raisedHeight: .80, diameter: .22, postCount: 3, travel: .80};
      metadata.movingParts = [-1.08, 0, 1.08].map((x, i) => ({id: 'bollard-' + i, translation: -.80 * progress, exposedHeight: exposed, x}));

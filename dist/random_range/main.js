(function () {
  "use strict";

  const app = new PIXI.Application();
  document.body.appendChild(app.view);

  app.view.width = app.view.height = 500;
  const renderer = app.renderer;

  app.loader.add("spr", "spr.png").load((loader, resources) => {
    // This creates a texture from a 'bunny.png' image
    const spr = new PIXI.Sprite(resources.spr.texture);
    const container = new PIXI.Container();

    // Add the bunny to the scene we are building
    app.stage.addChild(spr);

    spr.width = 332;
    spr.height = 443;
    spr.x = 0;
    spr.y = 0;

    const colors = renderer.plugins.extract.pixels(spr);

    function setPoint() {
      //範囲内に収まるまで再帰
      let x = Math.floor(Math.random() * spr.width);
      let y = Math.floor(Math.random() * spr.height);

      //指定のピクセルのインデックス
      const index = 4 * (spr.width * y + x) + 1;

      //alpha値が0だったら、範囲外
      if (colors[index + 3] === 0) {
        return setPoint();
      } else {
        return { x: x, y: y };
      }
    }

    // //generate particles

    for (let i = 0; i < 200; i++) {
      const g = new PIXI.Graphics();
      const p = setPoint();
      g.beginFill(0xffff00);
      g.drawStar(p.x, p.y, 5, 14, 7, 0);
      g.alpha = 0.5;
      app.stage.addChild(g);
    }

    const ticker = new PIXI.Ticker();
    let v = -0.005;
    ticker.stop();
    ticker.add((deltaTime) => {
      spr.alpha += v;

      if (spr.alpha < 0) {
        v *= -1;
      } else if (spr.alpha > 1) {
        v *= -1;
      }
    });
    ticker.start();
  });
})();

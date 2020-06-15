(() => {
  // 複数の関数で利用する広いスコープが必要な変数を宣言しておく
  let position = null;
  let color = null;
  let vbo = null;
  let indices = null; // インデックス配列 @@@
  let ibo = null; // インデックスバッファ @@@
  let uniform = null;
  let mouse = [0, 0];
  let count = 3;

  // webgl.js に記載のクラスをインスタンス化する
  const webgl = new WebGLUtility();

  // ドキュメントの読み込みが完了したら実行されるようイベントを設定する
  window.addEventListener(
    "DOMContentLoaded",
    () => {
      const canvas = document.getElementById("webgl");
      webgl.initialize(canvas);
      const size = Math.min(window.innerWidth, window.innerHeight);
      webgl.width = size;
      webgl.height = size;

      // クリックで頂点attributeを変更
      window.addEventListener("click", (event) => {
        setupGeometry(++count);
        setupLocation();
      });

      let vs = null;
      let fs = null;
      WebGLUtility.loadFile("./main.vert")
        .then((vertexShaderSource) => {
          vs = webgl.createShaderObject(
            vertexShaderSource,
            webgl.gl.VERTEX_SHADER
          );
          return WebGLUtility.loadFile("./main.frag");
        })
        .then((fragmentShaderSource) => {
          fs = webgl.createShaderObject(
            fragmentShaderSource,
            webgl.gl.FRAGMENT_SHADER
          );
          webgl.program = webgl.createProgramObject(vs, fs);

          // 頂点とロケーションのセットアップは先に行っておく
          setupGeometry(count);
          setupLocation();

          // 準備ができたらレンダリングを開始
          render();
        });
    },
    false
  );

  //多角形の頂点を求める関数 => 多角形の外接円を頂点数で分割して頂点を求める
  function calcurateVertex(polygon_number) {
    if (!polygon_number || polygon_number < 3) {
      polygon_number = 3;
    }
    let points = [0, 0, 0];
    let color = [1.0, 1.0, 1.0, 1];

    //多角形の角数−2個分の三角形が必要
    let index = [];

    for (i = 0; i < polygon_number; i++) {
      let deg = (360 / polygon_number) * i;
      let rad = (deg * Math.PI) / 180;
      let scale = 0.8;

      //初期位置だと、3時が一番はじめの頂点になるので、90度回転する
      rad += (90 * Math.PI) / 180;

      let x = Math.cos(rad) * scale;
      let y = Math.sin(rad) * scale;
      let z = 0.0;
      let a = 1.0;
      points.push(x, y, z);
      color.push(Math.random(), Math.random(), Math.random(), a);
    }

    //すべて0,0,0起点から三角をかける
    for (let i = 0; i < polygon_number; i++) {
      let last = i === polygon_number - 1 ? 1 : i + 2;
      index.push(0, i + 1, last);
    }

    return { points: points, color: color, index: index };
  }

  /**
   * 頂点属性（頂点ジオメトリ）のセットアップを行う
   */
  function setupGeometry(polygon_number) {
    let calcedVartex = calcurateVertex(polygon_number);
    position = calcedVartex.points;
    color = calcedVartex.color;

    // 配列に入れておく
    vbo = [webgl.createVBO(position), webgl.createVBO(color)];

    indices = calcedVartex.index;

    // インデックスバッファを生成する @@@
    ibo = webgl.createIBO(indices);
  }

  /**
   * 頂点属性のロケーションに関するセットアップを行う
   */
  function setupLocation() {
    const gl = webgl.gl;
    // attribute location の取得と有効化
    const attLocation = [
      gl.getAttribLocation(webgl.program, "position"),
      gl.getAttribLocation(webgl.program, "color"),
    ];
    const attStride = [3, 4];
    webgl.enableAttribute(vbo, attLocation, attStride);

    // インデックスバッファのバインド @@@
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, ibo);

    // uniform 変数のロケーションを取得する
    // uniform = {
    //   mouse: gl.getUniformLocation(webgl.program, "mouse"),
    // };
  }

  /**
   * レンダリングのためのセットアップを行う
   */
  function setupRendering() {
    const gl = webgl.gl;
    gl.viewport(0, 0, webgl.width, webgl.height);
    gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  /**
   * レンダリングを行う
   */
  function render() {
    const gl = webgl.gl;

    // 再帰呼び出しを行う
    requestAnimationFrame(render);

    // レンダリング時のクリア処理など
    setupRendering();

    // 登録されている VBO と IBO を利用して描画を行う @@@
    gl.drawElements(gl.TRIANGLES, indices.length, gl.UNSIGNED_SHORT, 0);
  }
})();

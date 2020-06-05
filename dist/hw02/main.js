import * as THREE from "./build/three.module.js";
import { OrbitControls } from "./lib/jsm/controls/OrbitControls.js";

const init = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    //const axis = new THREE.AxisHelper(50);
    //scene.add(axis);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.update();

    camera.position.z = 4;

    //時計のジオメトリ
    const r = 1.0;
    const edge_h = r / 10;
    const offset = 0.2;
    const d = 0.02;
    const sr = r + offset;
    const material = new THREE.MeshPhongMaterial({ color: 0x00008d });

    const sgeo = new THREE.BoxGeometry(d, sr, d);
    const sgeo_edge = new THREE.ConeGeometry(d * 0.7, edge_h, 4);
    const mgeo = new THREE.BoxGeometry(d * 2, r, d * 2);
    const mgeo_edge = new THREE.ConeGeometry(d * 2 * 0.7, edge_h, 4);
    const hgeo = new THREE.BoxGeometry(d * 2, r * 0.6, d * 2);
    const hgeo_edge = new THREE.ConeGeometry(d * 2 * 0.7, edge_h, 4);

    const secondHand = new THREE.Mesh(sgeo, material);
    const secondHand_edge = new THREE.Mesh(sgeo_edge, material);
    const minuteHand = new THREE.Mesh(mgeo, material);
    const minuteHand_edge = new THREE.Mesh(mgeo_edge, material);
    const hourHand = new THREE.Mesh(hgeo, material);
    const hourHand_edge = new THREE.Mesh(hgeo_edge, material);
    const sh = new THREE.Group();
    const mh = new THREE.Group();
    const hh = new THREE.Group();

    secondHand.position.y = sr / 2 - offset;
    secondHand_edge.position.y = sr + edge_h / 2 - offset;
    secondHand_edge.rotation.y = (45 * Math.PI) / 180;

    sh.position.z = d * 3;
    mh.position.z = d * 2;
    hh.position.z = d;

    minuteHand.position.y = r / 2;
    minuteHand_edge.position.y = r + edge_h / 2;
    minuteHand_edge.rotation.y = (45 * Math.PI) / 180;

    hourHand.position.y = (r * 0.6) / 2;
    hourHand_edge.position.y = r * 0.6 + edge_h / 2;
    hourHand_edge.rotation.y = (45 * Math.PI) / 180;

    sh.add(secondHand);
    sh.add(secondHand_edge);
    mh.add(minuteHand);
    mh.add(minuteHand_edge);
    hh.add(hourHand);
    hh.add(hourHand_edge);

    scene.add(sh);
    scene.add(mh);
    scene.add(hh);

    const cageo = new THREE.CylinderGeometry(r / 20, r / 20, d * 4, 18);
    const centeraxis = new THREE.Mesh(cageo, material);
    centeraxis.rotation.x = (90 * Math.PI) / 180;
    centeraxis.position.z = (d * 4) / 2;

    scene.add(centeraxis);

    const getTime = () => window.performance.now() || new Date().getTime();
    const startTime = getTime();

    //現在の時刻に角度をセット
    const now = new Date();
    const srad = -((now.getSeconds() / 60) * 360 * Math.PI) / 180;
    const mrad = -((now.getMinutes() / 60) * 360 * Math.PI) / 180;

    sh.rotation.z = srad;
    mh.rotation.z = mrad;

    //短針の位置は計算が必要
    const floartHour = now.getHours() + now.getMinutes() / 60;
    const hrad = -((floartHour / 12) * 360 * Math.PI) / 180;
    hh.rotation.z = hrad;

    //文字盤作成
    const loader = new THREE.TextureLoader();
    const tg = new THREE.Group();

    const size = 0.25;
    let count = 0;

    for (let i = 12; i > 0; i--) {
        const tgeo = new THREE.PlaneGeometry(size, size);
        const tmat = new THREE.MeshPhongMaterial({
            map: loader.load(`./number_${i}.png`),
            transparent: true,
        });
        const tm = new THREE.Mesh(tgeo, tmat);

        const degree = 360 / 12;
        const rad = (degree * Math.PI) / 180;

        //45度逆回転させるs
        const x_pos = Math.cos(rad * (count + 3));
        const y_pos = Math.sin(rad * (count + 3));

        tm.position.x = x_pos * (r + edge_h);
        tm.position.y = y_pos * (r + edge_h);
        tg.add(tm);
        count++;
    }

    scene.add(tg);

    //文字盤背景
    const bggeo = new THREE.PlaneGeometry(r * 2.7, r * 2.7);
    const bgmat = new THREE.MeshPhongMaterial({ map: loader.load("./bg.jpg") });
    bgmat.side = THREE.DoubleSide;
    const bg = new THREE.Mesh(bggeo, bgmat);
    bg.position.z = -0.01;

    scene.add(bg);

    //ライティング
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(0.8, 0.8, 4);
    scene.add(light);

    const animate = () => {
        requestAnimationFrame(animate);

        const lastTime = getTime();
        //経過秒数
        const elapsed = (lastTime - startTime) / 1000;

        //追加する角度を割り出す
        const degree = (elapsed / 60) * 360;
        const rad = -(degree * Math.PI) / 180;

        sh.rotation.z = srad + rad;
        mh.rotation.z = mrad + rad / 60;
        hh.rotation.z = hrad + rad / 60 / 60;

        renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
        const ww = window.innerWidth;
        const wh = window.innerHeight;

        renderer.setPixelRatio(window.devicePixcelRatio);
        renderer.setSize(ww, wh);

        camera.aspect = ww / wh;
        camera.updateProjectionMatrix();
    };

    window.addEventListener("resize", onResize);
};

window.addEventListener("load", init);

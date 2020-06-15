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

  const axis = new THREE.AxisHelper(50);
  scene.add(axis);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.update();

  camera.position.set(5, 3, 10);
  camera.lookAt(0, 0, 0);

  const loader = new THREE.TextureLoader();

  const earth_size = 1;
  //地球は月の3.66倍の大きさらしい
  const moon_size = earth_size / 3.669;
  const earth_geo = new THREE.SphereGeometry(earth_size, 50, 50);
  const earth_mat = new THREE.MeshLambertMaterial({
    map: loader.load("./earth.jpg"),
  });

  const moon_geo = new THREE.SphereGeometry(moon_size, 50, 50);
  const moon_mat = new THREE.MeshLambertMaterial({
    map: loader.load("./moon.jpg"),
  });

  const satelite_geo = new THREE.SphereGeometry(moon_size / 1.5, 50, 50);
  const satelite_mat = new THREE.MeshLambertMaterial({
    map: loader.load("./satelite.jpg"),
  });

  const earth = new THREE.Mesh(earth_geo, earth_mat);
  const moon = new THREE.Mesh(moon_geo, moon_mat);
  const satelite = new THREE.Mesh(satelite_geo, satelite_mat);

  const moonG = new THREE.Group();

  moonG.add(moon);
  moonG.add(satelite);

  scene.add(earth);
  scene.add(moonG);

  //ライティング
  const light = new THREE.DirectionalLight(0xffffff, 0.8);
  light.position.set(0.8, 0.8, 4);
  scene.add(light);

  let rad = 0;
  const distance = 5;

  //実際は月と地球は38万キロ離れているので、xは38だが、見た目上画面に収まらないので嘘をつく
  moon.position.set(distance, 0, 0);
  satelite.position.set(distance, 0, 0);

  const animate = () => {
    requestAnimationFrame(animate);

    rad += 0.05;

    earth.rotation.y += 0.01;
    moon.rotation.y += 0.03;
    satelite.rotation.y += 0.05;
    moonG.rotation.y -= 0.01;

    satelite.position.set(distance + Math.cos(rad), 0, Math.sin(rad));

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

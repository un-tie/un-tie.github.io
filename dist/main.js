import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/110/three.module.js";
import Cube from "./cube.js";

const init = () => {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
        100,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );
    const cubeArray = [];

    const axis = new THREE.AxisHelper(100);
    scene.add(axis);

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    for (let i = 1; i <= 10; i++) {
        for (let k = 1; k <= 10; k++) {
            const cube = new Cube();
            const cube_mesh = cube.mesh;

            const posx = i % 2 === 0 ? i / 2 : -Math.ceil(i / 2 - 1);
            const posy = k % 2 === 0 ? k / 2 : -Math.ceil(k / 2 - 1);

            //切れ目が軸と重なるようにする
            cube.setPosition(posx - 0.5, posy - 0.5, 0);
            scene.add(cube_mesh);
            cubeArray.push(cube);
        }
    }

    camera.position.z = 6.5;

    const light = new THREE.DirectionalLight(0xffffff, 1.0);
    light.position.set(0, 0, 2);
    scene.add(light);

    let isKeyDown = false;
    const $spaceState = document.querySelector(".spacestate");

    document.addEventListener("keydown", (e) => {
        if (e.code === "Space") {
            isKeyDown = true;
            $spaceState.classList.add("active");
        }
    });

    document.addEventListener("keyup", (e) => {
        if (e.code === "Space") {
            isKeyDown = false;
            $spaceState.classList.remove("active");
        }
    });

    const animate = () => {
        requestAnimationFrame(animate);

        if (isKeyDown) {
            cubeArray.forEach((cube) => {
                cube.update();
            });
        }

        renderer.render(scene, camera);
    };

    animate();
};

window.addEventListener("load", init);

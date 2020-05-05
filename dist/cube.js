import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/110/three.module.js";

export default class Cube {
    constructor(x, y, z) {
        this.geometry = new THREE.BoxGeometry(x, y, z);
        this.material = new THREE.MeshPhongMaterial({ color: 0xe60000 });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    update(frame) {
        //回転をリセット
        if (frame == 0) {
            this.mesh.rotation.y = 0;
            this.mesh.rotation.z = 0;
        }

        //原点からどれだけ離れているか
        const distance = Math.sqrt(
            this.mesh.position.x * this.mesh.position.x +
                this.mesh.position.y * this.mesh.position.y
        );

        if (frame / 2 > distance) {
            this.mesh.rotation.y += 0.1;
            this.mesh.rotation.z += 0.1;
        }
    }

    setPosition(x, y, z) {
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;
    }
}

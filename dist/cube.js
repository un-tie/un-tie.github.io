import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/110/three.module.js";

export default class Cube{
    constructor(x,y,z){
        this.geometry = new THREE.BoxGeometry(x,y,z);
        this.material = new THREE.MeshPhongMaterial({color: 0xffffff});
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }

    update(){
        this.mesh.rotation.y += 0.075;
        this.mesh.rotation.z += 0.075;
    }

    setPosition(x,y,z){
        this.mesh.position.x = x;
        this.mesh.position.y = y;
        this.mesh.position.z = z;
    }
}
import * as THREE from '../libs/three.module.js'
import { Box3Helper } from './libs/three.module.js';
class Cubo extends THREE.Object3D {
    constructor() {
      super();
      var geometria = new THREE.BoxGeometry(10,10,10);
      geometria.translate(0,5,0);

      var material = new THREE.MeshPhongMaterial({color:0x000000});

      var cubo = new THREE.Mesh(geometria,material);

      cubo.position.set(-50,0,0);

      this.add(cubo);

      this.caja = new THREE.Box3();
      this.caja.setFromObject(cubo);


      var cajaVisible = new THREE.Box3Helper(this.caja, 0xFF0000);
      this.add(cajaVisible);
      this.name = "cubo";
      cubo.name = "cubo";

    }
}
export {Cubo};
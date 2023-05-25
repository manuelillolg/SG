import * as THREE from '../libs/three.module.js';
import { CSG } from '../libs/CSG-v2.js';

 
class Llave extends THREE.Object3D {
  constructor() {
    super();
    this.obtenida = false;
    this.llave = this.createLlave();
    this.llave.userData = this;
    this.llave.rotateX(90*(Math.PI/180));
    
    this.add(this.llave);
  }

  cogida(){
    return this.obtenida;
  }

  createLlave(){
    var llave = new CSG();

    var exteriorG =  new THREE.CylinderGeometry( 1, 1, 0.5, 32 ); 

    var exteriorM = new THREE.MeshPhongMaterial({color:0xe8ff00});

    var exterior = new THREE.Mesh(exteriorG, exteriorM);

    var interiorG = new THREE.CylinderGeometry(0.5, 0.5, 0.5, 32)
    var interior = new THREE.Mesh(interiorG, exteriorM);

    var cuerpoG = new THREE.CylinderGeometry( 0.2, 0.2, 4, 32);
    cuerpoG.rotateX(-90*(Math.PI/180));
    var cuerpo = new THREE.Mesh(cuerpoG, exteriorM);

    var dienteG = new THREE.CylinderGeometry( 0.2, 0.2, 1, 32);
    dienteG.rotateZ(90*(Math.PI/180));

    var diente = new THREE.Mesh(dienteG, exteriorM);
    diente.position.z +=  0.2+4;
    diente.position.x += 1/2;

    cuerpo.position.z += 2 + 0.5;
    llave.subtract([exterior,interior]);
    llave.union([cuerpo,diente]);

    diente.position.z -=0.5;
    llave.union([diente]);

    return llave.toMesh();
  }

  recibeClick(){
    //console.log("Click en llave");
    this.obtenida = true;
    this.llave.material.transparent = true;
    this.llave.material.opacity = 0.1;
    this.llave.material.needsUpdate = true;
  }

  horizontal(){
    this.llave.rotateX(-90*(Math.PI/180));
  }

  update(){
    this.llave.rotation.z += 0.05;
  }
}

export {Llave};

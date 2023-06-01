import * as THREE from '../libs/three.module.js'
import { MTLLoader } from '../libs/MTLLoader.js'
import { OBJLoader } from '../libs/OBJLoader.js' 
 
class Inodoro extends THREE.Object3D {
  constructor() {
    super();
  
    var materialLoader = new MTLLoader();
    var objectLoader = new OBJLoader();
    materialLoader.load('../models/urinal/Urinal.mtl',
      (materials) => {
        objectLoader.setMaterials(materials);
        objectLoader.load('../models/urinal/Urinal.obj',
      (object) => {
        var modelo = object;
        modelo.name="inodoro";
        this.add (modelo);
      }, null, null);
    });
    
    this.scale.set(4,4,4);    
    var cajaChoqueGeom =new THREE.BoxGeometry(2,4,1.5);
    cajaChoqueGeom.translate(0,1,0);
    var cajaChoqueMat = new THREE.MeshPhongMaterial({color:0xff0000});
    cajaChoqueMat.visible = true;
    cajaChoqueMat.transparent = true;
    cajaChoqueMat.opacity = 0.0;
    var caja = new THREE.Mesh(cajaChoqueGeom,cajaChoqueMat);
    caja.name="cajaChoque";
    this.add(caja);
  }

}

export { Inodoro };
import * as THREE from './libs/three.module.js'
import {CSG} from './libs/CSG-v2.js'
import {Banio} from './Banio.js'
 
class EsqueletoBaño extends THREE.Object3D {
  constructor(llaveAsociada){
    super();
    var muroG = new THREE.BoxGeometry(100,30,5);
    muroG.translate(0,15,0);

    this.banio = new Banio(llaveAsociada);

    var material = new THREE.MeshPhongMaterial({color:0xB8B9B8}); 

    var muro1 = new  THREE.Mesh(muroG,material);
    var muro2 = new  THREE.Mesh(muroG,material);
    var muro3 = new  THREE.Mesh(muroG,material);
    var muro4 = new  THREE.Mesh(muroG,material);

    //Colocamos los muros 
    muro1.position.z+=47.5;

    //muro2
    muro2.rotateY(90 *(Math.PI/180));
    muro2.position.x += 47.5;

    //muro3
    muro3.rotateY(90 *(Math.PI/180));
    muro3.position.x -= 47.5;

    //muro4
    muro4.position.z-=47.5;

    

    //Quitamos la puerta

    var puertaGeom = new THREE.BoxGeometry(15,22,5);
    puertaGeom.translate(0,11,0);
    var puerta = new THREE.Mesh(puertaGeom, material);
    puerta.rotateY(90*(Math.PI/180));

    puerta.position.set(-2.5-45,0,0);

    var muros = new CSG();
    //muros.union([muro2]);
    muros.subtract([muro3,puerta]);

    //muros.subtract([puerta]);


    var muro = muros.toMesh();

    
    
    

    this.add(muro1,muro2,muro,muro4,this.banio);
    
  }
}

export { EsqueletoBaño };

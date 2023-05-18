import * as THREE from './libs/three.module.js'
import {CSG} from './libs/CSG-v2.js'

import {Puerta} from './Puerta.js'
 
class EsqueletoCuarto extends THREE.Object3D {
  constructor(){
    super();
    var muroG = new THREE.BoxGeometry(60,30,5);
    muroG.translate(0,15,0);

    var material = new THREE.MeshPhongMaterial({color:0xB8B9B8}); 

    var muro1 = new  THREE.Mesh(muroG,material);
    var muro2 = new  THREE.Mesh(muroG,material);
    var muro3 = new  THREE.Mesh(muroG,material);
    var muro4 = new  THREE.Mesh(muroG,material);

    //Colocamos los muros 
    muro1.position.z+=27.5;

    //muro2
    muro2.rotateY(90 *(Math.PI/180));
    muro2.position.x += 27.5;

    //muro3
    muro3.rotateY(90 *(Math.PI/180));
    muro3.position.x -= 27.5;

    //muro4
    muro4.position.z-=27.5;

    var muros = new CSG();
    muros.union([muro1,muro2,muro3,muro4]);

    //Quitamos la puerta

    var puertaGeom = new THREE.BoxGeometry(15,22,5);
    puertaGeom.translate(0,11,-2.5);
    var puerta = new THREE.Mesh(puertaGeom, material);

    puerta.position.set(0,0,-25);

    muros.subtract([puerta]);


    var salida = muros.toMesh();

    this.add(salida);


    //Puerta
    this.puerta = new Puerta();
    this.puerta.rotation.y = Math.PI/2;

    this.puertaPosicionada = new THREE.Object3D();

    this.puertaPosicionada.add(this.puerta);

    this.puertaPosicionada.rotation.y = Math.PI/2;
    this.puertaPosicionada.position.set(7.5,0,-27.5);
    this.add(this.puertaPosicionada);
  }
}

export { EsqueletoCuarto };

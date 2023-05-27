import * as THREE from './libs/three.module.js'
import {CSG} from './libs/CSG-v2.js'

import {Puerta} from './Puerta.js'
 
class EsqueletoCuarto extends THREE.Object3D {
  constructor(llave){
    super();
    var muroG = new THREE.BoxGeometry(60,30,5);
    muroG.translate(0,15,0);

    var material = this.createTextura("./imgs/pared.jpg", "./imgs/paredNormal.jpg",3,3,0.2,3);

    var muro1 = new  THREE.Mesh(muroG,material);
    muro1.scale.x = 0.95;
    var muro2 = new  THREE.Mesh(muroG,material);
    muro2.scale.x = 0.95;
    var muro3 = new  THREE.Mesh(muroG,material);
    muro3.scale.x = 0.95;
    var muro4 = new  THREE.Mesh(muroG,material);

    var muroIzquierdaGeom = new THREE.BoxGeometry(22.5,30,5);
    muroIzquierdaGeom.translate(0,15,0);
    var muroIM = this.createTextura("./imgs/pared.jpg", "./imgs/paredNormal.jpg",1,3,0.2,3);

    var izquierda = new THREE.Mesh(muroIzquierdaGeom,muroIM);
    izquierda.position.set(-22.5/2-7.5,0,-2.5-25);
  
    this.add(izquierda);

    var derecha = new THREE.Mesh(muroIzquierdaGeom,muroIM);
    derecha.position.set(22.5/2+7.5,0,-2.5-25);
    this.add(derecha);

    var muroArribaG = new THREE.BoxGeometry(15,8,5);
    muroArribaG.translate(0,4+22,-2.5-25);
    var muroArribaM = this.createTextura("./imgs/pared.jpg", "./imgs/paredNormal.jpg",1,1,3,1 );
    var arriba = new THREE.Mesh(muroArribaG,muroArribaM);
    this.add(arriba);



    //Colocamos los muros 
    muro1.position.z+=27.5;

    //muro2
    muro2.rotateY(90 *(Math.PI/180));
    muro2.position.x += 27.5;

    //muro3
    muro3.rotateY(90 *(Math.PI/180));
    muro3.position.x -= 27.5;

    
    this.add(muro1,muro2,muro3);


    //Puerta
    this.puerta = new Puerta();
    this.puerta.asociaLlave(llave);
    this.puerta.rotation.y = Math.PI/2;

    this.puertaPosicionada = new THREE.Object3D();

    this.puertaPosicionada.add(this.puerta);

    this.puertaPosicionada.rotation.y = Math.PI/2;
    this.puertaPosicionada.position.set(7.5,0,-27.5);
    this.add(this.puertaPosicionada);
  }
  createTextura(imagen,imagenNormal,x,y,xLateral,yLateral){
    var loader = new THREE.TextureLoader();
    var normal = loader.load(imagenNormal);
    var plana =loader.load(imagen);
    var lateralN = loader.load(imagenNormal);
    var lateralP =loader.load(imagen);
    

    normal.repeat.set(x,y);
    normal.wrapS = THREE.RepeatWrapping;
    normal.wrapT = THREE.RepeatWrapping;

    plana.repeat.set(x,y);
    plana.wrapS = THREE.RepeatWrapping;
    plana.wrapT = THREE.RepeatWrapping;

    lateralN.repeat.set(xLateral,yLateral);
    lateralN.wrapS = THREE.RepeatWrapping;
    lateralN.wrapT = THREE.RepeatWrapping;

    lateralP.repeat.set(xLateral,yLateral);
    lateralP.wrapS = THREE.RepeatWrapping;
    lateralP.wrapT = THREE.RepeatWrapping;

    var material = [
      new THREE.MeshPhongMaterial({ color:0xFFFFFF,map:lateralP, normalMap:lateralN}), //frontal
      new THREE.MeshPhongMaterial({ color:0xFFFFFF ,map:lateralP, normalMap:lateralN}), //trasera
      new THREE.MeshPhongMaterial({ color:0xFFFFFF,map:lateralP, normalMap:lateralN }), //superior
      new THREE.MeshPhongMaterial({ color:0xFFFFFF,map:lateralP, normalMap:lateralN}), //inferior
      new THREE.MeshPhongMaterial({ color:0xFFFFFF ,map:plana, normalMap:normal}), //derecha
      new THREE.MeshPhongMaterial({ color:0xFFFFFF,map:plana, normalMap:normal})  //izquierda
    ];

    return material;


  }
}

export { EsqueletoCuarto };

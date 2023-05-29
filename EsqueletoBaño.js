import * as THREE from './libs/three.module.js'
import {CSG} from './libs/CSG-v2.js'
import {Banio} from './Banio.js'
 
class EsqueletoBaño extends THREE.Object3D {
  constructor(llaveAsociada){
    super();
    var muroG = new THREE.BoxGeometry(100,30,5);
    muroG.translate(0,15,0);

    this.banio = new Banio(llaveAsociada);


    var material = this.createTextura("./imgs/pared.jpg","./imgs/paredNormal.jpg",6,3,0.4,3);

    var muro1 = new  THREE.Mesh(muroG,material);
    muro1.scale.x = 0.95;
    var muro2 = new  THREE.Mesh(muroG,material);
    muro2.scale.x = 0.95;
    var muro4 = new  THREE.Mesh(muroG,material);
    muro4.scale.x = 0.95;

    var lateralM = this.createTextura("./imgs/pared.jpg","./imgs/paredNormal.jpg",2,3,0.4,3);
    var lateralG = new THREE.BoxGeometry(42.5,30,5);
    lateralG.rotateY(90*(Math.PI/180));
    lateralG.translate(-2.5-45,15,0);

    var izquierda = new THREE.Mesh(lateralG,lateralM);
    izquierda.position.z += 7.5+42.5/2;
    this.add(izquierda);

    var derecha = new THREE.Mesh(lateralG, lateralM);
    derecha.position.z -= 7.5+42.5/2;
    this.add(derecha);

    var muroArribaG = new THREE.BoxGeometry(15,8,5);
    muroArribaG.rotateY(90*(Math.PI/180));
    muroArribaG.translate(-2.5-45,4+22,0);
    var muroArribaM = this.createTextura("./imgs/pared.jpg", "./imgs/paredNormal.jpg",1,1,3,1 );
    var arriba = new THREE.Mesh(muroArribaG,muroArribaM);
    this.add(arriba);

    //Colocamos los muros 
    muro1.position.z+=47.5;

    //muro2
    muro2.rotateY(90 *(Math.PI/180));
    muro2.position.x += 47.5;

    //muro4
    muro4.position.z-=47.5;
    

    this.add(muro1,muro2,muro4,this.banio);
    
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

export { EsqueletoBaño };

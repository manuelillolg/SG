import * as THREE from './libs/three.module.js'
import {CSG} from './libs/CSG-v2.js'
import {Clase} from './Clase.js'
 
class EsqueletoClase extends THREE.Object3D {
  constructor(listener){
    super();
    var muroG = new THREE.BoxGeometry(160,30,5);
    muroG.translate(0,15,0);

    var loader = new THREE.TextureLoader();
    var gotele = loader.load("./imgs/pared.jpg");
    gotele.repeat.set(10,3);
    gotele.wrapS = THREE.RepeatWrapping;
    gotele.wrapT = THREE.RepeatWrapping;

    var goteleLateral = loader.load("./imgs/pared.jpg");
    var goteleLateralNormal = loader.load("./imgs/paredNormal.jpg");
    var goteleNormal = loader.load("./imgs/paredNormal.jpg");
    goteleNormal.repeat.set(2,2);
    goteleNormal.wrapS = THREE.RepeatWrapping;
    goteleNormal.wrapT = THREE.RepeatWrapping;

    goteleLateral.repeat.set(0.4,3);
    goteleLateral.wrapS = THREE.RepeatWrapping;
    goteleLateral.wrapT = THREE.RepeatWrapping;

    goteleLateralNormal.repeat.set(0.4,3);
    goteleLateralNormal.wrapS = THREE.RepeatWrapping;
    goteleLateralNormal.wrapT = THREE.RepeatWrapping;


    var material = [
      new THREE.MeshPhongMaterial({ color:0xFFFFFF,map:goteleLateral, normalMap:goteleLateralNormal}), //frontal
      new THREE.MeshPhongMaterial({ color:0xFFFFFF }), //trasera
      new THREE.MeshPhongMaterial({ color:0xFFFFFF }), //superior
      new THREE.MeshPhongMaterial({ color:0xFFFFFF}), //inferior
      new THREE.MeshPhongMaterial({ color:0xFFFFFF ,map:gotele, normalMap:goteleNormal}), //derecha
      new THREE.MeshPhongMaterial({ color:0xFFFFFF,map:gotele, normalMap:goteleNormal})  //izquierda
    ];
    var muro1 = new  THREE.Mesh(muroG,material);

    //Muro1 se va a dividir en 3 del siguiente modo
    var derecha, izquierda, arriba;

    //materialArriba
    var materialArriba = this.createTextura("./imgs/pared.jpg", "./imgs/paredNormal.jpg",1,1,3,1 );
    var materialLateral = this.createTextura("./imgs/pared.jpg", "./imgs/paredNormal.jpg",6,3,0.3,3)
    
    var derechaGeom = new THREE.BoxGeometry(72.5,30,5);
    derechaGeom.translate(0,15,0);
    derecha = new THREE.Mesh(derechaGeom,materialLateral);

    izquierda = new THREE.Mesh(derechaGeom,materialLateral);
    var arribaGeom = new THREE.BoxGeometry(15,8,5);
    arribaGeom.translate(0,4,0);
    arriba = new THREE.Mesh(arribaGeom,materialArriba);


    var muro2 = new  THREE.Mesh(muroG,material);
    muro2.scale.x = 0.95;
    muro2.name = "muro derecho";
    var muro3 = new  THREE.Mesh(muroG,material);
    muro3.scale.x = 0.95;
    var muro4 = new  THREE.Mesh(muroG,material);
    muro4.scale.x = 0.95;


    //Colocamos los muros 
    izquierda.position.z +=77.5;
    izquierda.position.x = -36.25-2.5-5;

    derecha.position.x = 36.25+2.5+5;
    derecha.position.z = 77.5;

    arriba.position.y = 22;
    arriba.position.z = 77.5;

    //muro1
    muro1.position.z = 77.5;
    //muro2
    muro2.rotateY(90 *(Math.PI/180));
    muro2.position.x += 77.5;

    //muro3
    muro3.rotateY(90 *(Math.PI/180));
    muro3.position.x -= 77.5;

    //muro4
    muro4.position.z-=77.5;

    var muros = new CSG();
    muros.union([muro1,muro2,muro3,muro4]);    
    
    var clase = new Clase(listener);
    clase.position.set(-75,0,-75);

    var claseOrientada = new THREE.Object3D();
    claseOrientada.add(clase);
    claseOrientada.rotateY(180*(Math.PI/180));

    this.add(muro2,muro3,muro4,izquierda,derecha,arriba,claseOrientada);

    //control de colisiones
    var caja = new THREE.Box3();
    caja.setFromObject(izquierda);

    var caja2 = new THREE.Box3();
    caja2.setFromObject(derecha);

    var caja3 = new THREE.Box3();
    caja3.setFromObject(arriba);

    var caja4 = new THREE.Box3();
    caja4.setFromObject(muro2);
    var caja5 = new THREE.Box3();
    caja5.setFromObject(muro3);

    var caja6 = new THREE.Box3();
    caja6.setFromObject(muro4);


    this.name = "clase";
    
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

export { EsqueletoClase };

import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

import { Inodoro } from './Inodoro.js'
import { Puerta } from './Puerta.js'
 
class Banio extends THREE.Object3D {
  constructor(llaveAsociada,listener) {
    super();

    this.inodoros = this.crearInodoros();
    this.add(this.inodoros[0]);
    this.add(this.inodoros[1]);
    this.add(this.inodoros[2]);

    this.separador = this.crearCuartoSeparador();
    this.add(this.separador);
    
    //Lavabos
    var lav1 = this.crearLavabo();
    var lav2 = this.crearLavabo();

    lav1.position.set(0,0,40.5);
    lav2.position.set(-30,0,40.5);

    this.add(lav1);
    this.add(lav2);

    //Puerta
    this.puerta = new Puerta(listener);
    this.puerta.rotation.y = Math.PI/2;
    this.puerta.position.set(-47.5,0,+7.5);
    this.puerta.asociaLlave(llaveAsociada);
    this.add(this.puerta);
  }

  crearInodoros(){
    //Creación de los inodoros
    var ino1 = new Inodoro();
    ino1.position.set(0,4,-41.5);
    

    var ino2 = new Inodoro();
    ino2.position.set(25,4,-41.5);
   

    var ino3 = new Inodoro();
    ino3.position.set(-25,4,-41.5);
    
    return [ino1,ino2,ino3];
  }

  crearCuartoSeparador(){
    //Crear cuarto pequeño
    var loader = new THREE.TextureLoader();
    var gotele = loader.load("./imgs/pared.jpg");
    gotele.repeat.set(3,3);
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


    //reamos los materiales para las distintas caras
    var materials = [
      new THREE.MeshPhongMaterial({ color:0xFFFFFF,map:goteleLateral, normalMap:goteleLateralNormal}), //frontal
      new THREE.MeshPhongMaterial({ color:0xFFFFFF }), //trasera
      new THREE.MeshPhongMaterial({ color:0xFFFFFF }), //superior
      new THREE.MeshPhongMaterial({ color:0xFFFFFF}), //inferior
      new THREE.MeshPhongMaterial({ color:0xFFFFFF ,map:gotele, normalMap:goteleNormal}), //derecha
      new THREE.MeshPhongMaterial({ color:0xFFFFFF,map:gotele, normalMap:goteleNormal})  //izquierda
    ];

    
    var boxgeo = new THREE.BoxGeometry(40,30,5);
    
    var separador = new THREE.Mesh(boxgeo,materials);

    separador.rotation.y = Math.PI/2;
    separador.position.set(15,15,25);
   
    return separador;
  }

  crearLavabo(){

    var lavaboCSG = new CSG();

    var cilindroGeo = new THREE.CylinderGeometry(2, 2, 12, 50);
    var cilindroMat = new THREE.MeshPhongMaterial({color: 0xffffff});

    //Base
    var base = new THREE.Mesh(cilindroGeo, cilindroMat);
    base.position.set(0,6,0);

    //Cabeza
    var cilindroGeo2 = new THREE.CylinderGeometry(6, 2, 4, 4);
    var cabeza = new THREE.Mesh(cilindroGeo2, cilindroMat);
    cabeza.rotation.y = Math.PI/4;
    cabeza.position.set(0,13,0);

    //Hueco
    var cilindroInterior = new THREE.CylinderGeometry(5, 1, 4, 4);
    var interior = new THREE.Mesh(cilindroInterior, cilindroMat);
    interior.rotation.y = Math.PI/4;
    interior.position.set(0,13,0);

    //Grifo
    var grifo = new CSG();

    var cilindroGrifoGeo1 = new THREE.CylinderGeometry(0.25, 0.25, 1.5, 50);
    var cilindroGrifo1 = new THREE.Mesh(cilindroGrifoGeo1, cilindroMat);
    cilindroGrifo1.rotation.z = Math.PI/2;
    cilindroGrifo1.position.set(0,16,4);

    var cilindroGrifoGeo2 = new THREE.CylinderGeometry(0.25, 0.25, 1, 50);
    var cilindroGrifo2 = new THREE.Mesh(cilindroGrifoGeo2, cilindroMat);
    cilindroGrifo2.scale.set(1,3,1);
    cilindroGrifo2.position.set(0,1.5,0);
    cilindroGrifo2.position.set(0,16.5,4);

    grifo.union([cilindroGrifo1, cilindroGrifo2]);

    grifo = grifo.toMesh();


    //Resultado
    lavaboCSG.union([base, cabeza, grifo]);
    lavaboCSG.subtract([interior]);

    var lavabo = lavaboCSG.toMesh();

    return lavabo;
  
  }
  
}

export { Banio };

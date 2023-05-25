import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

import { Inodoro } from './Inodoro.js'
import { Box } from './Box.js'
import { Lavamanos } from './Lavamanos.js'
import { Water } from './Water.js'
import { Puerta } from './Puerta.js'
 
class Banio extends THREE.Object3D {
  constructor(llaveAsociada) {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
   

    //this.crearParedes();

    this.crearInodoros();

    this.crearCuartoSeparador();


    //NO FUNCIONA
    // //Creación de los lavamanos

    // var lav1 = new Lavamanos();
    // lav1.position.set(0,0,0);
    // //this.add(lav1);


    // //Creacion del water

    // var water = new Water();
    // water.position.set(0,0,0);
    // //this.add(water);
    
    //Lavabos
    var lav1 = this.crearLavabo();
    var lav2 = this.crearLavabo();

    lav1.position.set(0,0,40.5);
    lav2.position.set(-30,0,40.5);

    this.add(lav1);
    this.add(lav2);

    //Puerta
    this.puerta = new Puerta();
    this.puerta.rotation.y = Math.PI/2;
    this.puerta.position.set(-47.5,0,+7.5);
    this.puerta.asociaLlave(llaveAsociada);
    this.add(this.puerta);
  }

  crearParedes(){
    this.box1 = new Box();
    this.box1.position.set(0,0,-47.5);
    this.add(this.box1);

    this.box2 = new Box();
    this.box2.position.set(0,0,47.5);
    this.add(this.box2);

    this.box3 = new Box();
    this.box3.rotation.y = Math.PI/2;
    this.box3.position.set(47.5,0,0);
    this.add(this.box3);

    this.box4 = new Box();
    this.box4.rotation.y = Math.PI/2;
    this.box4.position.set(-47.5,0,0);
    this.add(this.box4);

  }

  crearInodoros(){
    //Creación de los inodoros
    var ino1 = new Inodoro();
    ino1.position.set(0,4,-41.5);
    this.add(ino1);

    var ino2 = new Inodoro();
    ino2.position.set(25,4,-41.5);
    this.add(ino2);

    var ino3 = new Inodoro();
    ino3.position.set(-25,4,-41.5);
    this.add(ino3);
  }

  crearCuartoSeparador(){
    //Crear cuarto pequeño

    var boxgeo = new THREE.BoxGeometry(40,30,5);
    var boxmat = new THREE.MeshPhongMaterial({color:0xB8B9B8});
    var separador = new THREE.Mesh(boxgeo,boxmat);

    separador.rotation.y = Math.PI/2;
    separador.position.set(15,15,25);
    this.add(separador);
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

    // var cilindroGrifo2 = new THREE.CylinderGeometry(0.25, 0.25, 1.5, 50);
    // var grifoExtrusion = new THREE.Shape();

    // grifoExtrusion = cilindroGrifo2.pts;

    // var pts = [];
    // pts.push(new THREE.Vector3(0,0,0));
    // pts.push(new THREE.Vector3(0,2,0));
    // pts.push(new THREE.Vector3(2,2,0));

    // var options = { depth : 8 , steps : 2 , curveSegments : 4, bevelThickness : 4, bevelSize : 2, bevelSegments : 2, extrudepath: pts };

    // var extrusionGeometry = new THREE.ExtrudeGeometry( grifoExtrusion , options );
    // var extrusionMesh = new THREE.Mesh( extrusionGeometry , cilindroMat ) ;

    // extrusionMesh.rotation.z = Math.PI/2;
    // extrusionMesh.position.set(0,16,4);

    // grifo.union([cilindroGrifo1, extrusionMesh]);

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

import * as THREE from './libs/three.module.js'
import { EsqueletoClase } from './EsqueletoClase.js';
import { EsqueletoCuarto } from './EsqueletoCuarto.js';
import { EsqueletoBaño } from './EsqueletoBaño.js';

class EsqueletoPlanta extends THREE.Object3D {
  constructor(){
    super();

    var clase1 = new EsqueletoClase();
    clase1.name = "clase1";
    var clase2 = new EsqueletoClase();
    clase2.name = "clase2";
    var clase3 = new EsqueletoClase();
    clase3.name = "clase3";
    var clase4 = new EsqueletoClase();
    clase4.name = "clase4";

    var loader = new THREE.TextureLoader();
    var marmol = loader.load("./imgs/marmol-blanco.jpg")
    marmol.repeat.set(30,30);
    marmol.wrapS = THREE.RepeatWrapping;
    marmol.wrapT = THREE.RepeatWrapping;

    //Colocamos las clases
    clase1.position.x = -80-160;
    clase1.position.z = -80;

    clase2.position.x = -80;
    clase2.position.z = -80;

    clase3.position.x = +80;
    clase3.position.z = -80;

    clase4.position.x = +80+160;
    clase4.position.z = -80;

    //Muros
    var muroG = new THREE.BoxGeometry(1,1,1);
    muroG.translate(0,0.5,0);

    var material = new THREE.MeshPhongMaterial({color:0xB8B9B8}); 

    var muroFin = new THREE.Mesh(muroG,material);

    muroFin.scale.x = 40;
    muroFin.scale.z = 5;
    muroFin.scale.y = 30;

    muroFin.rotateY(90*(Math.PI/180));
    muroFin.position.x = 2.5 -320;
    muroFin.position.z = 20;

    //Muro Pasillo
    var muroPasillo = new THREE.Mesh(muroG,material);

    muroPasillo.scale.set(160*2,30,5);
    muroPasillo.position.set(-80*2,0,40);

    //Cuarto
    var cuarto = new EsqueletoCuarto();
    cuarto.name = "cuarto";
    cuarto.position.set(30,0,30+37.5);


    //baño
    var baño = new EsqueletoBaño();
    baño.name = "baño";
    baño.position.set(50+160*2,0,50);

    //MuroSalida
    var muroSalida = new THREE.Mesh(muroG, material);
    muroSalida.scale.set(260,30,5);
    muroSalida.position.set(130+60,0,40+55);


    //Suelo
    var color = new THREE.MeshPhongMaterial({color: 0xF1F5C8, map: marmol});  
    var sueloG = new  THREE.BoxGeometry(900,2,800);
    sueloG.translate(0,-1,0);
    var suelo = new THREE.Mesh(sueloG,color);

    this.add(clase1, clase2, clase3, clase4, muroFin, muroPasillo,cuarto,baño,muroSalida, suelo);

    //Candidatos de colisiones
    this.candidates = clase1.candidates;
    this.pickeableObjects = clase1.pickeableObjects;

    this.name = "planta";
  }

  getCandidatos(){
    return this.candidates;
  }
}

export { EsqueletoPlanta };

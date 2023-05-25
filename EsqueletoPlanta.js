import * as THREE from './libs/three.module.js'
import { EsqueletoClase } from './EsqueletoClase.js';
import { EsqueletoCuarto } from './EsqueletoCuarto.js';
import { EsqueletoBaño } from './EsqueletoBaño.js';
import {Boton} from './Boton.js';
import {Proyector} from './Proyector.js';
import {Proyeccion} from './Proyeccion.js';
import {Llave} from './Llave.js';

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


    //Boton
    var materialBoton1 = new THREE.MeshPhongMaterial({color:0xFF0000});
    this.boton = new Boton(materialBoton1);
    this.boton.name = "Boton1";
    this.boton.position.x = -150-1-75-15;
    this.boton.position.z = -75-5-1-3;
    this.boton.position.y = 7+1;
    this.add(this.boton);

    //Boton2
    var materialBoton2 = new THREE.MeshPhongMaterial({color:0x0000FF});
    this.boton2 = new Boton(materialBoton2);
    this.boton2.name="Boton2";
    this.boton2.position.x = -150-1-75-15+5;
    this.boton2.position.z = -75-5-1-3;
    this.boton2.position.y = 7+1;

    this.add(this.boton2);

    //Proyector
    this.proyector = new Proyector();
    this.proyector.scale.set(0.5,0.5,-0.5);
    this.proyector.position.x = -150-1-75-20-15-10;
    this.proyector.position.z = -75-5-1-3;
    this.proyector.position.y  = 7;
    
    this.proyector.name ="Proyector";
    
    
    this.add(this.proyector);

    //Proyeccion
    this.proyeccion = new Proyeccion('imgs/diapositiva.jpg', 10, 10);
    this.proyeccion.position.z = -5-150+0.2;
    this.proyeccion.name ="Diapositiva";
    this.proyeccion.position.x = -5-150-5-5-150;
    this.add(this.proyeccion);

    //Proyeccion fondo
    this.proyeccionFondo = new Proyeccion('imgs/fondo.jpg', 30, 30);
    this.proyeccionFondo.position.z = -5-150+0.1;
    this.proyeccionFondo.position.x = -5-150-5-5-150;
    this.add(this.proyeccionFondo);

    //Llave
    this.llave = new Llave();
    this.llave.position.x = -150-1-75-20-15-10;
    this.llave.position.z =  -75-5-1-3-30;
    this.llave.position.y = 15;
    this.llave.name="llave2";
 

    this.llave.llave.material.transparent = true;
    this.llave.llave.material.opacity = 0;
    this.add(this.llave)
    
  }

  getCandidatos(){
    return this.candidates;
  }

  muestraLlave(){
    this.llave.llave.material.transparent = false;
    this.llave.llave.material.opacity = 1;

  }

  update(){
    if (this.llave.parent) {
      this.llave.update();
    }

    this.proyector.update();
  }
}

export { EsqueletoPlanta };

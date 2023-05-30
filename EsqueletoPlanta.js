import * as THREE from './libs/three.module.js'
import { EsqueletoClase } from './EsqueletoClase.js';
import { EsqueletoCuarto } from './EsqueletoCuarto.js';
import { EsqueletoBaño } from './EsqueletoBaño.js';
import {Boton} from './Boton.js';
import {Proyector} from './Proyector.js';
import {Proyeccion} from './Proyeccion.js';
import {Llave} from './Llave.js';
import {Puerta} from './Puerta.js';

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

    

    var materialFin = this.createTextura("./imgs/pared.jpg","./imgs/paredNormal.jpg",2,3,1,1);
    var muroFin = new THREE.Mesh(muroG,materialFin);

    muroFin.scale.x = 40;
    muroFin.scale.z = 5;
    muroFin.scale.y = 30;

    muroFin.rotateY(90*(Math.PI/180));
    muroFin.position.x = 2.5 -320;
    muroFin.position.z = 20;

    //Muro Pasillo
    var materialPasillo= this.createTextura("./imgs/pared.jpg","./imgs/paredNormal.jpg",20,3,1,1)
    var muroPasillo = new THREE.Mesh(muroG,materialPasillo);


    muroPasillo.scale.set(160*2,30,5);
    muroPasillo.position.set(-80*2,0,40);

    //Llave2
    this.llave = new Llave();
    this.llave.position.x = -150-1-75-20-15-10;
    this.llave.position.z =  -75-5-1-3-30;
    this.llave.position.y = 15;
    this.llave.name="llave2";
    this.llave.llave.material.transparent = true;
    this.llave.llave.material.opacity = 0;
    this.add(this.llave);
    
    //Llave1
    this.llave1 = new Llave();
    this.llave1.horizontal();
    this.llave1.position.x = 1+25+150+150+80;
    this.llave1.position.z = 80;
    
     //this.llave1.position.y = 4;
     //this.llave1.position.z = 2;
    //this.llave1.position.x = 350;
    //this.llave1.position.z =  50;
    this.llave1.name="llave1";
    this.add(this.llave1);

    

    //Cuarto
    this.cuarto = new EsqueletoCuarto(this.llave, this);
    this.cuarto.name = "cuarto";
    this.cuarto.position.set(30,0,30+37.5);


    

    //baño
    var baño = new EsqueletoBaño(this.llave1);
    baño.name = "baño";
    baño.position.set(50+160*2,0,50);
    

    

    //MuroSalidaDerecha
    var muroSalidaG = new THREE.BoxGeometry(122.5,30,5);
    var muroSalidaM = this.createTextura("./imgs/pared.jpg","./imgs/paredNormal.jpg",10,3,0.4,3);
    var muroSalidaDerecha = new THREE.Mesh(muroSalidaG,muroSalidaM);
    muroSalidaDerecha.position.set(122.5/2+60,15,2.5+40+5+50);
    this.add(muroSalidaDerecha);

    //MuroSalidIzquierda
    var muroSalidaIzquierda = new THREE.Mesh(muroSalidaG,muroSalidaM);
    muroSalidaIzquierda.position.set((122.5/2)+122.5+60+15,15,2.5+40+5+50);
    this.add(muroSalidaIzquierda);

    //MuroSalidaArriba
    var muroArribaG = new THREE.BoxGeometry(15,8,5);
    muroArribaG.translate(7.5+60+122.5,4+22,-2.5+40+60);
    var muroArribaM = this.createTextura("./imgs/pared.jpg", "./imgs/paredNormal.jpg",1,1,3,1 );
    var arriba = new THREE.Mesh(muroArribaG,muroArribaM);
    this.add(arriba);


    //Puerta de salida
    this.puertaSalida = new Puerta();
    this.puertaSalida.name = "puertaSalida";
    this.puertaSalida.cambiarLock();
    this.pomoPuertaSalida = this.puertaSalida.getObjectByName("esferaPomo");
    console.log(this.pomoPuertaSalida);
    this.pomoPuertaSalida.material = new THREE.MeshPhongMaterial({ color: 0xffff00 });

    this.puertaSalida.rotation.y = Math.PI/2;

    this.puertaPosicionada = new THREE.Object3D();

    this.puertaPosicionada.add(this.puertaSalida);

    this.puertaPosicionada.rotation.y = Math.PI/2;
    this.puertaPosicionada.position.set(15+60+122.5,0,-1.5+40+60);
    this.add(this.puertaPosicionada);


    //Suelo
    var color = new THREE.MeshPhongMaterial({color: 0xF1F5C8, map: marmol});  
    var sueloG = new  THREE.BoxGeometry(900,2,800);
    sueloG.translate(0,-1,0);
    var suelo = new THREE.Mesh(sueloG,color);

    this.add(clase1, clase2, clase3, clase4, muroFin, muroPasillo,this.cuarto,baño, suelo);

    //Candidatos de colisiones
    this.candidates = clase1.candidates;
    this.pickeableObjects = clase1.pickeableObjects;

    this.name = "planta";


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


    //Boton
    var materialBoton1 = new THREE.MeshPhongMaterial({color:0xFF0000});
    this.boton = new Boton(materialBoton1,this.proyector, this.proyeccion);
    this.boton.name = "Boton1";
    this.boton.position.x = -150-1-75-15;
    this.boton.position.z = -75-5-1-3;
    this.boton.position.y = 7;
    this.add(this.boton);

    //Boton2
    var materialBoton2 = new THREE.MeshPhongMaterial({color:0x0000FF});
    this.boton2 = new Boton(materialBoton2, this.proyector, this.proyeccion);
    this.boton2.name="Boton2";
    this.boton2.position.x = -150-1-75-15+5;
    this.boton2.position.z = -75-5-1-3;
    this.boton2.position.y = 7;

    this.add(this.boton2);

    this.createTecho();

    
  }

  getCandidatos(){
    return this.candidates;
  }

  muestraLlave(){
    this.llave.llave.material.transparent = false;
    this.llave.llave.material.opacity = 1;

  }

  compruebaJuego(){
    var botonLuz1 = this.cuarto.getObjectByName("botonLuz1");
    var botonLuz2 = this.cuarto.getObjectByName("botonLuz2");
    var botonLuz3 = this.cuarto.getObjectByName("botonLuz3");
    var botonLuz4 = this.cuarto.getObjectByName("botonLuz4");

    if (botonLuz1.color === 0xffff00 && botonLuz2.color === 0xffff00 && botonLuz3.color === 0xffff00 && botonLuz4.color === 0xffff00) {
      console.log("Has ganado");
      this.puertaSalida.abrirPuerta();
    }
    
  }

  update(){
    if (this.llave.parent) {
      this.llave.update();
    }

    this.proyector.update();
  }

  createTecho(){
    var loader = new THREE.TextureLoader();
    var gotele = loader.load("./imgs/pared.jpg");
    gotele.repeat.set(90,80);
    gotele.wrapS = THREE.RepeatWrapping;
    gotele.wrapT = THREE.RepeatWrapping;
    var goteleNormal = loader.load("./imgs/paredNormal.jpg");
    goteleNormal.repeat.set(90,80);
    goteleNormal.wrapS = THREE.RepeatWrapping;
    goteleNormal.wrapT = THREE.RepeatWrapping;

    var techoGeom = new THREE.BoxGeometry(900,2,800);
    var color = new THREE.MeshPhongMaterial({color: 0xFFFFFF, map:gotele, normalMap: goteleNormal});  
    
    techoGeom.translate(0,1,0);
    var techo = new THREE.Mesh(techoGeom,color);
    techo.position.y += 30;
    this.add(techo);
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

export { EsqueletoPlanta };

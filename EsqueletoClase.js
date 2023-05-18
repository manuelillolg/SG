import * as THREE from './libs/three.module.js'
import {CSG} from './libs/CSG-v2.js'
import {Clase} from './Clase.js'
 
class EsqueletoClase extends THREE.Object3D {
  constructor(){
    super();
    var muroG = new THREE.BoxGeometry(160,30,5);
    muroG.translate(0,15,0);

    var loader = new THREE.TextureLoader();
    var gotele = loader.load("./imgs/pared.jpg")
    gotele.repeat.set(10,3);
    gotele.wrapS = THREE.RepeatWrapping;
    gotele.wrapT = THREE.RepeatWrapping;
    var material = new THREE.MeshPhongMaterial({color:0xB8B9B8, map:gotele}); 

    var muro1 = new  THREE.Mesh(muroG,material);

    //Muro1 se va a dividir en 3 del siguiente modo
    var derecha, izquierda, arriba;
    
    var derechaGeom = new THREE.BoxGeometry(72.5,30,5);
    derechaGeom.translate(0,15,0);
    derecha = new THREE.Mesh(derechaGeom,material);

    izquierda = new THREE.Mesh(derechaGeom,material);
    var arribaGeom = new THREE.BoxGeometry(15,8,5);
    arribaGeom.translate(0,4,0);
    arriba = new THREE.Mesh(arribaGeom,material);


    var muro2 = new  THREE.Mesh(muroG,material);
    muro2.name = "muro derecho";
    var muro3 = new  THREE.Mesh(muroG,material);
    var muro4 = new  THREE.Mesh(muroG,material);

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

    //Quitamos la puerta

    var puertaGeom = new THREE.BoxGeometry(15,22,5);
    puertaGeom.translate(0,11,2.5);
    var puerta = new THREE.Mesh(puertaGeom, material);

    puerta.position.set(0,0,75);

    muros.subtract([puerta]);


    var salida = muros.toMesh();

    
    
    var clase = new Clase();
    clase.position.set(-75,0,-75);

    var claseOrientada = new THREE.Object3D();
    claseOrientada.add(clase);
    claseOrientada.rotateY(180*(Math.PI/180));

    this.add(salida,claseOrientada);

    salida.name = "salida";

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

    var cajaVisible = new THREE.Box3Helper(caja, 0xFFFF00);
    var cajaVisible2 = new THREE.Box3Helper(caja2, 0xFFFF00);
    var cajaVisible3 = new THREE.Box3Helper(caja3, 0xFFFF00);
    var cajaVisible4 = new THREE.Box3Helper(caja4, 0xFF0000);
    var cajaVisible5 = new THREE.Box3Helper(caja5, 0xFFFF00);
    var cajaVisible6 = new THREE.Box3Helper(caja6, 0xFFFF00);
    
    muro2.boundingBox = caja4;

    cajaVisible.visible = true;
    cajaVisible2.visible = true;
    cajaVisible3.visible = true;
    this.add(cajaVisible, cajaVisible2, cajaVisible3, cajaVisible4,cajaVisible5,cajaVisible6);
    
    this.candidates = [];
    this.candidates.push(caja);
    this.candidates.push(caja2);
    this.candidates.push(caja3);
    this.candidates.push(caja4);
    this.candidates.push(caja5);
    this.candidates.push(caja6);
    this.pickeableObjects = [derecha,izquierda,arriba,muro2,muro3,muro4];

    this.name = "clase";
    
  }

  getCandidatos(){
    return this.candidates;
  }
}

export { EsqueletoClase };

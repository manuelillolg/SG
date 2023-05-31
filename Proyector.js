import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
import { CSG } from '../libs/CSG-v2.js'
 
class Proyector extends THREE.Object3D {
  constructor() {
    super();
    this.posicionY = 0;
    this.posicionX = 0;
    this.baseMesa = this.crearBaseMesa();
    this.add(this.baseMesa);

    this.proyector = new THREE.Object3D();

    this.base = this.crearBase();
    this.proyector.add(this.base);

    this.lente = this.crearLente();
    this.lente.rotation.x = Math.PI/2;
    this.lente.position.set(0,2,5);
    this.proyector.add(this.lente);

    this.palanca = this.crearPalanca();
    this.palanca.scale.set(0.75,0.75,0.75);
    this.palanca.rotation.z = Math.PI/2;
    this.palanca.position.set(-2,2,0);
    this.proyector.add(this.palanca);


    this.proyector.position.set(0,6,0);
    this.proyector.rotateY(-45*(Math.PI/180));
    this.proyector.rotateX(10*(Math.PI/180));
    this.add(this.proyector);


  }

  crearBaseMesa(){

    var baseMesa = new THREE.Object3D();
     
    var cilindroGeo = new THREE.CylinderGeometry(4,4,2,32);
    var cilindroMat = new THREE.MeshPhongMaterial({color: 0x504644});
    var cilindro = new THREE.Mesh(cilindroGeo,cilindroMat);
    cilindro.position.set(0,1,0);

    baseMesa.add(cilindro);

    var cilindroGeo2 = new THREE.CylinderGeometry(0.5,0.5,4,32);
    var cilindro2 = new THREE.Mesh(cilindroGeo2,cilindroMat);
    cilindro2.position.set(0,4,0);
    
    baseMesa.add(cilindro2);

    return baseMesa;
  }

  crearBase(){
    
    var baseGeo = new THREE.BoxGeometry(7,5,10);
    var baseMat = new THREE.MeshPhongMaterial({color: 0xbba9a5 });
    var base = new THREE.Mesh(baseGeo,baseMat);
    base.position.set(0,2.5,0);
    
    return base;

  }

  crearLente(){

    var lenteCSG = new CSG();
    
    var cilindroGeo = new THREE.CylinderGeometry(3,1,4,32);
    var cilindroMat = new THREE.MeshPhongMaterial({color: 0x504644});
    var cilindro = new THREE.Mesh(cilindroGeo,cilindroMat);

    lenteCSG.union([cilindro]);

    var cilindroGeo2 = new THREE.CylinderGeometry(2.5,0.5,4,32);
    var cilindro2 = new THREE.Mesh(cilindroGeo2,cilindroMat);

    lenteCSG.subtract([cilindro2]);


    return lenteCSG.toMesh();

  }

  crearPalanca(){

    var palancaCSG = new CSG();

    var cilindroGeo = new THREE.CylinderGeometry(0.5,0.5,4,32);
    var CSGMat = new THREE.MeshPhongMaterial({color: 0x3c2c28});
    var cilindro = new THREE.Mesh(cilindroGeo,CSGMat);
    cilindro.position.set(0,2,0);

    palancaCSG.union([cilindro]);

    var cilindroGeo2 = new THREE.CylinderGeometry(0.5,0.5,2.5,32);
    var cilindro2 = new THREE.Mesh(cilindroGeo2,CSGMat);
    cilindro2.rotateX(Math.PI/2);
    cilindro2.position.set(0,4,0.75);

    palancaCSG.union([cilindro2]);

    var cilindro3 = new THREE.Mesh(cilindroGeo,CSGMat);
    cilindro3.position.set(0,5.5,2);

    palancaCSG.union([cilindro3]);

    var esferaGeo = new THREE.SphereGeometry(1,32,32);
    var esfera = new THREE.Mesh(esferaGeo,CSGMat);
    esfera.position.set(0,7.5,2);

    palancaCSG.union([esfera]);

    return palancaCSG.toMesh();

  }
    
  update () {
    this.palanca.rotateY(0.01);
  }

  rotarY(){
    var prev;
    prev = this.proyector.rotation.x;
    
    if(prev != 0)
      this.proyector.rotateX(-prev);

    if(this.posicionY == 0){
      this.proyector.rotateY(10*(Math.PI/180));
      this.posicionY ++;
    }else if(this.posicionY == 1){
      this.proyector.rotateY(10*(Math.PI/180));
      this.posicionY ++;
    }else{
      this.proyector.rotateY(-20*(Math.PI/180));
      this.posicionY = 0;
    }

    if(prev != 0)
      this.proyector.rotateX(prev);

  }

  rotarX(){
    

    if(this.posicionX == 0){
      this.proyector.rotateX(-10*(Math.PI/180));
      this.posicionX ++;
    }else if(this.posicionX == 1){
      this.proyector.rotateX(-10*(Math.PI/180));
      this.posicionX ++;
    }else{
      this.proyector.rotateX(20*(Math.PI/180));
      this.posicionX = 0;
    }


  }


}

export { Proyector };
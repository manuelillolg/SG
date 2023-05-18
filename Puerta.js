import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
 
class Puerta extends THREE.Object3D {
  constructor() {
    super();
    
    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    //this.createGUI();

    this.cerrado = true;
    this.estoyAnimacion = false;

    var textura = new THREE.TextureLoader().load('../imgs/puerta.jpg');
    var puertaMat = new THREE.MeshPhongMaterial({map: textura});

    var puertaGeo = new THREE.BoxGeometry(15,22,5);
    this.puerta = new THREE.Mesh(puertaGeo,puertaMat);
    this.puerta.position.set(7.5,11,0);

    this.pomo = this.crearPomo();
    //this.pomo.userData = this;
    this.puerta.add(this.pomo);
    
    this.add(this.puerta);

  }

  crearPomo(){
    var pomoMat = new THREE.MeshPhongMaterial({color: 0xffffff});

    var esferaGeo = new THREE.SphereGeometry(1,32,32);
    var esfera = new THREE.Mesh(esferaGeo,pomoMat);
    esfera.userData = this;
    esfera.name = "esferaPomo";
    esfera.position.set(0,2,0);

    var cilindroGeo = new THREE.CylinderGeometry(1,0.5,2,32);
    var cilindro = new THREE.Mesh(cilindroGeo,pomoMat);
    cilindro.position.set(0,0.25,0);

    var pomo = new THREE.Object3D();
    pomo.add(esfera);
    pomo.add(cilindro);

    pomo.rotateX(Math.PI/2);
    pomo.position.set(5.5,0,2);

    return pomo;

  }
  
  

  recibeClick(meshConcreto){
    //console.log(this.estoyAnimacion);
    if(!this.estoyAnimacion){
      this.animacion();
      this.cerrado = !this.cerrado;
    }
    //console.log(this.estoyAnimacion);

  }

  animacion(){
    var objeto = this;

    if(!this.cerrado){
      var origen = {angulo:0};
      var destino = {angulo:Math.PI/2};
      //this.cerrado = true;
    }
    else{
      var origen = {angulo:Math.PI/2};
      var destino = {angulo:0};
      //this.cerrado = false;
    }

    var abrir = new TWEEN.Tween(origen)
    .to(destino,2000)
    .onUpdate(function(){
      objeto.rotation.y = origen.angulo;
      //objeto.position.x = Math.cos(origen.angulo);
      //console.log(this.estoyAnimacion);
    })
    .onStart(function(){
      //console.log("he empezado");
      this.estoyAnimacion = true;
    })
    .onComplete(function(){
      //console.log("he terminado");
      this.estoyAnimacion = false;
    })
    .start();

    function animate() {
      requestAnimationFrame(animate);
      TWEEN.update();
    }

    animate();
    
  }
}

export { Puerta };
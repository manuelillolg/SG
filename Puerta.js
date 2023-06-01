import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
 
class Puerta extends THREE.Object3D {
  constructor(listener) {
    super();
    
    //Llave asociada
    this.llave = null;
    this.lock = false;

    //Animaciones
    this.abrir = this.crearAbrir();
    this.cerrar = this.crearCerrar();

    //Variable que controla la animación
    this.cerrado = true;

    //Creación de la base de la puerta
    var textura = new THREE.TextureLoader().load('../imgs/puerta.jpg');
    var puertaMat = new THREE.MeshPhongMaterial({map: textura});

    var puertaGeo = new THREE.BoxGeometry(15,22,5);
    puertaGeo.scale(1,1,0.3);
    this.puerta = new THREE.Mesh(puertaGeo,puertaMat);
    this.puerta.position.set(7.5,11,0);


    //Creacion del pomo
    this.pomo = this.crearPomo();
    
    this.puerta.add(this.pomo);
    
    
    this.add(this.puerta);

    this.audioLoader = new THREE.AudioLoader();

    this.abrirSound = this.createAbrirSound(listener);
    this.cerrarSound = this.createCerrarSound(listener);


  }

  asociaLlave(llave){
    this.llave = llave;
  }

  crearPomo(){
    var pomoMat = new THREE.MeshPhongMaterial({color: 0xffffff});

    var esferaGeo = new THREE.SphereGeometry(1,32,32);
    var esfera = new THREE.Mesh(esferaGeo,pomoMat);

    //UserData para el picking y nombre para su identificación
    esfera.userData = this;
    esfera.name = "esferaPomo";

    esfera.position.set(0,1.5,0);

    var cilindroGeo = new THREE.CylinderGeometry(1,0.5,2,32);
    var cilindro = new THREE.Mesh(cilindroGeo,pomoMat);
    cilindro.scale.set(1,0.5,1);
    cilindro.position.set(0,0.25,0);

    var pomo = new THREE.Object3D();
    pomo.add(esfera);
    pomo.add(cilindro);

    pomo.rotateX(Math.PI/2);
    pomo.position.set(5.5,0,0.5);

    return pomo;

  }

  cambiarLock(){
    this.lock = !this.lock;
  }
  
  abrirPuerta(){
    if(!this.lock){
      this.abrirSound.play();
      this.abrir.start();
    }
    else{
      mensaje.textContent = "La puerta está cerrada";
      
      mensaje.style.display = "block";
     
    }

    var tiempoEspera = 3000;

    // Programa la ocultación del mensaje después del tiempo especificado
    setTimeout(function() {
      mensaje.style.display = "none";
    }, tiempoEspera);
  }

  cerrarPuerta(){
    this.cerrarSound.play();
    this.cerrar.start();
  }
  

  recibeClick(){
    
    var mensaje = document.getElementById("mensaje");
    if(this.llave==null || this.llave.cogida()){
      if(this.cerrado){
        this.abrirPuerta();
      }
      else{
        this.cerrarPuerta();
      }
    }
    else{
      mensaje.textContent = "No tienes la llave";
      
      mensaje.style.display = "block";
     
    }

    var tiempoEspera = 3000;

    // Programa la ocultación del mensaje después del tiempo especificado
    setTimeout(function() {
      mensaje.style.display = "none";
    }, tiempoEspera);

  }

  crearCerrar(){
    var objeto = this;

    var origen = {angulo:0};
    var destino = {angulo:Math.PI/2};

    var cerrar = new TWEEN.Tween(origen)
    .to(destino,2000)
    .onUpdate(function(){
      objeto.rotation.y = origen.angulo;
    })
    .onComplete(function(){
      objeto.cerrado = true;
    });

    function animate() {
      requestAnimationFrame(animate);
      TWEEN.update();
    }

    animate();

    return cerrar;
    
  }


  crearAbrir(){
    var objeto = this;

    var origen = {angulo:Math.PI/2};
    var destino = {angulo:0};

    var abrir = new TWEEN.Tween(origen)
    .to(destino,2000)
    .onUpdate(function(){
      objeto.rotation.y = origen.angulo;
    })
    .onComplete(function(){
      objeto.cerrado = false;
    });

    function animate() {
      requestAnimationFrame(animate);
      TWEEN.update();
    }

    animate();
    
    return abrir;

  }

  createAbrirSound(listener){
    var abrir = new THREE.Audio(listener);
    this.audioLoader.load('audio/abrir.mp3',function(buffer){
      abrir.setBuffer(buffer);
      abrir.setVolume(1);
    });

    return abrir;
  }

  createCerrarSound(listener){
    var cerrar = new THREE.Audio(listener);
    this.audioLoader.load('audio/cerrar.mp3',function(buffer){
      cerrar.setBuffer(buffer);
      cerrar.setVolume(1);
    });

    return cerrar;
  }

}

export { Puerta };

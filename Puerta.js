import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'
 
class Puerta extends THREE.Object3D {
  constructor() {
    super();
    
    //Llave asociada
    this.llave = null;


    // Se crea la parte de la interfaz que corresponde a la caja
    // Se crea primero porque otros métodos usan las variables que se definen para la interfaz
    //this.createGUI();

    //Animaciones
    this.abrir = this.crearAbrir();
    this.cerrar = this.crearCerrar();

    //Variable que controla la animación
    this.cerrado = true;

    //Creación de la base de la puerta
    var textura = new THREE.TextureLoader().load('../imgs/puerta.jpg');
    var puertaMat = new THREE.MeshPhongMaterial({map: textura});

    var puertaGeo = new THREE.BoxGeometry(15,22,5);
    this.puerta = new THREE.Mesh(puertaGeo,puertaMat);
    this.puerta.position.set(7.5,11,0);


    //Creacion del pomo
    this.pomo = this.crearPomo();


    this.puerta.add(this.pomo);
    
    this.add(this.puerta);


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
  
  

  recibeClick(){
    
    var mensaje = document.getElementById("mensaje");
    if(this.llave==null || this.llave.cogida()){
      if(this.cerrado){
        this.abrir.start();
      }
      else{
        this.cerrar.start();
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

}

export { Puerta };

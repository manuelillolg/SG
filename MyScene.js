
// Clases de la biblioteca

import * as THREE from './libs/three.module.js'
import { GUI } from './libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import { Stats } from './libs/stats.module.js'

// Clases de mi proyecto
import { EsqueletoPlanta } from './EsqueletoPlanta.js'

 
/// La clase fachada del modelo
/**
 * Usaremos una clase derivada de la clase Scene de Three.js para llevar el control de la escena y de todo lo que ocurre en ella.
 */

class MyScene extends THREE.Scene {
  constructor (myCanvas) {
    super();
    
    // Lo primero, crear el visualizador, pasándole el lienzo sobre el que realizar los renderizados.
    this.renderer = this.createRenderer(myCanvas);
    
    // Se añade a la gui los controles para manipular los elementos de esta clase
    this.gui = this.createGUI ();
    
    this.initStats();
    this.personaje = new THREE.Object3D();
    this.add(this.personaje);
    
    // Construimos los distinos elementos que tendremos en la escena
    
    // Todo elemento que se desee sea tenido en cuenta en el renderizado de la escena debe pertenecer a esta. Bien como hijo de la escena (this en esta clase) o como hijo de un elemento que ya esté en la escena.
    // Tras crear cada elemento se añadirá a la escena con   this.add(variable)
    this.createLights ();
    
    // Tendremos una cámara con un control de movimiento con el ratón
 
    this.createCamera ();
    this.createBody();
        
    this.personaje.position.z = +40;
    this.personaje.position.x = 370;


    // Por último creamos el modelo.
    // El modelo puede incluir su parte de la interfaz gráfica de usuario. Le pasamos la referencia a 
    // la gui y el texto bajo el que se agruparán los controles de la interfaz que añada el modelo.

    //sonido
    this.createSound();
    this.model = new EsqueletoPlanta(this.listener);
    this.add (this.model);
    this.model.name = "modelo";

   

    //Movimiento de la cámara
    this.keyboard = {};
    this.moveSpeed = 0.5;
    this.moveDirection = new THREE.Vector3();
    this.prevMouseX = 0;
    this.prevMouseY = 0;

    this.ratonCapturado = false;
    this.virtualMouse = {
      x: 0,
      y: 0,
      sensitivity: 1,
      updatePosition: function (deltaX, deltaY) {
        this.x += deltaX * this.sensitivity;
        this.y += deltaY * this.sensitivity;
      }
    };

    //Picking
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    //Movimiento
    this.teclasMovimiento= [false,false,false,false];
    this.ratonActivo = false;

    //Iniciar pickableObjects
    this.pickableObjects = this.getPickableObjects();


   this.chocables = this.objetosChocables();

   this.background=new THREE.Color(0x000000);
   
  
  }
  
  initStats() {
  
    var stats = new Stats();
    
    stats.setMode(0); // 0: fps, 1: ms
    
    // Align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.top = '0px';
    
    $("#Stats-output").append( stats.domElement );
    
    this.stats = stats;
  }
  
  createCamera () {
    // Para crear una cámara le indicamos
    //   El ángulo del campo de visión en grados sexagesimales
    //   La razón de aspecto ancho/alto
    //   Los planos de recorte cercano y lejano
    this.camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.camera.name = "camara";
    // También se indica dónde se coloca
    this.camera.position.set (0, 17, 0);
    // Y hacia dónde mira
    var look = new THREE.Vector3 (0,17,-40);
    this.camera.lookAt(look);
    this.personaje.add (this.camera);
    
    // Para el control de cámara usamos una clase que ya tiene implementado los movimientos de órbita
   // this.cameraControl = new TrackballControls (this.camera, this.renderer.domElement);
    // Se configuran las velocidades de los movimientos
    //this.cameraControl.rotateSpeed = 5;
    //this.cameraControl.zoomSpeed = -2;
    //this.cameraControl.panSpeed = 0.5;
    // Debe orbitar con respecto al punto de mira de la cámara
   // this.cameraControl.target = look;


  }
  
  createGround () {
    // El suelo es un Mesh, necesita una geometría y un material.
    
    // La geometría es una caja con muy poca altura
    var geometryGround = new THREE.BoxGeometry (50,0.2,50);
    
    // El material se hará con una textura de madera
    var texture = new THREE.TextureLoader().load('../imgs/wood.jpg');
    var materialGround = new THREE.MeshPhongMaterial ({map: texture});
    
    // Ya se puede construir el Mesh
    var ground = new THREE.Mesh (geometryGround, materialGround);
    
    // Todas las figuras se crean centradas en el origen.
    // El suelo lo bajamos la mitad de su altura para que el origen del mundo se quede en su lado superior
    ground.position.y = -0.1;
    
    // Que no se nos olvide añadirlo a la escena, que en este caso es  this
    this.add (ground);
  }
  
  createGUI () {
    // Se crea la interfaz gráfica de usuario
    var gui = new GUI();
    
    // La escena le va a añadir sus propios controles. 
    // Se definen mediante un objeto de control
    // En este caso la intensidad de la luz y si se muestran o no los ejes
    this.guiControls = {
      // En el contexto de una función   this   alude a la función
      lightIntensity : 0.5,
    }

    // Se crea una sección para los controles de esta clase
    var folder = gui.addFolder ('Luz y Ejes');
    
    // Se le añade un control para la intensidad de la luz
    folder.add (this.guiControls, 'lightIntensity', 0, 1, 0.1)
      .name('Intensidad de la Luz : ')
      .onChange ( (value) => this.setLightIntensity (value) );
    
    return gui;
  }
  
  createLights () {
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como   var   y va a ser una variable local a este método
    //    se hace así puesto que no va a ser accedida desde otros métodos
    this.ambientLight = new THREE.AmbientLight(0x545454, 0.20);
    // La añadimos a la escena
    this.add (this.ambientLight);
    
    // Se crea una luz focal que va a ser la luz principal de la escena
    // La luz focal, además tiene una posición, y un punto de mira
    // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
    // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
    this.light = new THREE.SpotLight(0xffffff, 0, 100, Math.PI / 4);
    this.light.position.set(0, 10, 0);
    //light.target.position.set(0, 0, 0);
    this.light.castShadow = true;

    this.objetivo = new THREE.Object3D();
    this.objetivo.position.set(0,17,-40);
    
    //Añado el objetivo dentro de otro nodo para poder rotarlo bien 
    this.linterna = new THREE.Object3D();
    this.linterna.add(this.objetivo);
    
    this.personaje.add(this.linterna);
    
    this.light.target = this.objetivo;
    
    this.personaje.add(this.light);
  }
  
  setLightIntensity (valor) {
    this.ambientLight.intensity = valor;
  }
    
  createRenderer (myCanvas) {
    // Se recibe el lienzo sobre el que se van a hacer los renderizados. Un div definido en el html.
    
    // Se instancia un Renderer   WebGL
    var renderer = new THREE.WebGLRenderer();
    
    // Se establece un color de fondo en las imágenes que genera el render
    renderer.setClearColor(new THREE.Color(0xEEEEEE), 1.0);
    
    // Se establece el tamaño, se aprovecha la totalidad de la ventana del navegador
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    // La visualización se muestra en el lienzo recibido
    $(myCanvas).append(renderer.domElement);
    
    return renderer;  
  }
  
  getCamera () {
    // En principio se devuelve la única cámara que tenemos
    // Si hubiera varias cámaras, este método decidiría qué cámara devuelve cada vez que es consultado
    return this.personaje.getObjectByName("camara");
  }
  
  setCameraAspect (ratio) {
    // Cada vez que el usuario modifica el tamaño de la ventana desde el gestor de ventanas de
    // su sistema operativo hay que actualizar el ratio de aspecto de la cámara
    this.camera.aspect = ratio;
    // Y si se cambia ese dato hay que actualizar la matriz de proyección de la cámara
    this.camera.updateProjectionMatrix();
  }
  
  onWindowResize () {
    // Este método es llamado cada vez que el usuario modifica el tamapo de la ventana de la aplicación
    // Hay que actualizar el ratio de aspecto de la cámara
    this.setCameraAspect (window.innerWidth / window.innerHeight);
    
    // Y también el tamaño del renderizador
    this.renderer.setSize (window.innerWidth, window.innerHeight);
  }

  createBody() {
   
    let bodyH = this.personaje.getObjectByName("camara").position.y ;

    let boxGeometry = new THREE.BoxGeometry(10, bodyH, 10);
    boxGeometry.translate(0, bodyH / 2, 0);

    let boxMaterial = new THREE.MeshBasicMaterial({
        color: 0xff0000,
        opacity: 0,
        transparent: true
    })

    //boxMaterial.transparent = true;
    var body = new THREE.Mesh(boxGeometry, boxMaterial);
   // body.position.set(0, 0, 0);

    
    body.name="cuerpo";
    this.personaje.add(body);

    //Caja del cuerpo

    this.boundingBox = new THREE.Box3().setFromObject(body);
    
   /* this.caja = new THREE.Box3Helper(this.boundingBox,0x000000);
    this.caja.visible = true;
    this.personaje.add(this.caja);*/
    
  }
  update () {
    
    if (this.stats) this.stats.update();
    
    // Se actualizan los elementos de la escena para cada frame
    
    if(!this.controlMovimiento())
      this.personaje.translateOnAxis(this.moveDirection, this.moveSpeed);
    

    
    // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.renderer.render (this, this.getCamera());
    
    

    this.model.update();

    if(this.esFinJuego()){
      window.location.href = 'fin.html';
      
    }
    

    // Este método debe ser llamado cada vez que queramos visualizar la escena de nuevo.
    // Literalmente le decimos al navegador: "La próxima vez que haya que refrescar la pantalla, llama al método que te indico".
    // Si no existiera esta línea,  update()  se ejecutaría solo la primera vez.
    requestAnimationFrame(() => this.update())


  }

  teclaLevantada(event) {

    switch(event.key){
        case 'a':
          this.moveDirection.x = 0;
          this.teclasMovimiento[0] = false;
        break;

        case 'w':
          this.moveDirection.z = 0;
          this.teclasMovimiento[3] = false;
        break;

        case 's':
          this.teclasMovimiento[1] = false;
          this.moveDirection.z = 0;
        break;

        case 'd': 
          this.moveDirection.x = 0;
          this.teclasMovimiento[2] = false;
        break;

    }
  }

  teclaPresionada(event) {

   // var posicion = new THREE.Vector3();
    //this.personaje.getObjectByName("camara").getWorldPosition(posicion);
    //var rotacionPersonaje = this.personaje.rotation.y;
    //var colisiona = false;
    //var direccion = new THREE.Vector3();
    //this.camera.getWorldDirection(direccion);
    //direccion.y = 0;
    
    
    //origen del rayo
    //var origen = new THREE.Vector3(posicion.x, 1, posicion.z);
   // var origen2 = new THREE.Vector3(posicion.x + 10, 1, posicion.z);
   // var origen3 = new THREE.Vector3(posicion.x -10, 1, posicion.z);

    switch(event.key){
      case 'a':
        this.teclasMovimiento[0] = true;
      break;
      case 's':
        this.teclasMovimiento[1] = true;
      break;
      case 'd':
        this.teclasMovimiento[2] = true;

      break;
      case 'w':
     
        this.teclasMovimiento[3] = true;
      break;
      case '1':
        if(this.light.intensity == 1)
          this.light.intensity = 0;
        else
          this.light.intensity = 1;
        
      break;
      case 'h':
        var instrucciones = document.getElementById("h");
        
        if(instrucciones.style.display == "block")
          instrucciones.style.display = "none";
        else{
          instrucciones.style.display = "block";
        }
      break;
    
    }
         
    
  }

  controlMovimiento(){
    // movimiento del objeto:
    //creamos el moveDirection en funcion de las teclas que haya pulsadas
    var posicion = new THREE.Vector3();
    this.personaje.getObjectByName("camara").getWorldPosition(posicion);
    var origen = new THREE.Vector3(posicion.x, 1, posicion.z);
    var origenArriba = new THREE.Vector3(posicion.x, 7, posicion.z);
    var origen2;
    var origen3;
    var colisiona;
    var direccion = new THREE.Vector3();
    this.camera.getWorldDirection(direccion);
    direccion.y = 0;
    var  colisionaAArriba,  colisionaSArriba, colisionaDArriba, colisionaWArriba;

    //Tecla a
    if(this.teclasMovimiento[0]){

      var direccionA = new THREE.Vector3(direccion.z, 0, -direccion.x);

      origen2 = new THREE.Vector3(posicion.x, 7, posicion.z-5);
      origen3 = new THREE.Vector3(posicion.x, 7, posicion.z+5);

      colisionaAArriba = this.comprueba3Colisiones(origenArriba,origen2,origen3,direccionA);
    
      if( !colisionaAArriba)
        this.moveDirection.x = -1;
      else
        this.moveDirection.x = 0;
    }


    //tecla s
    if(this.teclasMovimiento[1]){
      //var direccion = new THREE.Vector3(0,0,1);
      var direccionS = new THREE.Vector3(-direccion.x, 0, -direccion.z);
      
      origen2 = new THREE.Vector3(posicion.x-5, 7, posicion.z);
      origen3 = new THREE.Vector3(posicion.x+5, 7, posicion.z);

      colisionaSArriba = this.comprueba3Colisiones(origenArriba,origen2,origen3,direccionS);
      
  
      if(!colisionaSArriba && !this.teclasMovimiento[3])
        this.moveDirection.z = 1;
      else
        this.moveDirection.z = 0;
  
    }

    //tecla d
    if(this.teclasMovimiento[2]){
      //var direccion = new THREE.Vector3(1,0,0);
      var direccionD = new THREE.Vector3(-direccion.z, 0, direccion.x);
 

      origen2 = new THREE.Vector3(posicion.x, 7, posicion.z-5);
      origen3 = new THREE.Vector3(posicion.x, 7, posicion.z+5);

      colisionaDArriba = this.comprueba3Colisiones(origenArriba,origen2,origen3,direccionD);
  
  
      if(!colisionaDArriba&& !this.teclasMovimiento[0])
        this.moveDirection.x = 1;
      else
        this.moveDirection.x = 0;
  
    }

    //tecla w
    if(this.teclasMovimiento[3]){
    
      //var direccion = new THREE.Vector3(0,0,-1);
      var direccionW = new THREE.Vector3(direccion.x, 0, direccion.z);
      
      origen2 = new THREE.Vector3(posicion.x-5, 7, posicion.z);
      origen3 = new THREE.Vector3(posicion.x+5, 7, posicion.z);
      
      colisionaWArriba = this.comprueba3Colisiones(origenArriba,origen2,origen3,direccionW);
      

      if(!colisionaWArriba && !this.teclasMovimiento[1])
        this.moveDirection.z = -1;
      else
        this.moveDirection.z = 0;
    }



    if (this.moveDirection.x == 0 && this.moveDirection.y == 0 && this.moveDirection.z ==0){
      this.pararPasos();
    }else{
      this.iniciarPasos();
    }
    
    if(colisionaWArriba || colisionaAArriba ||colisionaSArriba ||colisionaDArriba){
      return true;
    }else{
      return false;
    }


    
  }

  comprueba3Colisiones(origen,origen2,origen3,direccion){
    var  impactados = this.lanzaRayo(this.personaje.rotation.y,origen,direccion);
  
    if(impactados.length > 0)
      var colisiona1 = this.checkColisiones(impactados[0]);
    
    else
      var colisiona1 = false;

    var impactados2 = this.lanzaRayo(origen2,direccion);
    
    if(impactados2.length > 0 )
      var colisiona2 = this.checkColisiones(impactados2[0]);
    else
      var colisiona2 = false;
    var impactados3 = this.lanzaRayo(origen3,direccion);

    if(impactados3.length > 0 )
      var colisiona3 = this.checkColisiones(impactados3[0]);
    else
      var colisiona3 = false;

     
      var colisiona;

     
      if(colisiona1 || colisiona2 || colisiona3)
         colisiona = true;
      else
         colisiona = false;
    return colisiona;
  }

  checkColisiones(candidato) {
    
    if (typeof candidato !== "undefined") {

       
       if(candidato.distance <= 7){
        return true;
       }
      }
      return false;
  }

  objetosChocables(){
     //Objetos de la escena
     var objects = [];
    
     this.traverse(function(object) {
       if (object instanceof THREE.Mesh ) {
         objects.push(object);
       }
     });

     return objects;
  
  }

  lanzaRayo(origen, direccion){


    //var matrizRotacion = new THREE.Matrix4().makeRotationY(rotacion);
    var rayo = new THREE.Raycaster();
    //direccion.applyMatrix4(matrizRotacion);
    rayo.set(origen, direccion);

    var impactados = rayo.intersectObjects(this.chocables,true);
   
    //var impactados = rayo.intersectObjects(objects,true);
    

 
    return impactados;
  }



  mueveRaton(event){
        
       if (this.ratonCapturado) {
        
        var movementX = event.movementX || event.mozMovementX || event.webkitMovementX || 0;
        var movementY = event.movementY || event.mozMovementY || event.webkitMovementY || 0;
    
        this.virtualMouse.updatePosition(movementX, movementY);
        
        // Obtener la posición del ratón en la pantalla
        //var mouseX = event.clientX;
        var mouseX = this.virtualMouse.x;

        // Calcular la diferencia entre la posición actual y la anterior del ratón
        var mouseDeltaX = mouseX - this.prevMouseX;
    
        // Actualizar la posición anterior del ratón
        this.prevMouseX = mouseX;
    
        // Calcular el ángulo de rotación basado en la diferencia de posición del ratón
        var rotationAngleX = mouseDeltaX * -0.01; // Puedes ajustar el factor de escala según tus necesidades
    
        // Aplicar la rotación al objeto
        this.personaje.rotateY(rotationAngleX);

        // Obtener la posición del ratón en la pantalla
        //var mouseY = event.clientY;
        var mouseY = this.virtualMouse.y;

        // Calcular la diferencia entre la posición actual y la anterior del ratón
        var mouseDeltaY = mouseY - this.prevMouseY;
    
        // Actualizar la posición anterior del ratón
        this.prevMouseY = mouseY;
    
        // Calcular el ángulo de rotación basado en la diferencia de posición del ratón
        var rotationAngleY = mouseDeltaY * -0.01; // Puedes ajustar el factor de escala según tus necesidades
       this.camera.rotateX(rotationAngleY);
       this.linterna.rotateX(rotationAngleY);

      }


  }

  capturarRaton(){
    this.ratonCapturado = true;
    this.ratonActivo = true;
    var body = document.body;
    body.requestPointerLock();
  }

  liberarRaton(){
    this.ratonCapturado = false;
    this.ratonActivo = false;
    var doc = document;
    doc.exitPointerLock();
   
  }

  getPickableObjects(){
    
    var clases = [];
    clases[0] = this.model.getObjectByName("clase1");
    clases[1] = this.model.getObjectByName("clase2");
    clases[2] = this.model.getObjectByName("clase3");
    clases[3] = this.model.getObjectByName("clase4");


    var pomosClases = [];
    for(var i = 0; i < clases.length; i++)
      pomosClases[i] = clases[i].getObjectByName("esferaPomo");

    var banio = this.model.getObjectByName("baño");
    var pomoBanio = banio.getObjectByName("esferaPomo");
    var pomoSalida = this.model.getObjectByName("esferaPomo");


    var cuarto = this.model.getObjectByName("cuarto");
    var pomoCuarto = cuarto.getObjectByName("esferaPomo");

    var boton1 = this.model.getObjectByName("Boton1");
    var boton2 = this.model.getObjectByName("Boton2");
    var llave2 = this.model.getObjectByName("llave2");
    var llave1 = this.model.getObjectByName("llave1");

    var botonLuz1 = cuarto.getObjectByName("botonLuz1");
    var botonLuz2 = cuarto.getObjectByName("botonLuz2");
    var botonLuz3 = cuarto.getObjectByName("botonLuz3");
    var botonLuz4 = cuarto.getObjectByName("botonLuz4");



    var pickableObjects = [pomoBanio, pomosClases[0], pomosClases[1], pomosClases[2], pomosClases[3],pomoSalida, pomoCuarto, boton1, boton2, llave2, llave1, botonLuz1, botonLuz2, botonLuz3, botonLuz4];
    return pickableObjects;
    
  }

  pick(){
   
    this.mouse.x = 0;
    this.mouse.y = 0;
    this.raycaster.setFromCamera(this.mouse,this.getCamera());  

    var pickedObjects = this.raycaster.intersectObjects(this.pickableObjects,true);

    if(pickedObjects.length > 0){

      var selectedObject = pickedObjects[0].object;

   
      if(selectedObject.userData.isObject3D){
        if(selectedObject.userData.name == "Boton1"){
       
          if(selectedObject.userData.recibeClick(1)){
            this.model.muestraLlave();           
          
          }
        }else if(selectedObject.userData.name == "Boton2"  ){
        
          if(selectedObject.userData.recibeClick(2)){
            this.model.muestraLlave();
          }
        }
        else{
          selectedObject.userData.recibeClick(selectedObject);
        }
      }
    }
  }

  //Método para el sonido
  createSound(){
    this.listener = new THREE.AudioListener();
    this.camera.add(this.listener);

    this.audioLoader = new THREE.AudioLoader();
    this.tormenta = this.createTormenta(this.listener);
    this.pasos = this.createPasos(this.listener);
  }

  createTormenta(listener){
    var tormenta = new THREE.Audio(listener);

    this.audioLoader.load('audio/tormenta.mp3',function(buffer){
      tormenta.setBuffer(buffer);
      tormenta.setLoop(true);
      tormenta.setVolume(0.5);
    });

    return tormenta;
  }

  createPasos(listener){
    var pasos = new THREE.Audio(listener);
    this.audioLoader.load('audio/pasos.mp3',function(buffer){
      pasos.setBuffer(buffer);
      pasos.setLoop(true);
      pasos.setVolume(1);
    });

    return pasos;
  }

 

  iniciarTormenta(){
    this.tormenta.play();
  }

  iniciarPasos(){
    if(!this.pasos.isPlaying){
      this.pasos.offset = 0;
      this.pasos.play();
    }
  }

  pararPasos(){
    if(this.pasos.isPlaying)
      this.pasos.stop();
  }

  esFinJuego(){
    var worldPosition = new THREE.Vector3();
    this.personaje.getWorldPosition(worldPosition);

    if (worldPosition.z > 100) {
      for(var i = 0; i < 3; i++){
          this.teclasMovimiento[i] = false;
      }
      return true;
    }else
      return false;
  }
}



/// La función   main
$(function () {
  
  // Se instancia la escena pasándole el  div  que se ha creado en el html para visualizar
  var scene = new MyScene("#WebGL-output");

  // Se añaden los listener de la aplicación. En este caso, el que va a comprobar cuándo se modifica el tamaño de la ventana de la aplicación.
  window.addEventListener ("resize", () => scene.onWindowResize());
  document.addEventListener("keyup",(event)=>scene.teclaLevantada(event));
  document.addEventListener("keydown",(event)=>scene.teclaPresionada(event));
  document.addEventListener("mousemove", (event)=>scene.mueveRaton(event));
  //document.addEventListener("click", () => scene.moverPunteroAlCentro());
 
  document.addEventListener('keydown', function(event) {
    if (event.keyCode === 13 && !scene.ratonCapturado) { // 13 es el código de la tecla "Enter"
      scene.capturarRaton();
      if(!scene.tormenta.isPlaying)
        scene.iniciarTormenta();
    }
    else if(event.keyCode === 13 && scene.ratonCapturado){
      scene.liberarRaton();
    }
  });

  window.addEventListener("click",() => scene.pick());
  
  // Que no se nos olvide, la primera visualización.
  scene.update();
});
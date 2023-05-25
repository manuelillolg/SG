
// Clases de la biblioteca

import * as THREE from './libs/three.module.js'
import { GUI } from './libs/dat.gui.module.js'
import { TrackballControls } from '../libs/TrackballControls.js'
import { Stats } from './libs/stats.module.js'

// Clases de mi proyecto
import { EsqueletoClase } from './EsqueletoClase.js'
import { EsqueletoCuarto } from './EsqueletoCuarto.js'
import { EsqueletoPlanta } from './EsqueletoPlanta.js'
import {Cubo} from './Cubo.js'


 
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
    
    // Y unos ejes. Imprescindibles para orientarnos sobre dónde están las cosas
    this.axis = new THREE.AxesHelper (5);
    this.add (this.axis);
    
    this.personaje.position.z = +40;
    this.personaje.position.x = 370;
    // Por último creamos el modelo.
    // El modelo puede incluir su parte de la interfaz gráfica de usuario. Le pasamos la referencia a 
    // la gui y el texto bajo el que se agruparán los controles de la interfaz que añada el modelo.
    this.model = new EsqueletoPlanta();
    this.add (this.model);
    this.model.name = "modelo";

   

    //Pruebas del movimiento de la cámara
    this.keyboard = {};
    this.moveSpeed = 1;
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

  //Pruebas para el rayo de la colisiones
  this.lineaRayo;
  

  //Picking
  this.raycaster = new THREE.Raycaster();
  this.mouse = new THREE.Vector2();

   //Movimiento
   this.teclasMovimiento= [false,false,false,false];
   this.ratonActivo = false;

   //Iniciar pickableObjects
   this.getPickableObjects();
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
      axisOnOff : true
    }

    // Se crea una sección para los controles de esta clase
    var folder = gui.addFolder ('Luz y Ejes');
    
    // Se le añade un control para la intensidad de la luz
    folder.add (this.guiControls, 'lightIntensity', 0, 1, 0.1)
      .name('Intensidad de la Luz : ')
      .onChange ( (value) => this.setLightIntensity (value) );
    
    // Y otro para mostrar u ocultar los ejes
    folder.add (this.guiControls, 'axisOnOff')
      .name ('Mostrar ejes : ')
      .onChange ( (value) => this.setAxisVisible (value) );
    
    return gui;
  }
  
  createLights () {
    // Se crea una luz ambiental, evita que se vean complentamente negras las zonas donde no incide de manera directa una fuente de luz
    // La luz ambiental solo tiene un color y una intensidad
    // Se declara como   var   y va a ser una variable local a este método
    //    se hace así puesto que no va a ser accedida desde otros métodos
    var ambientLight = new THREE.AmbientLight(0x545454, 0.35);
    // La añadimos a la escena
    this.add (ambientLight);
    
    // Se crea una luz focal que va a ser la luz principal de la escena
    // La luz focal, además tiene una posición, y un punto de mira
    // Si no se le da punto de mira, apuntará al (0,0,0) en coordenadas del mundo
    // En este caso se declara como   this.atributo   para que sea un atributo accesible desde otros métodos.
    var light = new THREE.SpotLight(0xffffff, 1, 100, Math.PI / 4);
    light.position.set(0, 10, 0);
    //light.target.position.set(0, 0, 0);
    light.castShadow = true;

    this.objetivo = new THREE.Object3D();
    this.objetivo.position.set(0,17,-40);
    
    //Añado el objetivo dentro de otro nodo para poder rotarlo bien 
    this.linterna = new THREE.Object3D();
    this.linterna.add(this.objetivo);
    
    this.personaje.add(this.linterna);
    
    light.target = this.objetivo;
    
    this.personaje.add(light);
  }
  
  setLightIntensity (valor) {
    this.spotLight.intensity = valor;
  }
  
  setAxisVisible (valor) {
    this.axis.visible = valor;
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
    
    this.caja = new THREE.Box3Helper(this.boundingBox,0x000000);
    this.caja.visible = true;
    this.personaje.add(this.caja);
    
  }
  update () {
    
    if (this.stats) this.stats.update();
    
    // Se actualizan los elementos de la escena para cada frame
    

    // mover el objeto en la dirección del movimiento
    this.personaje.translateOnAxis(this.moveDirection, this.moveSpeed);

    
    // Le decimos al renderizador "visualiza la escena que te indico usando la cámara que te estoy pasando"
    this.renderer.render (this, this.getCamera());
    
    if(this.ratonActivo){
      
    }

    this.model.update();
    

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

    var posicion = new THREE.Vector3();
    this.personaje.getObjectByName("camara").getWorldPosition(posicion);
    var rotacionPersonaje = this.personaje.rotation.y;
    var colisiona = false;
    var direccion = new THREE.Vector3();
    this.camera.getWorldDirection(direccion);
    direccion.y = 0;
    
    
    //origen del rayo
    var origen = new THREE.Vector3(posicion.x, 1, posicion.z);
    var origen2 = new THREE.Vector3(posicion.x + 10, 1, posicion.z);
    var origen3 = new THREE.Vector3(posicion.x -10, 1, posicion.z);

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
    
    }
    
    
        if(this.teclasMovimiento[0]){
          //var direccion = new THREE.Vector3(-1,0,0);
          //direccion = direccion.rotate(Math.PI/2);
          var originalX  =direccion.x;
          var originalZ = direccion.z;

          direccion.x = originalZ;
          direccion.z = -originalX;
          var caja1 = new THREE.Box3().setFromObject(this.model);

          //caja1.applyMatrix4(this.model.matrixWorld);


         // var caja2 = new THREE.Box3().setFromObject(this.model1);

          //caja2.applyMatrix4(this.model1.matrixWorld);
          var impactados = this.lanzaRayo(rotacionPersonaje,origen,direccion);
          //var impactados2 = this.lanzaRayo(rotacionPersonaje,origen2,direccion);
         // var impactados3 = this.lanzaRayo(rotacionPersonaje,origen3,direccion);
          
          if(impactados.length > 0 )
            var colisiona1 = this.checkColisiones(impactados[0]);
          else
            var colisiona1 = false;

          /*if(impactados2.length > 0 )
            var colisiona2 = this.checkColisiones(impactados2[0]);
          else
            var colisiona2 = false;


          if(impactados3.length > 0 )
            var colisiona3 = this.checkColisiones(impactados3[0]);
          else
            var colisiona3 = false;

          
          if(colisiona1 || colisiona2 || colisiona3)
            colisiona = true;
          else 
            colisiona = false;
          */
         colisiona = colisiona1;

          if( !colisiona)
            this.moveDirection.x = -1;
          else
            this.moveDirection.x = 0;
        }

        if(this.teclasMovimiento[3]){
          
          //var direccion = new THREE.Vector3(0,0,-1);

          var  impactados = this.lanzaRayo(rotacionPersonaje,origen,direccion);

          if(impactados.length > 0)
            colisiona = this.checkColisiones(impactados[0]);
          
          else
            colisiona = false;

          if(!colisiona)
            this.moveDirection.z = -1;
          else
            this.moveDirection.z = 0;
        }

        if(this.teclasMovimiento[1]){
          //var direccion = new THREE.Vector3(0,0,1);
          direccion.z  = -direccion.z;
          direccion.x = -direccion.x;
          var impactados = this.lanzaRayo(rotacionPersonaje,origen,direccion);

          if(impactados.length > 0)
            colisiona = this.checkColisiones(impactados[0]);
          else
            colisiona = false;

          if(!colisiona)
            this.moveDirection.z = 1;
          else
            this.moveDirection.z = 0;

        }

        if(this.teclasMovimiento[2]){
          //var direccion = new THREE.Vector3(1,0,0);
          var originalX  =direccion.x;
          var originalZ = direccion.z;

          direccion.x = -originalZ;
          direccion.z = originalX;
          var impactados = this.lanzaRayo(rotacionPersonaje,origen,direccion);

          if(impactados.length > 0)
            colisiona = this.checkColisiones(impactados[0]);
          else
            colisiona = false;

          if(!colisiona)
            this.moveDirection.x = 1;
          else
            this.moveDirection.x = 0;

        }
    

    
  }

  checkColisiones(candidates) {
    
    if (typeof candidates !== "undefined") {
     /*// var geometriaCandidates = this.obtenerGeometria(candidates);
     var className = candidates.constructor.name;
     //console.log(className);
     
      this.collision = false;
      var cajaBody = this.boundingBox;
      
        
        var candidateBox = candidates.object.geometry.boundingBox;
       // console.log(candidates.object.name);

        //var cajaH = new THREE.Box3Helper(candidateBox, 0xFF0000);
        //this.add(cajaH);

        

        if (cajaBody.intersectsBox(candidateBox)) {
          //console.log("Estás chocando");
          this.collision = true;
        }else
        console.log("no choca");
        */
       if(candidates.distance <= 10){
        return true;
       }
      }
      return false;
  }



  lanzaRayo(rotacion, origen, direccion){

    //Objetos de la escena
    var objects = [];
    
    this.traverse(function(object) {
      if (object instanceof THREE.Mesh) {
        objects.push(object);
      }
    });

    //var matrizRotacion = new THREE.Matrix4().makeRotationY(rotacion);
    var rayo = new THREE.Raycaster();

    //direccion.applyMatrix4(matrizRotacion);
 
    rayo.set(origen, direccion);

    var impactados = rayo.intersectObjects(objects,true);
    //var impactados = rayo.intersectObjects(objects,true);

    //Funciones para que se muestre el rayo

    //Codigo para ver el rayo
    if (this.lineaRayo) {
      this.remove(this.lineaRayo);
    }

    
    var points = [];
    points.push(rayo.ray.origin);
    points.push(rayo.ray.origin.clone().add(rayo.ray.direction.clone().multiplyScalar(100)));
    var rayGeometry = new THREE.BufferGeometry().setFromPoints(points);
  

    // Crear una nueva línea y agregarla a la escena
    var rayMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
    this.lineaRayo = new THREE.Line(rayGeometry, rayMaterial);
    this.add(this.lineaRayo);
    //-----------------------------

    //console.log("Distancia al objeto es:  " + impactados[0].distance);
    

 
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

    var cuarto = this.model.getObjectByName("cuarto");
    var pomoCuarto = cuarto.getObjectByName("esferaPomo");

    var boton1 = this.model.getObjectByName("Boton1");
    var boton2 = this.model.getObjectByName("Boton2");
    var llave2 = this.model.getObjectByName("llave2");
    var llave1 = this.model.getObjectByName("llave1");


    

    this.pickableObjects = [pomoBanio, pomosClases[0], pomosClases[1], pomosClases[2], pomosClases[3], pomoCuarto, boton1, boton2, llave2, llave1];
    
  }
  pick(event){
   
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
    }
    else if(event.keyCode === 13 && scene.ratonCapturado){
      scene.liberarRaton();
    }
  });

  window.addEventListener("click",(event) => scene.pick(event));
  
  // Que no se nos olvide, la primera visualización.
  scene.update();
});
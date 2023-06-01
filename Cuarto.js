import * as THREE from '../libs/three.module.js'

import { CajaCuadros } from './CajaCuadros.js'

class Cuarto extends THREE.Object3D {
    constructor(esqueleto) {
      super();
      
      this.cajaCuadros = new CajaCuadros(esqueleto);
      this.cajaCuadros.rotateY(Math.PI/2);
      this.cajaCuadros.position.set(20,7,7.5);
      this.add(this.cajaCuadros);

      this.mesa = this.createMesa();
      this.mesa.rotateY(Math.PI/2);
      this.mesa.position.set(20,0,0);
      this.add(this.mesa);
      
  
    }
  
    createMesa() {
      var mesa = new THREE.Object3D();
    
      // Crea la geometría del tablero
      var tableroGeom = new THREE.BoxGeometry(40, 1, 10);
      tableroGeom.translate(0, 0.5, 0);
    
      // Crea la geometría de las patas
      var pataGeom = new THREE.BoxGeometry(1, 6, 1);
      pataGeom.translate(0, 3, 0); // Ajusta la posición de las patas según el tamaño del tablero
    
      // Crea el material
      var texture = new THREE.TextureLoader().load('../imgs/mesaCuarto.jpeg');
      var material = new THREE.MeshPhongMaterial({ map: texture });
    
      // Crea el Mesh del tablero
      var tablero = new THREE.Mesh(tableroGeom, material);
      tablero.position.set(0, 6, 0);
    
      // Crea los Mesh de las patas
      var pata1 = new THREE.Mesh(pataGeom, material);
      var pata2 = new THREE.Mesh(pataGeom, material);
      var pata3 = new THREE.Mesh(pataGeom, material);
      var pata4 = new THREE.Mesh(pataGeom, material);
    
    
      // Ajusta la posición de las patas según el tamaño del tablero
      pata1.position.set(19, 0, 4.5);
      pata2.position.set(-19, 0, 4.5);
      pata3.position.set(19, 0, -4.5);
      pata4.position.set(-19, 0, -4.5);

      // Añade las patas como hijos del Object3D de la mesa
      mesa.add(tablero);
      mesa.add(pata1);
      mesa.add(pata2);
      mesa.add(pata3);
      mesa.add(pata4);
    
      return mesa;
    }
    
    
    
  }
  
  export { Cuarto };
  
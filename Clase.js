import * as THREE from '../libs/three.module.js'

import { Puerta } from './Puerta.js';
 
class Clase extends THREE.Object3D {
  constructor() {
    super();
    

    //Mesas de la parte izquierda
    for(var i = 0; i < 4; i++){
      var mesa = this.createMesa();
      mesa.position.set(0,0,20+i*20);
      this.add(mesa);
      var caja = new THREE.Box3();
      caja.setFromObject(mesa);
    }

    //Mesas centrales
    for(var i = 0; i < 4; i++){
      var mesa = this.createMesa();
      mesa.scale.set(4,1,1);
      mesa.position.set((20+15),0,20+i*20);
      this.add(mesa);

      var caja = new THREE.Box3();
      caja.setFromObject(mesa);     
 
    }

    //Mesas de la parte derecha
    for(var i = 0; i < 4; i++){
      var mesa = this.createMesa();
      mesa.position.set((20+15)+(80+15),0,20+i*20);
      this.add(mesa);
      var caja = new THREE.Box3();
      caja.setFromObject(mesa);

    }

    //Pizarra
    var pizarraGeom = new THREE.BoxGeometry (70,15,1);
    pizarraGeom.translate(0,7.5,0);
    var texturaPizarra = new THREE.TextureLoader().load('../imgs/pizarra.jpeg');
    var pizarraMat = new THREE.MeshPhongMaterial({map: texturaPizarra});
    var pizarra = new THREE.Mesh (pizarraGeom, pizarraMat);
    pizarra.position.set(35, 6, 149.5);
    this.add(pizarra);

    var caja = new THREE.Box3();
      caja.setFromObject(pizarra);
  

    //Puerta
    this.puerta = new Puerta();
    this.puerta.rotation.y = Math.PI/2;

    this.puertaPosicionada = new THREE.Object3D();
    this.puertaPosicionada.add(this.puerta);
    this.puertaPosicionada.rotation.y = Math.PI/2;
    this.puertaPosicionada.position.set(75+7.5,0,-2.5);
    this.add(this.puertaPosicionada);
    
  }

  createMesa(){
    var mesa = new THREE.Object3D();

    // Un Mesh se compone de geometría y material
    //var boxGeom = new THREE.BoxGeometry (1,6,1);
    var tableroGeom = new THREE.BoxGeometry (20,1,10);
    tableroGeom.translate(10,0.5,0);

    var tableroLatGeom = new THREE.BoxGeometry (20,7,1);
    tableroLatGeom.translate(10,3.5,5.5);

    // Como material se crea uno a partir de un color
    var texture = new THREE.TextureLoader().load('../imgs/wood.jpg');
    var boxMat = new THREE.MeshPhongMaterial({map: texture});
    //var boxMat = new THREE.MeshPhongMaterial({map: texture});
    
    // Ya podemos construir el Mesh

    var tablero = new THREE.Mesh (tableroGeom, boxMat);
    var tableroLat = new THREE.Mesh (tableroLatGeom, boxMat);
    //tableroLat.rotation.x = Math.PI/2;
    
    // Y añadirlo como hijo del Object3D (el this)

    tablero.position.set(0,6,0);

    mesa.add (tablero);
    mesa.add (tableroLat);
    
    return mesa;
  }
  

}

export { Clase };

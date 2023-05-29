import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

class BotonCuadro extends THREE.Object3D {
    constructor() {
      super();
      
      this.boton = crearBoton();
      this.boton.userData = this;
        
      this.add(this.boton);

      this.luzAsociada = new THREE.PointLight(0x0000ff, 1, 100);

      this.colores = [0x0000ff,0x00ff00,0xff0000,0xffff00,0x00ffff,0xff00ff];
      this.color = this.colores[0];
    }
  
    crearBoton(){
        var botonGeom = new THREE.SphereGeometry( 1, 32, 32 );
        var botonMat = new THREE.MeshPhongMaterial({color: 0x00ff00});
        var boton = new THREE.Mesh(botonGeom, botonMat);
        return boton;
    }

    siguienteColor(){
        var i = this.colores.indexOf(this.color);
        if(i==this.colores.length-1){
            this.color = this.colores[0];
        }else{
            this.color = this.colores[i+1];
        }
    }

    recibeClick(){
        this.siguienteColor();
        this.luzAsociada.color.set(this.color);
    }


  
}export { BotonCuadro };
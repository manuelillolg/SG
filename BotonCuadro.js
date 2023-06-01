import * as THREE from '../libs/three.module.js'

class BotonCuadro extends THREE.Object3D {
    constructor(esqueleto) {
      super();
      
      this.boton = this.crearBoton();
      this.boton.userData = this;
        

      this.luzAsociada = new THREE.PointLight(0x0000ff, 1, 5);
      this.luzAsociada.position.set(0,2,0);

      this.add(this.luzAsociada);
      this.add(this.boton);

      this.colores = [0x0000ff,0x00ff00,0xff0000,0xffff00,0x00ffff,0xff00ff];
      this.color = this.colores[0];

      this.esqueleto = esqueleto;
    }
  
    crearBoton(){
        var botonGeom = new THREE.SphereGeometry( 1, 32, 32, Math.PI/2, Math.PI, 0, Math.PI );
        botonGeom.rotateZ(Math.PI/2);
        var botonMat = new THREE.MeshPhongMaterial({color: 0xffffff});
        botonMat.transparent = true;
        botonMat.opacity = 0.5;
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
        this.esqueleto.compruebaJuego();
    }


  
}export { BotonCuadro };
import * as THREE from '../libs/three.module.js'

 
class Boton extends THREE.Object3D {
  constructor(material) {
    super();

    this.boton = this.createBoton(material);
    this.add(this.boton);
  }

  createBoton(material){
    var botonMovilG =  new THREE.CylinderGeometry( 2, 2, 2, 32 ); 
    var botonMovilM = material;

    var botonMovil = new THREE.Mesh(botonMovilG, botonMovilM);
    botonMovil.userData = this;

    return botonMovil;
  }

  recibeClick(proyector,diapositiva,boton){
    var ret;
    if(boton==1){
      proyector.rotarY();
      ret = diapositiva.mueveX();
    }else{
      proyector.rotarX();
      ret = diapositiva.mueveY();
    }
    return ret;
  }
}

export {Boton};

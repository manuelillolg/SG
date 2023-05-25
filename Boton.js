import * as THREE from '../libs/three.module.js'
import * as TWEEN from '../libs/tween.esm.js'

 
class Boton extends THREE.Object3D {
  constructor(material) {
    super();
    this.animacion = this.crearAnimacion();
    this.boton = this.createBoton(material);
    this.add(this.boton);
  }

  createBoton(material){
    var botonMovilG =  new THREE.CylinderGeometry( 2, 2, 2, 32 ); 
    var botonMovilM = material;

    var botonMovil = new THREE.Mesh(botonMovilG, botonMovilM);
    botonMovil.position.set(0,1,0);
    botonMovil.userData = this;

    return botonMovil;
  }

  recibeClick(proyector,diapositiva,boton){
    var ret;
    this.animacion.start();
    if(boton==1){
      proyector.rotarY();
      ret = diapositiva.mueveX();
    }else{
      proyector.rotarX();
      ret = diapositiva.mueveY();
    }
    return ret;
  }

  crearAnimacion(){
    var objeto = this;

    var anim = new TWEEN.Tween(objeto.scale)
    .to({y:0.7},500)
    .onComplete(function(){
      objeto.scale.y = 1;
    });

    function animate() {
      requestAnimationFrame(animate);
      TWEEN.update();
    }

    animate();
    
    return anim;

  }
}

export {Boton};

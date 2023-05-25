import * as THREE from '../libs/three.module.js'

 
class Proyeccion extends THREE.Object3D {
  constructor() {
    super();
    this.posicionX = 0;
    this.posicionY = 0;

    this.diapositiva = this.createCuadro();
    
    this.add(this.diapositiva);
  }

  createCuadro(){
    var cuadrado = new THREE.Shape();

    cuadrado.moveTo(  10, 0 );
    cuadrado.lineTo(10,10);
    cuadrado.lineTo(0,10);
    cuadrado.lineTo(0,0);
    cuadrado.lineTo(10,0);
    
    var loader = new THREE.TextureLoader();
    var diapositiva = loader.load('imgs/diapositiva.jpg');
    diapositiva.wrapS = THREE.ClampToEdgeWrapping;
    diapositiva.wrapT = THREE.ClampToEdgeWrapping;
    
    
    var geometry = new THREE.ShapeGeometry( cuadrado );
    var material = new THREE.MeshBasicMaterial( { color: 0xffffff , map:diapositiva} );
    material.opacity = 0.4;
    material.transparent = true;
    var mesh = new THREE.Mesh( geometry, material ) ;

    return mesh;
  }

  mueveX(){
    if(this.posicionX == 0){
        this.diapositiva.position.x +=10;
        this.posicionX ++;
    }
    else if(this.posicionX == 1){
        this.diapositiva.position.x +=10;
        this.posicionX++;
    }else if(this.posicionX == 2){
        this.diapositiva.position.x-=20;
        this.posicionX = 0;
    }

    //console.log(this.posicionX + ", " + this.posicionY);
    if(this.posicionX == 1 && this.posicionY == 1){
        return true;
    }else
        return false;
  }

  mueveY(){
    if(this.posicionY == 0){
        this.diapositiva.position.y +=10;
        this.posicionY ++;
    }
    else if(this.posicionY == 1){
        this.diapositiva.position.y +=10;
        this.posicionY++;
    }else if(this.posicionY == 2){
        this.diapositiva.position.y-=20;
        this.posicionY = 0;
    }

    if(this.posicionX == 1 && this.posicionY == 1){
      return true;
    }else
      return false;
  }
}

export {Proyeccion};

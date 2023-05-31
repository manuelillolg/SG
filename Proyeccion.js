import * as THREE from '../libs/three.module.js'

 
class Proyeccion extends THREE.Object3D {
  constructor(ruta, medidax, mediday) {
    super();
    this.posicionX = 0;
    this.posicionY = 0;

    this.diapositiva = this.createCuadro(ruta, medidax, mediday);
    
    this.add(this.diapositiva);
  }

  createCuadro(ruta, medidax, mediday){
    var cuadrado = new THREE.PlaneGeometry(medidax,mediday);

    cuadrado.translate(medidax/2,mediday/2,0);
    
    var loader = new THREE.TextureLoader();
    var diapositiva = loader.load(ruta);
    diapositiva.wrapS = THREE.ClampToEdgeWrapping;
    diapositiva.wrapT = THREE.ClampToEdgeWrapping;
    
    
   
    var material = new THREE.MeshBasicMaterial( { color: 0xffffff , map:diapositiva} );
    material.opacity = 0.4;
    material.transparent = true;
    var mesh = new THREE.Mesh( cuadrado, material ) ;

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
    if(this.posicionX == 2 && this.posicionY == 2){
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

    if(this.posicionX == 2 && this.posicionY == 2){
      return true;
    }else
      return false;
  }
}

export {Proyeccion};

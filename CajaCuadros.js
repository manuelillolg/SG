import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

import { BotonCuadro } from './BotonCuadro.js'

class CajaCuadros extends THREE.Object3D {
    constructor() {
      super();
      
      this.botones = crearBotones();
      for(var i=0;i<this.botones.length;i++){
        this.botones[i].position.set(5*i,0,0);
        this.add(this.botones[i]);
      }
  
    }
  
    crearBotones(){
        var botones = [];
        botones.push(new BotonCuadro());
        botones.push(new BotonCuadro());
        botones.push(new BotonCuadro());
        botones.push(new BotonCuadro());
    
        return botones;
    }
  
}export { CajaCuadros };
  
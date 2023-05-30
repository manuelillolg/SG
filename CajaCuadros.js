import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

import { BotonCuadro } from './BotonCuadro.js'

class CajaCuadros extends THREE.Object3D {
    constructor(esqueleto) {
      super();
      
      this.botones = this.crearBotones(esqueleto);
      for(var i=0;i<this.botones.length;i++){
        this.botones[i].position.set(5*i,0,0);
        this.add(this.botones[i]);
      }
  
    }
  
    crearBotones(esqueleto){
        var botones = [];
        botones.push(new BotonCuadro(esqueleto));
        botones[0].name = "botonLuz1";
        botones.push(new BotonCuadro(esqueleto));
        botones[1].name = "botonLuz2";
        botones.push(new BotonCuadro(esqueleto));
        botones[2].name = "botonLuz3";
        botones.push(new BotonCuadro(esqueleto));
        botones[3].name = "botonLuz4";
    
        return botones;
    }
  
}export { CajaCuadros };
  
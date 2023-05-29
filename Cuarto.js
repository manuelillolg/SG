import * as THREE from '../libs/three.module.js'
import { CSG } from '../libs/CSG-v2.js'

import { CajaCuadros } from './CajaCuadros.js'

class Cuarto extends THREE.Object3D {
    constructor() {
      super();
      
      this.cajaCuadros = new CajaCuadros();
      this.add(this.cajaCuadros);
      
  
    }
  
    
    
  }
  
  export { Cuarto };
  
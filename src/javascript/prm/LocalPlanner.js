/**
 * @file LocalPlanner.js
 * @description Planificación local entre configuraciones vecinas
 * @version 1.0.0
 */

export class LocalPlanner {
  constructor(options = {}) {
    this.options = {
      interpolationSteps: options.interpolationSteps || 5,
      collisionCheckEnabled: options.collisionCheckEnabled !== false,
      maxTransitionCost: options.maxTransitionCost || 500,
      ...options
    };
  }

  /**
   * Planificar camino local entre dos configuraciones
   * @param {Object} configA - Configuración origen
   * @param {Object} configB - Configuración destino  
   * @param {Object} architecture - Arquitectura del sistema
   * @returns {Object} Resultado con waypoints, costo y probabilidad
   */
  async plan(configA, configB, architecture) {
    // 1. Interpolar configuraciones intermedias
    const waypoints = this._interpolate(configA, configB);
    
    // 2. Verificar validez de cada waypoint
    let isValid = true;
    let totalCost = 0;
    let cumulativeProbability = 1.0;
    
    for (let i = 0; i < waypoints.length - 1; i++) {
      const wp1 = waypoints[i];
      const wp2 = waypoints[i + 1];
      
      // Verificar colisión (configuración inválida)
      if (this.options.collisionCheckEnabled && !this._isValid(wp1, architecture)) {
        isValid = false;
        break;
      }
      
      // Calcular costo de transición
      const transitionCost = this._computeTransitionCost(wp1, wp2, architecture);
      totalCost += transitionCost;
      
      // Calcular probabilidad de éxito de la transición
      const transitionProb = this._computeTransitionProbability(wp1, wp2, architecture);
      cumulativeProbability *= transitionProb;
      
      // Verificar si excede límite de costo
      if (totalCost > this.options.maxTransitionCost) {
        isValid = false;
        break;
      }
    }
    
    return {
      waypoints: isValid ? waypoints : [],
      cost: totalCost,
      probability: cumulativeProbability,
      isValid,
      numSteps: waypoints.length
    };
  }

  /**
   * Interpolar entre dos configuraciones
   * Genera puntos intermedios en el espacio de configuración
   */
  _interpolate(configA, configB) {
    const waypoints = [];
    const steps = this.options.interpolationSteps;
    
    for (let i = 0; i <= steps; i++) {
      const t = i / steps; // Parámetro de interpolación [0, 1]
      
      const interpolated = {
        id: `waypoint_${i}_${Date.now()}`,
        layerSequence: this._interpolateSequence(
          configA.layerSequence,
          configB.layerSequence,
          t
        ),
        confidenceThreshold: this._lerp(
          configA.confidenceThreshold,
          configB.confidenceThreshold,
          t
        ),
        parallelizationFactor: Math.round(this._lerp(
          configA.parallelizationFactor,
          configB.parallelizationFactor,
          t
        )),
        processingMode: t < 0.5 ? configA.processingMode : configB.processingMode,
        tokenCost: Math.round(this._lerp(
          configA.tokenCost || 0,
          configB.tokenCost || 0,
          t
        ))
      };
      
      waypoints.push(interpolated);
    }
    
    return waypoints;
  }

  /**
   * Interpolar secuencias de layers
   * Mezcla gradual entre dos secuencias
   */
  _interpolateSequence(seqA, seqB, t) {
    // Estrategia: transición gradual de seqA a seqB
    // t=0 → 100% seqA
    // t=0.5 → mezcla
    // t=1 → 100% seqB
    
    if (t === 0) return [...seqA];
    if (t === 1) return [...seqB];
    
    // En el medio, crear secuencia híbrida
    const maxLen = Math.max(seqA.length, seqB.length);
    const hybrid = [];
    
    for (let i = 0; i < maxLen; i++) {
      // Elegir de seqA o seqB según t
      if (i < seqA.length && Math.random() > t) {
        if (!hybrid.includes(seqA[i])) {
          hybrid.push(seqA[i]);
        }
      } else if (i < seqB.length) {
        if (!hybrid.includes(seqB[i])) {
          hybrid.push(seqB[i]);
        }
      }
    }
    
    // Asegurar Input y Output
    if (!hybrid.includes('Input')) hybrid.unshift('Input');
    if (!hybrid.includes('Output')) hybrid.push('Output');
    
    return hybrid;
  }

  /**
   * Interpolación lineal
   */
  _lerp(a, b, t) {
    return a * (1 - t) + b * t;
  }

  /**
   * Verificar si configuración es válida
   */
  _isValid(config, architecture) {
    // 1. Verificar secuencia de layers
    if (!this._isLayerSequenceValid(config.layerSequence, architecture)) {
      return false;
    }
    
    // 2. Verificar constraints de recursos
    if (config.tokenCost > architecture.constraints?.maxTokens) {
      return false;
    }
    
    // 3. Verificar umbral de confianza
    if (config.confidenceThreshold < architecture.constraints?.minConfidence) {
      return false;
    }
    
    return true;
  }

  /**
   * Verificar validez de secuencia de layers
   */
  _isLayerSequenceValid(sequence, architecture) {
    // Input y Output obligatorios
    if (!sequence.includes('Input') || !sequence.includes('Output')) {
      return false;
    }
    
    // Verificar dependencias entre layers
    const dependencies = architecture.layerDependencies || {};
    
    for (let i = 1; i < sequence.length; i++) {
      const current = sequence[i];
      const deps = dependencies[current] || [];
      
      // Verificar que todas las dependencias estén antes en la secuencia
      const hasRequiredDeps = deps.every(dep => 
        sequence.slice(0, i).includes(dep)
      );
      
      if (!hasRequiredDeps) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * Calcular costo de transición entre waypoints
   */
  _computeTransitionCost(wp1, wp2, architecture) {
    let cost = 0;
    
    // 1. Costo por diferencia en layers
    const layerDiff = Math.abs(wp1.layerSequence.length - wp2.layerSequence.length);
    cost += layerDiff * 50; // 50 tokens por layer de diferencia
    
    // 2. Costo por cambio de modo de procesamiento
    if (wp1.processingMode !== wp2.processingMode) {
      cost += 100; // Penalización por cambio de modo
    }
    
    // 3. Costo por diferencia en umbral de confianza
    const confDiff = Math.abs(wp1.confidenceThreshold - wp2.confidenceThreshold);
    cost += confDiff * 80; // Escalar diferencia
    
    // 4. Costo base de transición
    cost += 30;
    
    return cost;
  }

  /**
   * Calcular probabilidad de éxito de transición
   */
  _computeTransitionProbability(wp1, wp2, architecture) {
    let probability = 1.0;
    
    // 1. Penalizar transiciones grandes
    const distance = this._configDistance(wp1, wp2);
    const distanceFactor = Math.exp(-distance / 50); // Decay exponencial
    probability *= distanceFactor;
    
    // 2. Bonus para transiciones válidas
    if (this._isValid(wp2, architecture)) {
      probability *= 1.2;
    } else {
      probability *= 0.3; // Penalización fuerte
    }
    
    // 3. Considerar compatibilidad de layers
    const compatibility = this._layerCompatibility(wp1.layerSequence, wp2.layerSequence);
    probability *= compatibility;
    
    return Math.min(1.0, Math.max(0.0, probability));
  }

  /**
   * Calcular distancia entre configuraciones
   */
  _configDistance(configA, configB) {
    let distance = 0;
    
    // Diferencia en secuencias de layer
    const maxLen = Math.max(configA.layerSequence.length, configB.layerSequence.length);
    const seqDiff = Math.abs(configA.layerSequence.length - configB.layerSequence.length) / maxLen;
    distance += seqDiff * 40;
    
    // Diferencia en umbral de confianza
    const confDiff = Math.abs(configA.confidenceThreshold - configB.confidenceThreshold);
    distance += confDiff * 30;
    
    // Diferencia en factor de paralelización
    const parDiff = Math.abs(configA.parallelizationFactor - configB.parallelizationFactor) / 4;
    distance += parDiff * 30;
    
    return distance;
  }

  /**
   * Calcular compatibilidad entre secuencias de layers
   */
  _layerCompatibility(seqA, seqB) {
    // Calcular similitud de Jaccard
    const setA = new Set(seqA);
    const setB = new Set(seqB);
    
    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);
    
    const jaccard = intersection.size / union.size;
    
    return jaccard;
  }

  /**
   * Verificar si dos configuraciones están lo suficientemente cerca
   * para intentar conexión directa
   */
  canConnect(configA, configB, maxDistance = 50) {
    const distance = this._configDistance(configA, configB);
    return distance <= maxDistance;
  }

  /**
   * Optimizar camino usando shortcutting
   * Eliminar waypoints innecesarios
   */
  optimizePath(waypoints, architecture) {
    if (waypoints.length <= 2) return waypoints;
    
    const optimized = [waypoints[0]];
    let current = 0;
    
    while (current < waypoints.length - 1) {
      let farthest = current + 1;
      
      // Intentar conectar directamente con waypoints más lejanos
      for (let i = waypoints.length - 1; i > current + 1; i--) {
        const result = this.plan(waypoints[current], waypoints[i], architecture);
        
        if (result.isValid && result.cost < this.options.maxTransitionCost) {
          farthest = i;
          break;
        }
      }
      
      optimized.push(waypoints[farthest]);
      current = farthest;
    }
    
    return optimized;
  }
}

/**
 * @file PathRanker.js
 * @description Sistema de ranking de rutas con métricas probabilísticas
 * @version 1.0.0
 */

export class PathRanker {
  constructor(options = {}) {
    this.options = {
      weights: {
        probability: 0.35,
        cost: 0.30,
        length: 0.15,
        entropy: 0.20
      },
      ...options
    };
  }

  /**
   * Rankear múltiples rutas según métricas compuestas
   * @param {Array} paths - Array de objetos {path, metrics}
   * @param {Object} customWeights - Pesos personalizados (opcional)
   * @returns {Array} Rutas rankeadas con scores
   */
  rank(paths, options = {}) {
    const weights = options.weights || this.options.weights;
    
    const ranked = paths.map((pathData, idx) => {
      const metrics = pathData.metrics;
      
      // Normalizar métricas a [0, 1]
      const normalized = this._normalizeMetrics(metrics, paths);
      
      // Calcular score compuesto
      const compositeScore = this._calculateCompositeScore(normalized, weights);
      
      // Calcular nivel de confiabilidad
      const reliability = this._calculateReliability(metrics.pathProbability);
      
      // Calcular intervalo de confianza
      const confidence95 = this._wilson95Interval(metrics.pathProbability, 100);
      
      return {
        rank: 0, // Se asignará después
        path: pathData.path,
        metrics: {
          ...metrics,
          normalized,
          reliability,
          confidence95
        },
        compositeScore,
        recommendation: this._generateRecommendation(compositeScore, reliability)
      };
    });
    
    // Ordenar por score (descendente)
    ranked.sort((a, b) => b.compositeScore - a.compositeScore);
    
    // Asignar rankings
    ranked.forEach((item, idx) => {
      item.rank = idx + 1;
    });
    
    return ranked;
  }

  /**
   * Normalizar métricas a escala [0, 1]
   */
  _normalizeMetrics(metrics, allPaths) {
    const allMetrics = allPaths.map(p => p.metrics);
    
    // Encontrar min/max para cada métrica
    const ranges = {
      probability: {
        min: Math.min(...allMetrics.map(m => m.pathProbability || 0)),
        max: Math.max(...allMetrics.map(m => m.pathProbability || 1))
      },
      cost: {
        min: Math.min(...allMetrics.map(m => m.totalCost || 0)),
        max: Math.max(...allMetrics.map(m => m.totalCost || 1000))
      },
      length: {
        min: Math.min(...allMetrics.map(m => m.pathLength || 1)),
        max: Math.max(...allMetrics.map(m => m.pathLength || 10))
      },
      entropy: {
        min: Math.min(...allMetrics.map(m => m.entropy || 0)),
        max: Math.max(...allMetrics.map(m => m.entropy || 5))
      }
    };
    
    return {
      probability: this._normalize(
        metrics.pathProbability || 0,
        ranges.probability.min,
        ranges.probability.max
      ),
      cost: 1 - this._normalize( // Invertir: menor costo = mejor
        metrics.totalCost || 0,
        ranges.cost.min,
        ranges.cost.max
      ),
      length: 1 - this._normalize( // Invertir: menor longitud = mejor
        metrics.pathLength || 1,
        ranges.length.min,
        ranges.length.max
      ),
      entropy: 1 - this._normalize( // Invertir: menor incertidumbre = mejor
        metrics.entropy || 0,
        ranges.entropy.min,
        ranges.entropy.max
      )
    };
  }

  /**
   * Normalizar valor a [0, 1]
   */
  _normalize(value, min, max) {
    if (max === min) return 0.5;
    return (value - min) / (max - min);
  }

  /**
   * Calcular score compuesto ponderado
   */
  _calculateCompositeScore(normalized, weights) {
    return (
      normalized.probability * weights.probability +
      normalized.cost * weights.cost +
      normalized.length * weights.length +
      normalized.entropy * weights.entropy
    );
  }

  /**
   * Calcular nivel de confiabilidad
   */
  _calculateReliability(probability) {
    return {
      score: probability,
      level: probability > 0.8 ? 'high' : 
             probability > 0.5 ? 'medium' : 'low',
      label: probability > 0.8 ? '✓ Alta' :
             probability > 0.5 ? '⚠ Media' : '⚠ Baja'
    };
  }

  /**
   * Intervalo de confianza Wilson Score (95%)
   */
  _wilson95Interval(p, n) {
    const z = 1.96; // 95% confidence
    const denominator = 1 + (z * z) / n;
    
    const center = (p + z * z / (2 * n)) / denominator;
    const margin = z * Math.sqrt(p * (1 - p) / n + z * z / (4 * n * n)) / denominator;
    
    return {
      lower: Math.max(0, center - margin),
      point: p,
      upper: Math.min(1, center + margin),
      margin,
      width: 2 * margin
    };
  }

  /**
   * Generar recomendación basada en score y confiabilidad
   */
  _generateRecommendation(score, reliability) {
    if (score > 0.8 && reliability.level === 'high') {
      return {
        action: 'recommend',
        message: '✓ Ruta óptima recomendada',
        priority: 'high'
      };
    } else if (score > 0.6 && reliability.level !== 'low') {
      return {
        action: 'consider',
        message: '→ Ruta viable, considerar',
        priority: 'medium'
      };
    } else {
      return {
        action: 'avoid',
        message: '⚠ Ruta subóptima, evitar',
        priority: 'low'
      };
    }
  }

  /**
   * Comparar dos rutas y determinar cuál es mejor
   */
  compare(pathA, pathB) {
    const rankedPaths = this.rank([pathA, pathB]);
    
    const winner = rankedPaths[0];
    const diff = Math.abs(rankedPaths[0].compositeScore - rankedPaths[1].compositeScore);
    
    return {
      winner: winner.path === pathA.path ? 'A' : 'B',
      scoreDifference: diff,
      significant: diff > 0.1, // Diferencia significativa si > 10%
      details: {
        pathA: rankedPaths.find(r => r.path === pathA.path),
        pathB: rankedPaths.find(r => r.path === pathB.path)
      }
    };
  }

  /**
   * Filtrar rutas por umbral mínimo de score
   */
  filter(rankedPaths, minScore = 0.5) {
    return rankedPaths.filter(p => p.compositeScore >= minScore);
  }

  /**
   * Agrupar rutas por nivel de confiabilidad
   */
  groupByReliability(rankedPaths) {
    return {
      high: rankedPaths.filter(p => p.metrics.reliability.level === 'high'),
      medium: rankedPaths.filter(p => p.metrics.reliability.level === 'medium'),
      low: rankedPaths.filter(p => p.metrics.reliability.level === 'low')
    };
  }

  /**
   * Generar tabla de comparación
   */
  generateComparisonTable(rankedPaths) {
    return rankedPaths.map(item => ({
      rank: item.rank,
      pathId: item.path.id || `path_${item.rank}`,
      probability: `${(item.metrics.pathProbability * 100).toFixed(1)}%`,
      cost: `${item.metrics.totalCost.toFixed(0)} tokens`,
      length: `${item.metrics.pathLength} hops`,
      entropy: `${item.metrics.entropy.toFixed(2)} bits`,
      reliability: item.metrics.reliability.label,
      score: (item.compositeScore * 100).toFixed(1),
      recommendation: item.recommendation.message
    }));
  }

  /**
   * Análisis de sensibilidad: cómo cambia el ranking con diferentes pesos
   */
  sensitivityAnalysis(paths, weightVariations = []) {
    const baseRanking = this.rank(paths);
    
    const analyses = weightVariations.map(weights => {
      const variedRanking = this.rank(paths, { weights });
      
      // Calcular cambios en el ranking
      const rankChanges = baseRanking.map((basePath, idx) => {
        const variedPath = variedRanking.find(v => v.path === basePath.path);
        return {
          path: basePath.path,
          baseRank: basePath.rank,
          variedRank: variedPath.rank,
          change: variedPath.rank - basePath.rank
        };
      });
      
      return {
        weights,
        ranking: variedRanking,
        rankChanges,
        maxChange: Math.max(...rankChanges.map(c => Math.abs(c.change)))
      };
    });
    
    return {
      baseRanking,
      analyses,
      stability: this._calculateStability(analyses)
    };
  }

  /**
   * Calcular estabilidad del ranking
   */
  _calculateStability(analyses) {
    if (analyses.length === 0) return 1.0;
    
    const avgMaxChange = analyses.reduce((sum, a) => sum + a.maxChange, 0) / analyses.length;
    
    // Estabilidad = 1 - (cambio promedio normalizado)
    // Cambios grandes = baja estabilidad
    return Math.max(0, 1 - avgMaxChange / 10);
  }

  /**
   * Exportar resultados a formato JSON
   */
  export(rankedPaths) {
    return {
      timestamp: new Date().toISOString(),
      numPaths: rankedPaths.length,
      weights: this.options.weights,
      rankings: this.generateComparisonTable(rankedPaths),
      summary: {
        bestPath: rankedPaths[0],
        averageScore: rankedPaths.reduce((sum, p) => sum + p.compositeScore, 0) / rankedPaths.length,
        reliabilityDistribution: this.groupByReliability(rankedPaths)
      }
    };
  }
}

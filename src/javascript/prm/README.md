# 🗺️ Probabilistic Roadmap (PRM) para Arquitecturas de IA

## Descripción General

Sistema avanzado de detección y ranking de rutas óptimas en arquitecturas de IA basado en **Probabilistic Roadmap (PRM)**, originalmente desarrollado para planificación de movimiento en robótica de alta dimensionalidad.

### Analogía Conceptual

Imagina el PRM como un **sistema de navegación neuronal** donde:
- Cada arquitectura es un **distrito de la ciudad**
- Los nodos (configuraciones) son **intersecciones**
- Las conexiones son **avenidas** con diferentes costos y probabilidades de éxito
- El sistema construye un **mapa probabilístico** sin conocer todos los destinos finales

##  Componentes Principales

### 1. LocalPlanner.js
**Planificación local entre configuraciones vecinas**

```javascript
import { LocalPlanner } from './prm/LocalPlanner.js';

const planner = new LocalPlanner({
  interpolationSteps: 5,
  collisionCheckEnabled: true,
  maxTransitionCost: 500
});

// Planificar camino entre dos configuraciones
const result = await planner.plan(configA, configB, architecture);

console.log(result);
// {
//   waypoints: [...],
//   cost: 245,
//   probability: 0.89,
//   isValid: true,
//   numSteps: 6
// }
```

**Características:**
- ✓ Interpolación suave entre configuraciones
- ✓ Cálculo de costo de transición (tokens, latencia)
- ✓ Probabilidad de éxito por transición
- ✓ Validación de dependencias de layers
- ✓ Optimización de caminos (shortcutting)

---

### 2. PathRanker.js
**Sistema de ranking con métricas probabilísticas avanzadas**

```javascript
import { PathRanker } from './prm/PathRanker.js';

const ranker = new PathRanker({
  weights: {
    probability: 0.35,  // Probabilidad de éxito
    cost: 0.30,         // Costo en tokens
    length: 0.15,       // Longitud del camino
    entropy: 0.20       // Incertidumbre
  }
});

// Rankear múltiples rutas
const ranked = ranker.rank(paths);

// Resultado:
// [
//   {
//     rank: 1,
//     path: {...},
//     compositeScore: 0.89,
//     recommendation: {action: 'recommend', message: '✓ Ruta óptima'},
//     metrics: {
//       pathProbability: 0.89,
//       totalCost: 245,
//       pathLength: 4,
//       entropy: 0.45,
//       reliability: {level: 'high', label: '✓ Alta'},
//       confidence95: {lower: 0.83, upper: 0.93}
//     }
//   },
//   ...
// ]
```

**Funcionalidades:**
- ✓ Normalización automática de métricas
- ✓ Intervalos de confianza Wilson Score (95%)
- ✓ Análisis de sensibilidad de pesos
- ✓ Agrupación por confiabilidad
- ✓ Exportación a JSON/tablas comparativas

---

## 📊 Casos de Uso

### Caso 1: Optimización de RCOP (Recursive Chain-of-Prompts)

```javascript
// Detectar si incluir MetaReasoner es óptimo
const startConfig = {
  layerSequence: ['Input', 'Reasoning'],
  confidenceThreshold: 0.7,
  parallelizationFactor: 1
};

const goalConfig = {
  layerSequence: ['Output', 'MetaReasoning'],
  confidenceThreshold: 0.9,
  parallelizationFactor: 2
};

const paths = await prm.findAndRankPaths('RCOP', startConfig, goalConfig, 5);

console.log(paths[0]); // Mejor ruta
// Ruta óptima: Input→Reasoning→MetaReasoning→Output
// Probabilidad: 89.4%, Costo: 245 tokens, Score: 82.3
```

---

### Caso 2: Selección de Agente en MCP-Swarm

```javascript
// Determinar agente óptimo para tarea de CodeGeneration
const agentRoutes = await prm.queryRoadmap('MCP-Swarm', {
  agent: 'Coordinator',
  task: 'CodeGeneration'
}, {
  agent: 'Executor',
  status: 'Complete'
}, 500);

const ranked = ranker.rank(agentRoutes);
const optimalAgent = ranked[0].path.suggestedAgent;

console.log(`Agente recomendado: ${optimalAgent}`);
// Agente recomendado: Coder (Confiabilidad: 92%, Costo: 180 tokens)
```

---

### Caso 3: Monitoreo de Confiabilidad en AgentOps

```javascript
// Calcular confianza para alertas críticas
const alertPath = await prm.queryPath('AgentOps', {
  stage: 'Detection'
}, {
  stage: 'Mitigation'
}, 200);

const confidence = ranker._wilson95Interval(
  alertPath.metrics.pathProbability,
  100
);

if (confidence.lower > 0.85) {
  console.log("✅ Ruta confiable para acción automática");
} else {
  console.log("⚠️ Requiere intervención humana", confidence);
}
```

---

## 🎯 Métricas y Análisis

### Tabla Comparativa de Rutas

| Rango | Ruta ID | Probabilidad | Costo | Hops | Entropía | Confiabilidad | Score | Recomendación |
|-------|---------|-------------|-------|------|----------|---------------|-------|---------------|
| 1 | path_a | 89.4% | 245 tokens | 4 | 0.45 bits | ✓ Alta | 82.3 | ✓ Ruta óptima recomendada |
| 2 | path_b | 76.8% | 312 tokens | 5 | 0.68 bits | ⚠ Media | 71.2 | → Ruta viable, considerar |
| 3 | path_c | 64.2% | 198 tokens | 4 | 0.82 bits | ⚠ Baja | 58.9 | ⚠ Ruta subóptima, evitar |

---

### Generación de Tabla

```javascript
const table = ranker.generateComparisonTable(rankedPaths);
console.table(table);
```

---

## 🔬 Análisis de Sensibilidad

```javascript
// Evaluar estabilidad del ranking con diferentes pesos
const sensitivityAnalysis = ranker.sensitivityAnalysis(paths, [
  {probability: 0.5, cost: 0.3, length: 0.1, entropy: 0.1},
  {probability: 0.2, cost: 0.5, length: 0.2, entropy: 0.1},
  {probability: 0.4, cost: 0.2, length: 0.2, entropy: 0.2}
]);

console.log(`Estabilidad del ranking: ${(sensitivityAnalysis.stability * 100).toFixed(1)}%`);
// Estabilidad del ranking: 87.3%
// (Alta estabilidad = ranking robusto ante cambios de pesos)
```

---

## 🚀 Ejemplo Completo de Integración

```javascript
import { LocalPlanner } from './prm/LocalPlanner.js';
import { PathRanker } from './prm/PathRanker.js';

// 1. Inicializar componentes
const planner = new LocalPlanner();
const ranker = new PathRanker();

// 2. Definir arquitectura
const architecture = {
  name: 'RCOP',
  layers: [
    {name: 'Input', required: true},
    {name: 'Perception', required: false},
    {name: 'Analysis', required: false},
    {name: 'Synthesis', required: false},
    {name: 'Output', required: true}
  ],
  layerDependencies: {
    'Synthesis': ['Analysis'],
    'Analysis': ['Perception']
  },
  constraints: {
    maxTokens: 2000,
    minConfidence: 0.5
  }
};

// 3. Generar configuraciones candidatas
const configA = {
  layerSequence: ['Input', 'Perception', 'Analysis', 'Output'],
  confidenceThreshold: 0.8,
  parallelizationFactor: 2
};

const configB = {
  layerSequence: ['Input', 'Analysis', 'Synthesis', 'Output'],
  confidenceThreshold: 0.7,
  parallelizationFactor: 1
};

// 4. Planificar caminos locales
const localPath = await planner.plan(configA, configB, architecture);

// 5. Crear múltiples rutas alternativas
const paths = [
  {path: localPath.waypoints, metrics: {...}},
  {path: alternativePath, metrics: {...}},
  // ...
];

// 6. Rankear rutas
const ranked = ranker.rank(paths);

// 7. Exportar resultados
const results = ranker.export(ranked);
console.log(JSON.stringify(results, null, 2));
```

---

## 📈 Beneficios del Sistema PRM

### 1. Exploración Eficiente
- Muestreo probabilístico vs. exploración exhaustiva
- Complejidad: O(n log n) vs. O(n!)

### 2. Escalabilidad
- Funciona en espacios de alta dimensionalidad
- Añadir arquitecturas nuevas no require recálculo completo

### 3. Adaptabilidad
- Pesos personalizables según contexto
- Métricas extensibles

### 4. Confiabilidad
- Intervalos de confianza estadísticos
- Análisis de sensibilidad

---

## 🛠️ Próximos Pasos

- [ ] Implementar visualización 3D con Three.js
- [ ] Agregar estrategias de sampling (Gaussian, Adaptive)
- [ ] Crear búsqueda Dijkstra/A* optimizada
- [ ] Integrar con dashboard en tiempo real
- [ ] Añadir tests unitarios y de integración

---

## 📚 Referencias

- **PRM Original**: Kavraki, L. E. et al. (1996) "Probabilistic roadmaps for path planning in high-dimensional configuration spaces"
- **Wilson Score Interval**: Wilson, E. B. (1927) "Probable inference, the law of succession, and statistical inference"
- **Architecture Patterns**: PrompTitecture v2.0 Documentation

---

## 📝 Licencia

MIT License - Ver LICENSE file para detalles

---

## 👥 Contribuciones

Desarrollado como parte de **PrompTitecture v2.0**  
GitHub: [GaboBase/promptitecture](https://github.com/GaboBase/promptitecture)

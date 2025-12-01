# 🏗️ PrompTitecture

> **Production-grade AI Architecture Framework**
> 
> Modular, executable architectures for building and deploying intelligent systems

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Python 3.9+](https://img.shields.io/badge/python-3.9+-blue.svg)](https://www.python.org/downloads/)
[![Code style: black](https://img.shields.io/badge/code%20style-black-000000.svg)](https://github.com/psf/black)

## 📖 Overview

PrompTitecture is a comprehensive framework for implementing production-ready AI architectures. It provides modular, battle-tested implementations of advanced AI patterns including:

- **EC-RAG**: Enterprise Cognitive RAG with multi-hop reasoning
- **MCP-Swarm**: Multi-Cognitive Process Swarm Intelligence
- **RCOP**: Recursive Chain of Prompts
- **FLSIN**: Federated Learning System Integration Network  
- **HMMAF**: Hierarchical Multi-Model Architecture Framework
- **MetaReasoner**: Meta-cognitive reasoning engine
- **AgentOps**: AI Agent Operations platform
- **GenOps**: Generative AI Operations framework

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/GaboBase/promptitecture.git
cd promptitecture

# Install dependencies
pip install -r requirements.txt

# Install in development mode
pip install -e .
```

### Usage

#### CLI

```bash
# Run an architecture
promptitecture run ec-rag --input "query.txt"

# List available architectures  
promptitecture list

# Get architecture info
promptitecture info flsin
```

#### Python API

```python
from promptitecture.architectures import ECRAG

# Initialize architecture
rag = ECRAG(config={'model': 'gpt-4'})

# Execute query
result = rag.query("What is quantum computing?")
print(result)
```

## 📁 Project Structure

```
promptitecture/
├── src/
│   └── promptitecture/
│       ├── __init__.py          # Package initialization
│       ├── architectures/       # Architecture implementations
│       │   ├── ec_rag/         # Enterprise Cognitive RAG
│       │   ├── mcp_swarm/      # MCP Swarm Intelligence
│       │   ├── rcop/           # Recursive Chain of Prompts
│       │   ├── flsin/          # Federated Learning Network
│       │   ├── hmmaf/          # Hierarchical Multi-Model
│       │   ├── metareasoner/   # Meta-cognitive Reasoning
│       │   ├── agentops/       # Agent Operations
│       │   └── genops/         # Generative AI Ops
│       ├── cli/                # Command-line interface
│       ├── api/                # FastAPI REST API
│       ├── core/               # Core utilities
│       └── playground/         # Interactive playground
├── tests/                      # Unit and integration tests
├── docs/                       # Documentation
├── docker/                     # Docker configurations
├── .github/                    # GitHub Actions CI/CD
├── setup.py                    # Package setup
├── requirements.txt            # Dependencies
├── README.md                   # This file
└── .gitignore                  # Git ignore rules
```

## 🏛️ Architectures

### EC-RAG (Enterprise Cognitive RAG)
Advanced Retrieval-Augmented Generation with:
- Multi-hop reasoning
- Knowledge graph integration
- Cognitive process modeling
- Enterprise-grade security

### MCP-Swarm (Multi-Cognitive Process Swarm)
Distributed intelligence system featuring:
- Swarm-based problem solving
- Multi-agent coordination
- Emergent behavior patterns
- Adaptive optimization

### RCOP (Recursive Chain of Prompts)
Iterative prompt engineering with:
- Self-improving prompts
- Recursive reasoning loops
- Context preservation
- Performance optimization

### FLSIN (Federated Learning System Integration)
Distributed learning framework with:
- Privacy-preserving training
- Federated model aggregation
- Cross-silo collaboration
- Edge deployment support

### HMMAF (Hierarchical Multi-Model Architecture)
Layered model orchestration with:
- Model hierarchy management
- Dynamic model selection
- Resource optimization
- Fallback strategies

## 🛠️ Development

### Setup Development Environment

```bash
# Install development dependencies
pip install -e ".[dev]"

# Install pre-commit hooks
pre-commit install

# Run tests
pytest tests/

# Run linting
black src/
ruff check src/
mypy src/
```

### Running Tests

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=promptitecture tests/

# Run specific architecture tests
pytest tests/test_ec_rag.py
```

## 🚢 Deployment

### Docker

```bash
# Build image
docker build -t promptitecture:latest .

# Run container
docker run -p 8000:8000 promptitecture:latest
```

### Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📚 Documentation

Full documentation is available at [promptitecture.dev](https://promptitecture.dev)

- [Architecture Guide](docs/architectures/)
- [API Reference](docs/api/)
- [CLI Reference](docs/cli/)
- [Deployment Guide](docs/deployment/)
- [Contributing Guide](CONTRIBUTING.md)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by cutting-edge AI research and production systems
- Built with ❤️ by the PrompTitecture team
- Special thanks to all contributors

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/GaboBase/promptitecture/issues)
- **Discussions**: [GitHub Discussions](https://github.com/GaboBase/promptitecture/discussions)
- **Email**: support@promptitecture.dev

## 🗺️ Roadmap

- [x] Core framework implementation
- [x] CLI interface
- [ ] REST API
- [ ] Web playground
- [ ] Additional architectures
- [ ] Performance optimizations
- [ ] Cloud deployment templates
- [ ] Comprehensive documentation

---

**Made with 🏗️ by [GaboBase](https://github.com/GaboBase)**

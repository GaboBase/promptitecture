"""
PrompTitecture - Production-grade AI Architecture Framework
============================================================

A modular, production-ready framework for implementing and deploying
AI architectures including EC-RAG, MCP-Swarm, RCOP, FLSIN, HMMAF, and more.

Author: GaboBase
Repository: https://github.com/GaboBase/promptitecture
"""

__version__ = "0.1.0"
__author__ = "GaboBase"
__license__ = "MIT"

# Import core architectures
from .architectures import *
from .cli import main as cli_main
from .api import create_app

__all__ = [
    "__version__",
    "__author__",
    "__license__",
    "cli_main",
    "create_app",
]

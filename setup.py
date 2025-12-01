"""
PrompTitecture Setup Configuration
Production-grade AI Architecture Framework
"""

from setuptools import setup, find_packages

with open("README.md", "r", encoding="utf-8") as fh:
    long_description = fh.read()

setup(
    name="promptitecture",
    version="0.1.0",
    author="GaboBase",
    author_email="",
    description="Production-grade AI Architecture Framework with modular, executable architectures",
    long_description=long_description,
    long_description_content_type="text/markdown",
    url="https://github.com/GaboBase/promptitecture",
    project_urls={
        "Bug Tracker": "https://github.com/GaboBase/promptitecture/issues",
        "Documentation": "https://github.com/GaboBase/promptitecture",
        "Source Code": "https://github.com/GaboBase/promptitecture",
    },
    packages=find_packages(where="src"),
    package_dir={"": "src"},
    classifiers=[
        "Development Status :: 3 - Alpha",
        "Intended Audience :: Developers",
        "Topic :: Software Development :: Libraries :: Python Modules",
        "Topic :: Scientific/Engineering :: Artificial Intelligence",
        "Programming Language :: Python :: 3",
        "Programming Language :: Python :: 3.9",
        "Programming Language :: Python :: 3.10",
        "Programming Language :: Python :: 3.11",
        "License :: OSI Approved :: MIT License",
        "Operating System :: OS Independent",
    ],
    python_requires=">=3.9",
    install_requires=[
        "fastapi>=0.104.0",
        "uvicorn[standard]>=0.24.0",
        "pydantic>=2.4.0",
        "langchain>=0.1.0",
        "openai>=1.3.0",
        "anthropic>=0.7.0",
        "chromadb>=0.4.15",
        "redis>=5.0.0",
        "sqlalchemy>=2.0.0",
        "alembic>=1.12.0",
        "httpx>=0.25.0",
        "aiohttp>=3.9.0",
        "pyyaml>=6.0",
        "python-dotenv>=1.0.0",
        "click>=8.1.0",
        "rich>=13.6.0",
        "pytest>=7.4.0",
        "pytest-asyncio>=0.21.0",
        "pytest-cov>=4.1.0",
        "black>=23.10.0",
        "ruff>=0.1.0",
        "mypy>=1.6.0",
    ],
    extras_require={
        "dev": [
            "pytest>=7.4.0",
            "pytest-asyncio>=0.21.0",
            "pytest-cov>=4.1.0",
            "black>=23.10.0",
            "ruff>=0.1.0",
            "mypy>=1.6.0",
            "pre-commit>=3.5.0",
        ],
        "docs": [
            "mkdocs>=1.5.0",
            "mkdocs-material>=9.4.0",
            "mkdocstrings[python]>=0.23.0",
        ],
    },
    entry_points={
        "console_scripts": [
            "promptitecture=promptitecture.cli:main",
            "pt=promptitecture.cli:main",
        ],
    },
)

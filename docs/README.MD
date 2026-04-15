# 📘 KmerLex Documentation

Welcome to the KmerLex documentation. This directory contains technical documentation for the project.

## Table of Contents

| Document | Description |
|----------|-------------|
| [Main README](../README.MD) | Project overview, setup, and usage |
| [Grammar Definition](../grammar/) | Complete BNF grammar for Camfranglais |
| [Grammar Build Notes](../grammar/BuildingCFG.MD) | How the CFG was constructed |
| [Sample Data](../data/) | Corpus of sample sentences |

## Architecture Overview

KmerLex follows **Clean Architecture**:

- **Domain Layer** (`internal/core/domain/`) — Tokens, AST nodes, errors
- **Ports** (`internal/core/ports/`) — Lexer and Parser interfaces
- **Adapters** (`internal/adapters/`) — Regex lexer, Recursive descent parser
- **Services** (`internal/core/services/`) — SyntaxAnalyzer orchestrator
- **Web** (`web/`) — Flask API backend + React TypeScript frontend

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/tokenize` | Tokenize source text |
| POST | `/api/analyze` | Full analysis (lexical or syntactic mode) |

## Development

```bash
make install    # Install dependencies
make test       # Run 155+ tests
make run        # Start dev server on :5000
make docker-build  # Build Docker image
```
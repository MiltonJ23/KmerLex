<div align="center">

# 🌍 KmerLex

### The First Compiler for Camfranglais & Cameroon Pidgin

*Decoding the syntax of Cameroon's streets — one token at a time.*

[![CI](https://github.com/MiltonJ23/KmerLex/actions/workflows/ci.yml/badge.svg)](https://github.com/MiltonJ23/KmerLex/actions/workflows/ci.yml)
[![Release](https://github.com/MiltonJ23/KmerLex/actions/workflows/release.yml/badge.svg)](https://github.com/MiltonJ23/KmerLex/actions/workflows/release.yml)
[![Python](https://img.shields.io/badge/Python-3.10%20|%203.11%20|%203.12-3776AB?logo=python&logoColor=white)](https://python.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)](https://react.dev)
[![Flask](https://img.shields.io/badge/Flask-3.1-000000?logo=flask&logoColor=white)](https://flask.palletsprojects.com)
[![Docker](https://img.shields.io/badge/Docker-Ready-2496ED?logo=docker&logoColor=white)](https://docker.com)
[![GHCR](https://img.shields.io/badge/GHCR-ghcr.io%2Fmiltonj23%2Fkmerlex-181717?logo=github&logoColor=white)](https://github.com/MiltonJ23/KmerLex/pkgs/container/kmerlex)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Tests](https://img.shields.io/badge/Tests-155%20passing-brightgreen?logo=pytest&logoColor=white)](#-testing)
[![Coverage](https://img.shields.io/badge/Coverage-%E2%89%A590%25-brightgreen?logo=codecov&logoColor=white)](#-testing)
[![Architecture](https://img.shields.io/badge/Architecture-Clean-blueviolet)](#-architecture)

---

<p align="center">
  <strong>🇨🇲 A full-stack compiler that tokenizes and parses Camfranglais and Cameroon Pidgin — two vibrant urban languages born in the streets of Yaoundé and Douala.</strong>
</p>

</div>

---

## 📖 What is KmerLex?

**KmerLex** is an academic compiler project that brings formal language theory to the streets of Cameroon. It is a **lexer** (tokenizer) and **parser** (syntax analyzer) for two informal languages:

| Language | What It Is | Where It's Spoken |
|----------|-----------|-------------------|
| **Camfranglais** | A mix of French, English, and local Cameroonian languages | Yaoundé, student communities |
| **Cameroon Pidgin** | An English-based creole with unique grammatical structures | Douala, marketplaces, everyday life |

### 🤔 Why Does This Matter?

These languages are spoken by **millions** of people but have **zero** formal computational tools. KmerLex is the first step towards:

- 📝 **Spell checkers** for Camfranglais/Pidgin
- 🤖 **NLP tools** for African languages
- �� **Language preservation** through formal grammar definition
- 🎓 **Teaching compiler design** with culturally relevant examples

> **Think of it like this:** Just as Python has a parser that understands `if x > 5:`, KmerLex understands `"Massa, le gars ci a tchop le fey"` — and can break it down into its grammatical components.

---

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔤 **Lexical Analysis** | Tokenizes Camfranglais text into grammatical tokens (verbs, nouns, interjections, etc.) |
| 🌳 **Syntactic Analysis** | Builds an Abstract Syntax Tree (AST) using recursive descent parsing |
| 🎨 **Interactive Web IDE** | A beautiful React-based terminal UI with real-time analysis |
| 🌳 **AST Visualization** | Interactive, animated syntax tree rendering with zoom and drag |
| 🐍 **Python Backend** | Clean Architecture Flask API with dependency injection |
| 🔄 **Dual Engine** | Both Python (server-side) and TypeScript (client-side) analysis engines |
| 📐 **Formal Grammar** | Complete BNF grammar definition for Camfranglais |
| 🐳 **Docker Ready** | Single container with both frontend and backend |
| 🧪 **155+ Tests** | Comprehensive test suite with ≥90% coverage |
| 🚀 **CI/CD** | Automated testing, building, and container publishing to GHCR |

---

## 🖥️ Application Preview

The KmerLex web interface features a **sci-fi themed terminal aesthetic** with a neon green color scheme (`#051A14` background, `#00E676` neon accents), IBM Plex Mono font, frosted glass cards, and Framer Motion animations.

### Landing Page

```
┌─────────────────────────────────────────────────────────┐
│  ◉ ◉ ◉                   KmerLex                       │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ░░░ ENGINE V1.0 ONLINE ░░░                             │
│                                                         │
│  ╔════════════════════════╗  ┌─── lexer_output.json ──┐ │
│  ║     DECODING           ║  │ // Input: "Le pater a  │ │
│  ║     CAMFRANGLAIS       ║  │ //         ndem"       │ │
│  ║                        ║  │                        │ │
│  ║  The first Recursive   ║  │ { type: DET, val: "Le"}│ │
│  ║  Descent Compiler for  ║  │ { type: SLANG,         │ │
│  ║  Cameroonian urban     ║  │   val: "pater" }       │ │
│  ║  vernaculars.          ║  │ { type: VERB,          │ │
│  ║                        ║  │   val: "a" }           │ │
│  ║  [ACCESS TERMINAL]     ║  │ { type: ADJ,           │ │
│  ║  [DOCUMENTATION]       ║  │   val: "ndem" }        │ │
│  ╚════════════════════════╝  └────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Analyzer Console

```
┌─────────────────────────────────────────────────────────┐
│  Mode: [LEXICAL] [SYNTACTIC]                            │
├─────────────────────────────────────────────────────────┤
│  > Massa, le gars ci a tchop le fey                     │
│                                                         │
│                         [⚡ ANALYZE]                     │
├─────────────────────────────────────────────────────────┤
│  ● LIVE_TREE_VIEW                                       │
│                                                         │
│                    ┌──┐                                  │
│                    │ S│                                  │
│                ┌───┴──┴───┐                              │
│              ┌─┤          ├─┐                            │
│            ┌──┐          ┌──┐                            │
│            │NP│          │VP│                            │
│            └┬─┘          └┬─┘                            │
│         ┌──┴──┐       ┌──┴──┐                           │
│       ┌─┐   ┌─┐    ┌─┐   ┌─┐                           │
│       │D│   │N│    │V│   │NP│                           │
│       └─┘   └─┘    └─┘   └┬┘                           │
│       "le" "gars" "tchop" ...                           │
│                                                         │
│                          [−] [100%] [+] [↔]            │
└─────────────────────────────────────────────────────────┘
```

---

## 🏗️ Architecture

KmerLex follows **Clean Architecture** principles — the compiler core has zero dependencies on the web framework.

```
┌───────────────────────────────────────────────────────────────────┐
│                        PRESENTATION LAYER                         │
│  ┌──────────────────────────────┐  ┌──────────────────────────┐  │
│  │   React + TypeScript IDE     │  │    Flask REST API         │  │
│  │   (Vite, Tailwind, Motion)   │  │    (web/backend/)         │  │
│  └──────────────┬───────────────┘  └─────────────┬────────────┘  │
├─────────────────┼───────────────────────────────── ┼───────────────┤
│                 │     APPLICATION LAYER            │               │
│                 │  ┌──────────────────────────┐   │               │
│                 └──│    SyntaxAnalyzer        │───┘               │
│                    └─────────┬────────────────┘                   │
├──────────────────────────────┼─────────────────────────────────────┤
│                     DOMAIN LAYER                                   │
│  ┌──────────────────┐  ┌────┴────┐  ┌──────────────────────────┐ │
│  │  Ports (Ilexer,  │  │  Token  │  │   AST Nodes              │ │
│  │  Iparser)        │  │  Types  │  │   (Program, Sentence...) │ │
│  └───────┬──────────┘  └─────────┘  └──────────────────────────┘ │
├──────────┼────────────────────────────────────────────────────────┤
│          │         ADAPTER LAYER                                  │
│  ┌───────┴──────────┐  ┌──────────────────────────────────────┐  │
│  │  CamfranglaisLexer│  │  CamfranglaisParser                 │  │
│  │  (Regex-based)    │  │  (Recursive Descent)                │  │
│  └───────────────────┘  └──────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────────────┘
```

---

## 🗂️ Project Structure

```
KmerLex/
├── internal/                    # 🧠 Core compiler logic (Python)
│   ├── core/
│   │   ├── domain/
│   │   │   ├── tokens.py        # Token & TokenType definitions
│   │   │   ├── ast_nodes.py     # AST node classes
│   │   │   └── errors.py        # Custom compiler errors
│   │   ├── ports/
│   │   │   ├── Ilexer.py        # Lexer interface (contract)
│   │   │   └── Iparser.py       # Parser interface (contract)
│   │   └── services/
│   │       └── analyze_syntax.py # Orchestrator service
│   └── adapters/
│       ├── regex_lexer.py       # Regex-based tokenizer
│       └── recursive_descent.py # Recursive descent parser
│
├── web/
│   ├── backend/                 # 🌐 Flask REST API
│   │   ├── app.py               # App factory + SPA serving
│   │   ├── routes.py            # API endpoints
│   │   └── serializers.py       # JSON serialization helpers
│   └── frontend/                # 🎨 React + TypeScript IDE
│       └── src/
│           ├── core/engine/     # Client-side lexer & parser
│           ├── features/        # Pages (Home, Analyzer)
│           ├── components/      # Reusable UI components
│           └── services/        # API client
│
├── tests/                       # 🧪 Test suite (155+ tests)
├── grammar/                     # 📐 BNF grammar definitions
├── data/                        # 📚 Sample sentence corpus
├── docs/                        # 📘 Documentation
│
├── Dockerfile                   # 🐳 Multi-stage build
├── Makefile                     # ⚙️ Development commands
├── .github/workflows/
│   ├── ci.yml                   # CI pipeline
│   └── release.yml              # GHCR release pipeline
└── requirements.txt             # Python dependencies
```

---

## 🚀 Quick Start

### Prerequisites

| Tool | Version | Purpose |
|------|---------|---------|
| Python | ≥ 3.10 | Backend & compiler engine |
| Node.js | ≥ 22 | Frontend build |
| Docker | Latest | Containerized deployment |

### Option 1: Docker (Recommended)

```bash
docker build -t kmerlex .
docker run -p 5000:5000 kmerlex
```

Open [http://localhost:5000](http://localhost:5000).

### Option 2: Local Development

```bash
git clone https://github.com/MiltonJ23/KmerLex.git
cd KmerLex
make install    # Install Python + Node.js dependencies
make build      # Build the frontend
make run        # Start the server
```

### Option 3: Pull from GHCR

```bash
docker pull ghcr.io/miltonj23/kmerlex:latest
docker run -p 5000:5000 ghcr.io/miltonj23/kmerlex:latest
```

### All Makefile Commands

```bash
make help         # Show all available commands
make install      # Install all dependencies
make test         # Run all 155+ tests
make lint         # Lint TypeScript
make build        # Build the frontend
make run          # Start the dev server
make docker-build # Build Docker image
make docker-run   # Run Docker container
make clean        # Remove build artifacts
```

---

## 🔤 How It Works

### Step 1: Lexical Analysis (Tokenization)

The **lexer** reads a Camfranglais sentence and breaks it into tokens:

```
Input:  "Massa, le gars ci a tchop le fey"

Output: [
  { type: TK_INTERJECTION, value: "Massa",  line: 1, col: 1  },
  { type: TK_VIRGULE,      value: ",",      line: 1, col: 6  },
  { type: TK_DETERMINANT,  value: "le",     line: 1, col: 8  },
  { type: TK_NOM,          value: "gars",   line: 1, col: 11 },
  { type: TK_DEMONSTRATIF, value: "ci",     line: 1, col: 16 },
  { type: TK_AUXILIAIRE,   value: "a",      line: 1, col: 19 },
  { type: TK_VERBE,        value: "tchop",  line: 1, col: 21 },
  { type: TK_DETERMINANT,  value: "le",     line: 1, col: 27 },
  { type: TK_NOM,          value: "fey",    line: 1, col: 30 },
  { type: EPSILON }
]
```

### Step 2: Syntactic Analysis (Parsing)

The **parser** uses a **recursive descent algorithm** to build an Abstract Syntax Tree:

```
                    Program
                       │
                   Sentence
                  /    |    \
         Interjection  │    (end)
         "Massa"       │
                  Declarative
                  /     |     \
              Subject  Verb   Complement
                |    Group      |
           NominalGroup  |   NominalGroup
           /    |    \   |    /      \
         Det  Nom  Dem  Aux+V  Det    Nom
         "le" "gars" "ci" "a tchop" "le" "fey"
```

### Token Types

| Token | Description | Examples |
|-------|------------|----------|
| `TK_VERBE` | Verb | tchop, wanda, sleep, quitte |
| `TK_AUXILIAIRE` | Auxiliary | a, va, as, faut, ont |
| `TK_NOM` | Noun | route, gars, fey, gouvernement |
| `TK_PRONOM_SUJET` | Subject Pronoun | je, tu, il, on, elle |
| `TK_PRONOM_OBJET` | Object Pronoun | me, moi, toi, lui |
| `TK_DETERMINANT` | Determiner | le, la, les, un, une |
| `TK_INTERJECTION` | Interjection | massa, mboutman, hein |
| `TK_NEGATION` | Negation | ne, pas, n' |
| `TK_CEST` | C'est | c'est |
| `TK_PREPOSITION` | Preposition | pour, sur, avec, de |
| `TK_DEMONSTRATIF` | Demonstrative | ci, la |
| `TK_NOMBRE` | Number | 1000, 200 |
| `TK_OPERATEUR` | Operator | plus |
| `TK_INTERROGATIF` | Interrogative | comment, combien |

---

## 🧪 Testing

The project has **155+ tests** across 8 test files:

```bash
make test                           # Run all tests
pytest --cov=. --cov-report=term    # Run with coverage
```

| Test File | Tests | What It Tests |
|-----------|-------|---------------|
| `test_lexer.py` | 4 | Basic tokenization, line tracking, errors |
| `test_lexer_extended.py` | 88 | All token types, case insensitivity, edge cases |
| `test_parser.py` | 5 | Imperative/declarative, recursive groups |
| `test_parser_extended.py` | 28 | Complex structures, interjections, verb groups |
| `test_analyzer.py` | 2 | Sync and async analysis |
| `test_errors.py` | 2 | Error pretty-printing |
| `test_backend.py` | 16 | Flask API endpoints, validation, errors |
| `test_serializers.py` | 10 | Token/AST JSON serialization |

CI enforces a **minimum 90% coverage** threshold.

---

## 📡 API Reference

### Health Check

```http
GET /api/health
```

```json
{ "success": true, "data": { "status": "healthy", "service": "kmerlex-api" } }
```

### Tokenize

```http
POST /api/tokenize
Content-Type: application/json

{ "source": "Je wanda" }
```

```json
{
  "success": true,
  "data": {
    "tokens": [
      { "value": "Je", "type": "TK_PRONOM_SUJET", "line": 1, "column": 1 },
      { "value": "wanda", "type": "TK_VERBE", "line": 1, "column": 4 },
      { "value": "", "type": "EPSILON", "line": 1, "column": 9 }
    ]
  }
}
```

### Analyze (Syntactic)

```http
POST /api/analyze
Content-Type: application/json

{ "source": "La route ci c'est le fey", "mode": "syntactic" }
```

Returns the full AST tree as JSON.

### Analyze (Lexical)

```http
POST /api/analyze
Content-Type: application/json

{ "source": "Je wanda", "mode": "lexical" }
```

Returns the token list (same as `/api/tokenize`).

---

## 🐳 Docker & Deployment

### Multi-Stage Build

The Dockerfile uses a **two-stage build**:
1. **Stage 1** (`node:22-alpine`): Builds the React frontend → static files
2. **Stage 2** (`python:3.12-slim`): Runs Flask + serves the frontend on port 5000

### Pull from GitHub Container Registry

```bash
docker pull ghcr.io/miltonj23/kmerlex:latest
docker run -p 5000:5000 ghcr.io/miltonj23/kmerlex:latest
```

---

## 🛠️ CI/CD Pipeline

### Continuous Integration (`ci.yml`)

Runs on every push/PR to `main`:

| Job | Description |
|-----|-------------|
| **Python Tests** | Matrix: 3.10, 3.11, 3.12 — flake8 lint + pytest with 90% coverage |
| **Frontend Build** | Node 22 — ESLint + Vite production build |
| **Docker Build** | Validates the Dockerfile builds successfully |

### Release (`release.yml`)

Triggered by version tags (`v*`):

```
Tag v1.0.0 → Build → Push to ghcr.io/miltonj23/kmerlex → GitHub Release
```

---

## 📐 Grammar (BNF)

```bnf
<Program>       ::= <Sentence>+
<Sentence>      ::= [<Interjection>] [","] <Proposition> [<Interjection>] [<Punctuation>]
<Proposition>   ::= <Imperative> | <Declarative>
<Imperative>    ::= <VerbGroup> <Complement>
<Declarative>   ::= <NominalGroup> (<VerbGroup> | "c'est") <Complement> [<Interrogative>]
<NominalGroup>  ::= <Determinant> <Nom> [<Demonstratif>] [<Preposition> <NominalGroup>]
                   | <Nom> | <PronomSujet> | <Nombre> [<Operateur> <Nombre>]
<VerbGroup>     ::= [<Negation>] [<PronomObjet>] [<Auxiliaire>] <Verbe>
<Complement>    ::= <Preposition> <NominalGroup> | <NominalGroup> | ε
```

See [`grammar/`](grammar/) for the full specification.

---

## 📚 Sample Corpus

### Camfranglais

| Sentence | English Meaning |
|----------|----------------|
| *"Le taxi est full, on va sat à trois derrière ?"* | The taxi is full, will we sit three in the back? |
| *"Le prof de réseau a tchop les nerfs aujourd'hui."* | The networking professor was annoying today. |
| *"Les Lions ont win le match, tout le bled est en joie."* | The Lions won the match, the whole country is celebrating. |

### Pidgin

| Sentence | English Meaning |
|----------|----------------|
| *"Man no rest, we must hustle for chop."* | One can't rest, we must hustle for food. |
| *"This sun dey hot too much."* | The sun is too hot. |
| *"I don tire for waka, my leg dey pain me."* | I'm tired of walking, my legs hurt. |

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Write tests for your changes
4. Ensure all tests pass (`make test`)
5. Push and open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

<div align="center">
  <sub>Built with ❤️ for the languages of Cameroon</sub>
  <br/>
  <sub>🇨🇲 <strong>KmerLex</strong> — Where Formal Language Theory Meets the Street</sub>
</div>

.PHONY: help install test lint build run docker-build docker-run clean

IMAGE_NAME ?= kmerlex
CONTAINER_NAME ?= kmerlex-app

help: ## Show this help
@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2}'

install: ## Install all dependencies
pip install -r requirements.txt
cd web/frontend && npm ci

test: ## Run all tests
python -m pytest tests/ -v

lint: ## Lint Python and frontend
cd web/frontend && npm run lint

build: ## Build frontend
cd web/frontend && npm run build

run: ## Run the Flask dev server
FLASK_APP=web.backend.app python -m flask run --host=0.0.0.0 --port=5000

docker-build: ## Build Docker image
docker build -t $(IMAGE_NAME) .

docker-run: ## Run Docker container
docker run --rm -p 5000:5000 --name $(CONTAINER_NAME) $(IMAGE_NAME)

clean: ## Remove build artifacts
rm -rf web/frontend/dist web/frontend/node_modules
find . -type d -name __pycache__ -exec rm -rf {} + 2>/dev/null || true
find . -type d -name .pytest_cache -exec rm -rf {} + 2>/dev/null || true

# ── Stage 1: Build the React frontend ────────────────────────────────
FROM node:22-alpine AS frontend-build

WORKDIR /app/frontend

COPY web/frontend/package.json web/frontend/package-lock.json ./
RUN npm ci

COPY web/frontend/ ./
RUN npm run build


# ── Stage 2: Production image ────────────────────────────────────────
FROM python:3.12-slim AS production

LABEL org.opencontainers.image.source="https://github.com/MiltonJ23/KmerLex"
LABEL org.opencontainers.image.description="KmerLex - Camfranglais & Pidgin Compiler"
LABEL org.opencontainers.image.licenses="MIT"

ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV FLASK_APP=web.backend.app

WORKDIR /app

COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt

COPY internal/ ./internal/
COPY web/backend/ ./web/backend/
COPY web/__init__.py ./web/__init__.py
COPY data/ ./data/
COPY grammar/ ./grammar/

COPY --from=frontend-build /app/frontend/dist ./web/frontend/dist

EXPOSE 5000

CMD ["python", "-m", "flask", "run", "--host=0.0.0.0", "--port=5000"]

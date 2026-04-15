"""Tests for the Flask backend API endpoints."""
import pytest
from web.backend.app import create_app


@pytest.fixture
def client():
    app = create_app()
    app.config["TESTING"] = True
    with app.test_client() as c:
        yield c


class TestHealth:
    def test_health_ok(self, client):
        resp = client.get("/api/health")
        assert resp.status_code == 200
        data = resp.get_json()
        assert data["success"] is True
        assert data["data"]["status"] == "healthy"


class TestTokenize:
    def test_tokenize_valid(self, client):
        resp = client.post("/api/tokenize", json={"source": "Je wanda"})
        assert resp.status_code == 200
        data = resp.get_json()
        assert data["success"] is True
        tokens = data["data"]["tokens"]
        assert len(tokens) >= 3

    def test_tokenize_missing_source(self, client):
        resp = client.post("/api/tokenize", json={})
        data = resp.get_json()
        assert "error" in data

    def test_tokenize_invalid_char(self, client):
        resp = client.post("/api/tokenize", json={"source": "Je #"})
        data = resp.get_json()
        assert "error" in data

    def test_tokenize_no_json(self, client):
        resp = client.post("/api/tokenize")
        data = resp.get_json()
        assert "error" in data


class TestAnalyze:
    def test_analyze_syntactic(self, client):
        resp = client.post("/api/analyze", json={
            "source": "Je wanda",
            "mode": "syntactic",
        })
        assert resp.status_code == 200
        data = resp.get_json()
        assert data["success"] is True
        assert "ast" in data["data"]

    def test_analyze_lexical(self, client):
        resp = client.post("/api/analyze", json={
            "source": "Je wanda",
            "mode": "lexical",
        })
        assert resp.status_code == 200
        data = resp.get_json()
        assert "tokens" in data["data"]

    def test_analyze_default_mode(self, client):
        resp = client.post("/api/analyze", json={"source": "Je wanda"})
        data = resp.get_json()
        assert data["success"] is True
        assert "ast" in data["data"]

    def test_analyze_invalid_mode(self, client):
        resp = client.post("/api/analyze", json={
            "source": "Je wanda",
            "mode": "invalid",
        })
        data = resp.get_json()
        assert "error" in data

    def test_analyze_syntax_error(self, client):
        resp = client.post("/api/analyze", json={
            "source": "Je 1000",
            "mode": "syntactic",
        })
        data = resp.get_json()
        assert "error" in data
        assert data["error"]["type"] == "SyntaxError"

    def test_analyze_missing_source(self, client):
        resp = client.post("/api/analyze", json={})
        data = resp.get_json()
        assert "error" in data

    def test_source_must_be_string(self, client):
        resp = client.post("/api/analyze", json={"source": 123})
        data = resp.get_json()
        assert "error" in data


class TestNotFound:
    def test_api_404(self, client):
        resp = client.get("/api/nonexistent")
        assert resp.status_code == 404

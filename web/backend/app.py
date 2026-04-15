"""Flask application factory for the KmerLex API.

Creates a Flask application with CORS support, JSON error handlers,
the API blueprint, and SPA static-file serving.
"""

import os

from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
from werkzeug.utils import safe_join

from web.backend.routes import api

_FRONTEND_DIST = os.path.join(
    os.path.dirname(__file__), "..", "frontend", "dist"
)


def create_app():
    """Create and configure the Flask application."""
    app = Flask(
        __name__,
        static_folder=os.path.abspath(_FRONTEND_DIST),
        static_url_path="",
    )

    allowed_origins = app.config.get("CORS_ORIGINS", "*")
    CORS(app, resources={r"/api/*": {"origins": allowed_origins}})

    app.register_blueprint(api)

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def serve_frontend(path):
        """Serve the React SPA for non-API routes."""
        dist = app.static_folder
        if dist and path:
            safe_path = safe_join(dist, path)
            if safe_path and os.path.isfile(safe_path):
                return send_from_directory(dist, path)
        if dist and os.path.isfile(os.path.join(dist, "index.html")):
            return send_from_directory(dist, "index.html")
        return jsonify({"error": {"message": "Frontend not built.", "type": "NotFound"}}), 404

    @app.errorhandler(400)
    def bad_request(exc):
        return jsonify({"error": {"message": "Bad request.", "type": "BadRequest"}}), 400

    @app.errorhandler(404)
    def not_found(exc):
        if request.path.startswith("/api/"):
            return jsonify({"error": {"message": "Not found.", "type": "NotFound"}}), 404
        dist = app.static_folder
        if dist and os.path.isfile(os.path.join(dist, "index.html")):
            return send_from_directory(dist, "index.html")
        return jsonify({"error": {"message": "Not found.", "type": "NotFound"}}), 404

    @app.errorhandler(500)
    def internal_error(exc):
        return jsonify({"error": {"message": "Internal server error.", "type": "InternalServerError"}}), 500

    return app

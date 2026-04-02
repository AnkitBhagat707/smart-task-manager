from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models import db
from routes.auth import auth_bp
from routes.task import task_bp


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # enable CORS
    CORS(app)

    # init DB
    db.init_app(app)

    # init JWT
    JWTManager(app)

    # register routes
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(task_bp, url_prefix='/api/tasks')

    @app.route('/')
    def home():
        return "Backend secure & running 🚀"

    with app.app_context():
        db.create_all()

    return app


app = create_app()

if __name__ == "__main__":
    app.run(debug=True)
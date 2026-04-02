from flask import Blueprint, request
from flask_jwt_extended import create_access_token
from models import db, User

auth_bp = Blueprint('auth', __name__)


@auth_bp.route('/signup', methods=['POST'])
def signup():
    data = request.json

    username = data.get('username')
    password = data.get('password')

    existing_user = User.query.filter_by(username=username).first()
    if existing_user:
        return {"msg": "User already exists"}, 400

    new_user = User(username=username, password=password)

    db.session.add(new_user)
    db.session.commit()

    return {"msg": "User created successfully"}


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json

    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if not user or user.password != password:
        return {"msg": "Invalid credentials"}, 401

    token = create_access_token(identity=str(user.id))

    return {
        "msg": "Login successful",
        "token": token
    }
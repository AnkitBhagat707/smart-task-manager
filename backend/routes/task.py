from flask import Blueprint, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Task
from utils.priority import suggest_priority

task_bp = Blueprint('task', __name__)


# CREATE TASK
@task_bp.route('/create', methods=['POST'])
@jwt_required()
def create_task():
    data = request.json

    title = data.get('title')

    if not title:
        return {"msg": "Title required"}, 400

    user_id = get_jwt_identity()

    priority = suggest_priority(title)

    task = Task(
        title=title,
        status="pending",
        priority=priority,
        user_id=user_id
    )

    db.session.add(task)
    db.session.commit()

    return {"msg": "Task created", "priority": priority}


# GET TASKS
@task_bp.route('/all', methods=['GET'])
@jwt_required()
def get_tasks():
    user_id = get_jwt_identity()

    tasks = Task.query.filter_by(user_id=user_id).all()

    result = []
    for t in tasks:
        result.append({
            "id": t.id,
            "title": t.title,
            "status": t.status,
            "priority": t.priority
        })

    return {"tasks": result}


# UPDATE TASK
@task_bp.route('/update/<int:id>', methods=['PUT'])
@jwt_required()
def update_task(id):
    data = request.json

    task = Task.query.get(id)

    if not task:
        return {"msg": "Task not found"}, 404

    task.status = data.get('status', task.status)

    db.session.commit()

    return {"msg": "Task updated"}


# DELETE TASK
@task_bp.route('/delete/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_task(id):
    task = Task.query.get(id)

    if not task:
        return {"msg": "Task not found"}, 404

    db.session.delete(task)
    db.session.commit()

    return {"msg": "Task deleted"}
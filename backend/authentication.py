from flask import jsonify
import re
import bcrypt
import os
import dotenv
import jwt
from datetime import timedelta, datetime, timezone

dotenv.load_dotenv()

def register_user(db, request):
	if 'email' not in request.form or 'password' not in request.form or 'password_confirmation' not in request.form:
		return jsonify({"error": "Email, senha e confirmação de senha são obrigatórios"}), 400

	email = request.form['email']
	password = request.form['password']
	password_confirmation = request.form['password_confirmation']

	if not is_valid_email(email):
		return jsonify({"error": "Email inválido"}), 400

	if password != password_confirmation:
		return jsonify({"error": "As senhas não conferem"}), 400

	if db.users.find_one({"email": email}):
		return jsonify({"error": "Email já cadastrado no sistema"}), 409

	hashed_password = hash_password(password)

	user_id = db.users.insert_one({"email": email, "password": hashed_password}).inserted_id

	return jsonify({"user_id": str(user_id)}), 201

def login_user(db, request):
	if 'email' not in request.form or 'password' not in request.form:
		return jsonify({"error": "Informe o email e a senha"}), 400

	email = request.form['email']
	password = request.form['password']

	user = db.users.find_one({"email": email})

	if not user or not check_password_hash(user["password"], password):
		return jsonify({"error": "Email ou senha incorretos"}), 401

	access_token = create_access_token(str(user["_id"]))

	return jsonify({"access_token": access_token}), 200

def is_valid_email(email):
	email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
	return re.match(email_regex, email) is not None

def hash_password(password):
	return bcrypt.hashpw(password.encode('utf-8'), bytes(os.getenv('PASSWORD_SALT'), encoding='utf-8'))

def check_password_hash(hashedPasword, password):
	userPass = hash_password(password)
	return hashedPasword == userPass

def create_access_token(user_id):
	payload = {
		'user_id': user_id,
		'exp': datetime.now(timezone.utc) + timedelta(seconds=86400)
	}
	token = jwt.encode(payload, os.getenv('JWT_SECRET'), os.getenv('JWT_ENCRYPTION_ALG'))
	return token

def get_user_id(token):
	user_data = jwt.decode(token, os.getenv('JWT_SECRET'), os.getenv('JWT_ENCRYPTION_ALG'))
	return user_data.get('user_id')

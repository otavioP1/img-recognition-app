from flask import jsonify
import re
import bcrypt

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

	hashed_password = bcrypt.hashpw(password.encode('utf-8'), b'$2b$12$Zls1.GYUNUX.E4ChaKNIVe')

	user_id = db.users.insert_one({"email": email, "password": hashed_password}).inserted_id

	return jsonify({"user_id": str(user_id)}), 201

def is_valid_email(email):
	email_regex = r'^[\w\.-]+@[\w\.-]+\.\w+$'
	return re.match(email_regex, email) is not None
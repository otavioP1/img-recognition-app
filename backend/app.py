from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import dotenv
from pymongo import MongoClient
from image_analysis import analyse_image, get_upload_history
from authentication import register_user, login_user

dotenv.load_dotenv()

app = Flask(__name__, static_folder='../frontend', static_url_path='/')
CORS(app)

try:
	client = MongoClient(host=os.getenv('MONGODB_HOST'), port=int(os.getenv('MONGODB_PORT')))
	db = client.img_recognition
except:
	print('Falha de conexão com o DB')

@app.route('/analyse', methods=['POST'])
def analyse_image_route():
	return analyse_image(db, request)

@app.route('/history', methods=['GET'])
def get_history_route():
	return get_upload_history(db, request)

@app.route('/register', methods=['POST'])
def register_route():
	return register_user(db, request)

@app.route('/login', methods=['POST'])
def login_route():
	return login_user(db, request)

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=5000, debug=True)

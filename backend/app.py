from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from image_analysis import analyse_image
from authentication import register_user

app = Flask(__name__, static_folder='../frontend', static_url_path='/')
CORS(app)

try:
	client = MongoClient(host="host.docker.internal", port=27017)
	db = client.img_recognition
except:
	print('Falha de conexão com o DB')

@app.route('/analyse', methods=['POST'])
def analyse_image_route():
	return analyse_image(request)


@app.route('/register', methods=['POST'])
def register_route():
	return register_user(db, request)

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=5000, debug=True)

from flask import Flask, request, jsonify
from flask_cors import CORS
from image_analysis import describe_image, detect_objects

app = Flask(__name__, static_folder='../frontend', static_url_path='/')
CORS(app)

@app.route('/describe', methods=['POST'])
def describe_image_route():
	return describe_image(request)

@app.route('/detect', methods=['POST'])
def detect_objects_route():
	return detect_objects(request)

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=5000, debug=True)

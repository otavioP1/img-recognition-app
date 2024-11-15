from flask import Flask, request, jsonify
from flask_cors import CORS
from image_analysis import analyse_image

app = Flask(__name__, static_folder='../frontend', static_url_path='/')
CORS(app)

@app.route('/analyse', methods=['POST'])
def analyse_image_route():
	return analyse_image(request)

if __name__ == '__main__':
	app.run(host='0.0.0.0', port=5000, debug=True)

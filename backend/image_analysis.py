import os
import cv2
import numpy as np
from flask import jsonify
from transformers import BlipProcessor, BlipForConditionalGeneration
from deep_translator import GoogleTranslator

MODEL_DIR = "model"
CONFIG_PATH = os.path.join(MODEL_DIR, "yolov3.cfg")
WEIGHTS_PATH = os.path.join(MODEL_DIR, "yolov3.weights")
NAMES_PATH = os.path.join(MODEL_DIR, "coco.names")

with open(NAMES_PATH, 'r') as f:
	classes = [line.strip() for line in f.readlines()]

net = cv2.dnn.readNetFromDarknet(CONFIG_PATH, WEIGHTS_PATH)
net.setPreferableBackend(cv2.dnn.DNN_BACKEND_OPENCV)

layer_names = net.getLayerNames()
output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers()]

CONF_THRESHOLD = 0.5
NMS_THRESHOLD = 0.4

processor = BlipProcessor.from_pretrained("Salesforce/blip-image-captioning-base")
model = BlipForConditionalGeneration.from_pretrained("Salesforce/blip-image-captioning-base")

def describe_image(request):
	if 'image' not in request.files:
		return jsonify({"error": "Nenhuma imagem enviada"}), 400

	file = request.files['image']

	img_array = np.frombuffer(file.read(), np.uint8)
	img = cv2.imdecode(img_array, cv2.IMREAD_COLOR)

	if img is None:
		return jsonify({"error": "Imagem inválida"}), 400

	img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
	inputs = processor(images=img, return_tensors="pt")

	outputs = model.generate(**inputs)
	description = processor.decode(outputs[0], skip_special_tokens=True)

	translated_description = GoogleTranslator(source='auto', target='pt').translate(description)

	return jsonify({"description": translated_description}), 200

def detect_objects(request):
	if 'image' not in request.files:
		return jsonify({"error": "Nenhuma imagem enviada"}), 400

	file = request.files['image']

	file_bytes = np.frombuffer(file.read(), np.uint8)
	img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)

	if img is None:
		return jsonify({"error": "Imagem inválida"}), 400

	height, width, channels = img.shape

	blob = cv2.dnn.blobFromImage(img,
								scalefactor=1/255.0,
								size=(416, 416),
								swapRB=True,
								crop=False)
	net.setInput(blob)
	outputs = net.forward(output_layers)

	class_ids = []
	confidences = []
	boxes = []

	for output in outputs:
		for detection in output:
			scores = detection[5:]
			class_id = np.argmax(scores)
			confidence = scores[class_id]
			if confidence > CONF_THRESHOLD:
				center_x = int(detection[0] * width)
				center_y = int(detection[1] * height)
				w = int(detection[2] * width)
				h = int(detection[3] * height)

				x = int(center_x - w / 2)
				y = int(center_y - h / 2)

				boxes.append([x, y, w, h])
				confidences.append(float(confidence))
				class_ids.append(class_id)

	indexes = cv2.dnn.NMSBoxes(boxes, confidences, CONF_THRESHOLD, NMS_THRESHOLD)

	detected_objects = []

	if len(indexes) > 0:
		for i in indexes.flatten():
			obj = {
				"name": GoogleTranslator(source='auto', target='pt').translate(classes[class_ids[i]]),
				"x": boxes[i][0],
				"y": boxes[i][1],
				"width": boxes[i][2],
				"height": boxes[i][3],
				"score": confidences[i]
			}
			detected_objects.append(obj)

	return jsonify(detected_objects)
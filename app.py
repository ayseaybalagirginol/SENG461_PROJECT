from flask import Flask, request, jsonify, render_template
from deepface import DeepFace
import cv2
import numpy as np

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    npimg = np.frombuffer(file.read(), np.uint8)
    img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

    try:
        result = DeepFace.analyze(img_path=img, actions=['emotion'], enforce_detection=False)
        
        # If multiple faces, pick the first one
        if isinstance(result, list):
            result = result[0]

        dominant_emotion = result.get('dominant_emotion', 'unknown')

    except Exception as e:
        return jsonify({'error': str(e)}), 500

    # Return only the dominant emotion as a string
    return jsonify({'dominant_emotion': dominant_emotion})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)
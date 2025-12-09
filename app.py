from flask import Flask, request, jsonify, render_template
from deepface import DeepFace
import cv2
import numpy as np

app = Flask(__name__)


# Specify RetinaFace as the desired face detection backend 
DETECTOR_BACKEND = 'retinaface' 


@app.route('/')
def home():
    #Renders the main HTML page for file uploads.
    
    return render_template('index.html')


@app.route('/predict', methods=['POST'])
def predict():
    
    #Analyzes the emotion in an uploaded image using the RetinaFace detector backend. 
    
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400

    file = request.files['file']
    
    try:
        # Read the image file into a NumPy array and decode it
        npimg = np.frombuffer(file.read(), np.uint8)
        img = cv2.imdecode(npimg, cv2.IMREAD_COLOR)

        if img is None:
            return jsonify({'error': 'Could not decode image file.'}), 400

        # Perform facial analysis, specifying the RetinaFace detector backend
        result = DeepFace.analyze(
            img_path=img, 
            actions=['emotion'], 
            detector_backend=DETECTOR_BACKEND,  
            enforce_detection=False 
        )
        
        # DeepFace returns a list if multiple faces are detected. We analyze the first one.
        if isinstance(result, list) and result:
            result = result[0]
        elif not result:
             return jsonify({'dominant_emotion': 'No face detected'}), 200

        dominant_emotion = result.get('dominant_emotion', 'unknown')

    except Exception as e:
        # Log the full error for internal debugging
        print(f"DeepFace analysis error: {e}") 
        return jsonify({'error': f'Analysis failed. Detail: {str(e)}'}), 500

    # Return only the dominant emotion
    return jsonify({'dominant_emotion': dominant_emotion})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8000, debug=True)

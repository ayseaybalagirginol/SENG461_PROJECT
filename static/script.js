//  to display the selected image and handle drag-and-drop
const dropArea = document.getElementById('dropArea');
const fileInput = document.getElementById('fileInput');
const previewImage = document.getElementById('previewImage');

let selectedFile;  // Store the selected file

// Prevent default drag behaviors
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
});

function preventDefaults (e) {
  e.preventDefault()
  e.stopPropagation()
}

// Highlight
['dragenter', 'dragover'].forEach(eventName => {
  dropArea.addEventListener(eventName, highlight, false)
});

['dragleave', 'drop'].forEach(eventName => {
  dropArea.addEventListener(eventName, unhighlight, false)
});

function highlight(e) {
  dropArea.classList.add('highlight')
}

function unhighlight(e) {
  dropArea.classList.remove('highlight')
}

// Handle dropped files
dropArea.addEventListener('drop', handleDrop, false);

function handleDrop(e) {
  let dt = e.dataTransfer
  let files = dt.files

  handleFiles(files)
}

function handleFiles(files) {
    // Only process the first file if multiple files are dropped
    const file = files[0];

    if (file && file.type.startsWith('image/')) {
        displayImage(file);
        selectedFile = file; // Store the selected file
    } else {
        alert('Please drop an image file.');
    }
}

// Handle file change
fileInput.addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        displayImage(file);
        selectedFile = file;  // Store the selected file
    }
});

function displayImage(file) {
    const reader = new FileReader();
    reader.onload = function(e) {
        previewImage.src = e.target.result;
        previewImage.style.display = 'block';
    }
    reader.readAsDataURL(file);
}


async function upload() {
    const resultElement = document.getElementById('result'); // Get the result element

    if (!selectedFile) {
        alert('Please select an image.');
        return;
    }

    // Only show "Waiting for prediction..." if an image has been selected
    resultElement.textContent = 'Waiting for prediction...';

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
        const resp = await fetch('/predict', {
            method: 'POST',
            body: formData
        });

        const data = await resp.json();

        if (data.dominant_emotion) {
            resultElement.textContent = `The face in the image is ${data.dominant_emotion}.`;
             
            updateEmoji(data.dominant_emotion);

        } else {
            resultElement.textContent = `Error: ${data.error || 'Unknown error'}`;
                 document.getElementById('emojiDisplay').textContent = ''; // Clear emoji on error
        }
    } catch (error) {
        console.error('Error:', error);
        resultElement.textContent = 'Error during prediction.';
        document.getElementById('emojiDisplay').textContent = ''; // Clear emoji on error

    }
}

function updateEmoji(emotion) {
    const emojiDisplay = document.getElementById('emojiDisplay');
    switch (emotion.toLowerCase()) {
        case 'happy':
            emojiDisplay.textContent = '😊';
            break;
        case 'sad':
            emojiDisplay.textContent = '😢';
            break;
        case 'angry':
            emojiDisplay.textContent = '😠';
            break;
        case 'neutral':
            emojiDisplay.textContent = '😐';
            break;
        case 'fear':
            emojiDisplay.textContent = '😨';
            break;
        case 'surprise':
            emojiDisplay.textContent = '😲';
            break;
        case 'disgust':
            emojiDisplay.textContent = '🤢';
            break;
        default:
            emojiDisplay.textContent = '';
            break;
    }
}

        /**async function upload() {
            const input = document.getElementById('fileInput');
            if (!input.files[0]) {
                alert('Please select an image.');
                return;
            }
            const formData = new FormData();
            formData.append('file', input.files[0]);

            const resp = await fetch('/predict', {
                method: 'POST',
                body: formData
            });

            const data = await resp.json();
            document.getElementById('result').textContent = JSON.stringify(data, null, 2);
        }**/
       

     async function upload() {
         const input = document.getElementById('fileInput');
         if (!input.files[0]) {
             alert('Please select an image.');
              return;
            
            }
         const formData = new FormData();
         formData.append('file', input.files[0]);

         const resp = await fetch('/predict', {
             method: 'POST',
             body: formData
           });

         const data = await resp.json();
    
         if(data.dominant_emotion) {
             document.getElementById('result').textContent = 
              `The face in the image is ${data.dominant_emotion}.`;
           } else {
             document.getElementById('result').textContent = 
               `Error: ${data.error || 'Unknown error'}`;
            }
}
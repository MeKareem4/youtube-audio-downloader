document.getElementById('convertBtn').addEventListener('click', function() {
  const videoUrl = document.getElementById('videoUrl').value;
  const message = document.getElementById('message');

  if (!videoUrl) {
      message.textContent = 'Please enter a valid YouTube URL!';
      return;
  }

  message.textContent = 'Processing...';

  fetch('http://localhost:3000/convert', {
      method: 'POST',
      body: JSON.stringify({ url: videoUrl }),
      headers: {
          'Content-Type': 'application/json'
      }
  })
  .then(response => {
      if (response.ok) {
          return response.blob().then(blob => {
              const url = window.URL.createObjectURL(blob);
              const a = document.createElement('a');
              a.style.display = 'none';
              a.href = url;
              a.download = 'converted.mp3';
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
              message.textContent = 'Your MP3 is ready!';
          });
      } else {
          throw new Error('Conversion failed');
      }
  })
  .catch(error => {
      message.textContent = error.message;
  });
});
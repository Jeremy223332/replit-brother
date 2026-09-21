<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Status Indicator</title>
  <style>
    /* ... CSS goes here ... */
  </style>
</head>
<body>

  <div class="status-container">
    <div class="spinner"></div>
    <span id="status-text">Ready</span>
  </div>

  <!-- JavaScript goes right here inside <script> tags -->
  <script>
    const statusText = document.getElementById('status-text');
    const spinner = document.querySelector('.spinner');

    function setStatus(message, isLoading = true) {
      statusText.textContent = message;
      spinner.style.display = isLoading ? 'inline-block' : 'none';
    }

    async function handleFileCreation() {
      setStatus('Creating file or whatever it needs to...');
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
      } finally {
        setStatus('Ready', false);
      }
    }

    async function handleTextGeneration() {
      setStatus('Thinking what to say...');
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
      } finally {
        setStatus('Ready', false);
      }
    }
  </script>
</body>
</html>

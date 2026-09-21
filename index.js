<div class="status-container">
  <div class="spinner"></div>
  <span id="status-text">Ready</span>
</div>

<style>
  .status-container {
    display: flex;
    align-items: center;
    gap: 10px;
    font-family: sans-serif;
    font-size: 15px;
    color: #333;
  }

  .spinner {
    width: 16px;
    height: 16px;
    border: 3px solid #e0e0e0;
    border-top: 3px solid #3498db;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    display: none; /* Hidden by default */
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
</style>

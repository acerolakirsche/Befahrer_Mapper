// messageUtils.js
    function showTempMessage(message, backgroundColor = '#ffa500', duration = 5000, offset = 0) {
      const messageElement = document.createElement('div');
      messageElement.style.position = 'fixed';
      messageElement.style.bottom = `${20 + offset}px`;
      messageElement.style.left = '50%';
      messageElement.style.transform = 'translateX(-50%)';
      messageElement.style.backgroundColor = backgroundColor;
      messageElement.style.color = 'white';
      messageElement.style.padding = '10px 20px';
      messageElement.style.borderRadius = '5px';
      messageElement.style.zIndex = '10000';
      messageElement.style.textAlign = 'left';
      messageElement.style.whiteSpace = 'pre-line';
      messageElement.innerHTML = message;

      document.body.appendChild(messageElement);

      setTimeout(() => {
        document.body.removeChild(messageElement);
      }, duration);

      return messageElement;
    }

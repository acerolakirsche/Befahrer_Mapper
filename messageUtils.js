/**
 * messageUtils.js
 * ===============
 * This script provides utility functions for displaying temporary messages.
 * It handles:
 * - Creating and styling temporary message elements
 * - Positioning messages on the screen
 * - Automatic removal of messages after a timeout
 */

/**
 * Displays a temporary message on the screen
 * @param {string} message - The message content (can include HTML)
 * @param {string} backgroundColor - Background color for the message (default: orange)
 * @param {number} duration - How long the message should be visible in milliseconds (default: 5000)
 * @param {number} offset - Vertical offset from bottom in pixels (default: 0)
 * @returns {HTMLElement} - The created message element
 */
function showTempMessage(message, backgroundColor = '#ffa500', duration = 5000, offset = 0) {
  // Create message container
  const messageElement = document.createElement('div');
  
  // Apply styling
  messageElement.style.position = 'fixed';
  messageElement.style.bottom = `${20 + offset}px`; // Position from bottom with offset
  messageElement.style.left = '50%';
  messageElement.style.transform = 'translateX(-50%)'; // Center horizontally
  messageElement.style.backgroundColor = backgroundColor;
  messageElement.style.color = 'white';
  messageElement.style.padding = '10px 20px';
  messageElement.style.borderRadius = '5px';
  messageElement.style.zIndex = '10000'; // Ensure it's above other elements
  messageElement.style.textAlign = 'left'; // Left-align text
  messageElement.style.whiteSpace = 'pre-line'; // Preserve line breaks
  messageElement.innerHTML = message; // Set content (allows HTML)

  // Add message to the document
  document.body.appendChild(messageElement);

  // Set timeout to remove message
  setTimeout(() => {
    document.body.removeChild(messageElement);
  }, duration);

  // Return the element for reference
  return messageElement;
}

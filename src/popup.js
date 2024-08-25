document.addEventListener("DOMContentLoaded", () => {
    const intervalInput = document.getElementById("clean-interval");
    const applyButton = document.getElementById("apply-settings");
    const cleanNowButton = document.getElementById("clean-now");
    const statusMessage = document.getElementById("status-message");
  
    // Load the saved interval setting
    chrome.storage.sync.get(["cleanInterval"], (result) => {
      intervalInput.value = result.cleanInterval || 15; // Default to 15 minutes
    });
  
    // Apply new settings when the user clicks "Apply Settings"
    applyButton.addEventListener("click", () => {
      const interval = parseInt(intervalInput.value);
      if (isNaN(interval) || interval < 1 || interval > 1440) {
        statusMessage.textContent = "Please enter a valid interval between 1 and 1440 minutes.";
        return;
      }
      chrome.storage.sync.set({ cleanInterval: interval }, () => {
        statusMessage.textContent = `Interval set to ${interval} minutes.`;
      });
    });
  
    // Clean cookies immediately when the user clicks "Clean Now"
    cleanNowButton.addEventListener("click", () => {
      chrome.runtime.sendMessage({ action: "cleanCookies" }, (response) => {
        statusMessage.textContent = response.message || "Cookies cleaned!";
      });
    });
  });
  
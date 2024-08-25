chrome.alarms.onAlarm.addListener(() => {
    cleanCookies();
  });
  
  function cleanCookies() {
    chrome.cookies.getAll({}, (cookies) => {
      cookies.forEach(cookie => {
        const url = `http${cookie.secure ? 's' : ''}://${cookie.domain}${cookie.path}`;
        chrome.cookies.remove({ url: url, name: cookie.name }, () => {
          if (chrome.runtime.lastError) {
            console.error(`Failed to remove cookie: ${chrome.runtime.lastError}`);
          }
        });
      });
    });
  }
  
  // Listen for messages from popup.js
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "cleanCookies") {
      cleanCookies();
      sendResponse({ message: "Cookies cleaned successfully!" });
    }
    return true;
  });
  
  // Set the default cleaning interval to 30 minutes if not configured by the user
  chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get(["cleanInterval"], (result) => {
      if (!result.cleanInterval) {
        chrome.storage.sync.set({ cleanInterval: 30 }); // Default to 30 minutes
      }
      setupAlarm(result.cleanInterval || 30); // Make sure to pass a default value if undefined
    });
  });
  
  // Listen for interval changes from the popup
  chrome.storage.onChanged.addListener((changes) => {
    if (changes.cleanInterval) {
      setupAlarm(changes.cleanInterval.newValue);
    }
  });
  
  function setupAlarm(minutes) {
    if (minutes > 0) {
      chrome.alarms.clearAll(() => {
        chrome.alarms.create({ periodInMinutes: minutes });
      });
    }
  }
  
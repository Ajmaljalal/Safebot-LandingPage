document.addEventListener('DOMContentLoaded', async () => {
  const IOS_APP_STORE_URL = 'https://apps.apple.com/us/app/safebot/id6745245159';
  const loadingElement = document.getElementById('loading');
  const pageContentElement = document.getElementById('page-content');
  const pageContainerElement = document.getElementById('page-container');

  // --- Helper Functions ---
  function getDeviceType() {
    const ua = navigator.userAgent;

    // Check for iOS devices (iPhone, iPad, iPod)
    if (/iPad|iPhone|iPod/.test(ua) && !window.MSStream) {
      return "iOS";
    }

    // Check for iPad Pro on iPadOS 13+
    if (/Macintosh/.test(ua) && navigator.maxTouchPoints && navigator.maxTouchPoints > 2) {
      return "iOS"; // This is often an iPad Pro
    }

    // Check for Android devices specifically
    // Exclude cases where "Android" might appear in a desktop User-Agent
    if (/android/i.test(ua) && !/windows nt|macintosh|linux x86_64|linux i686/.test(ua.toLowerCase())) {
      return "Android";
    }

    // Check for Desktop (Mac, Windows, Linux)
    if (/Macintosh|Windows NT|Linux x86_64|Linux i686/.test(ua)) {
      // Further differentiate if needed, e.g., by checking for specific browser strings
      // For now, we just return a generic "Desktop" or "Unknown"
      // If you specifically need to identify "MacDesktopChrome", you could add:
      // if (/Macintosh/.test(ua) && /Chrome/.test(ua)) return "MacDesktopChrome";
      return "Desktop";
    }

    return "Unknown";
  }

  async function getUserLocationInfo() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        return {
          ip: data.ip,
          city: data.city,
          region: data.region,
          country: data.country_name,
          zip: data.postal,
          latitude: data.latitude,
          longitude: data.longitude,
          isp: data.org
        };
      }
    } catch (error) {
      console.warn('QR Page: Could not fetch location info.', error);
    }
    return null; // Return null if fetching fails
  }

  // --- Firebase Simulation --- (This will be replaced)
  // Replace this with your actual Firebase initialization and logging
  async function logToFirebase(collectionName, data) {
    // Check if Firebase was initialized successfully by the script in qrcode.html
    if (!window.firebaseDB || !window.firebaseFirestore || !window.firebaseFirestore.collection || !window.firebaseFirestore.addDoc) {
      console.error('Firebase DB or Firestore functions not initialized. Check qrcode.html.');
      // Return a rejected promise to be handled by the calling try...catch block
      return Promise.reject(new Error('Firebase not initialized'));
    }

    try {
      // Use the globally available Firestore instance (firebaseDB) and functions (firebaseFirestore.collection, firebaseFirestore.addDoc)
      const docRef = await window.firebaseFirestore.addDoc(
        window.firebaseFirestore.collection(window.firebaseDB, collectionName),
        data
      );
      console.log(`Real log: Document written to Firestore collection '${collectionName}' with ID: `, docRef.id);
      return docRef; // Resolve with the document reference for confirmation
    } catch (e) {
      console.error(`Real log: Error adding document to Firestore collection '${collectionName}': `, e);
      throw e; // Re-throw the error to be caught by the caller's try...catch
    }
  }

  // --- UI Update Functions ---
  function showLoading(isLoading) {
    if (isLoading) {
      loadingElement.classList.remove('hidden');
      pageContentElement.classList.add('hidden');
      if (pageContainerElement) pageContainerElement.classList.add('loading-active');
    } else {
      loadingElement.classList.add('hidden');
      pageContentElement.classList.remove('hidden');
      if (pageContainerElement) pageContainerElement.classList.remove('loading-active');
    }
  }

  function displayAndroidContent() {
    pageContentElement.innerHTML = `
    <img src="img/safebot-logo.png" alt="SafeBot Logo" style="width: 200px; height: auto;" class="logo">
            <h2>SafeBot for Android Coming Soon!</h2>
            <p>We're working hard to bring SafeBot to Android devices. Enter your details below (all optional) if you'd like us to notify you when it's available.</p>
            <form id="notify-form">
                <div class="form-group">
                    <label for="name">Name (Optional):</label>
                    <input type="text" id="name" name="name">
                </div>
                <div class="form-group">
                    <label for="email">Email (Optional):</label>
                    <input type="email" id="email" name="email">
                </div>
                <div class="form-group">
                    <label for="phone">Phone (Optional):</label>
                    <input type="tel" id="phone" name="phone">
                </div>
                <button type="submit" class="btn">Inform Me</button>
            </form>
            <p id="form-message" style="margin-top:15px; color: green;"></p>
        `;

    const notifyForm = document.getElementById('notify-form');
    notifyForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const phone = document.getElementById('phone').value.trim();
      const formMessage = document.getElementById('form-message');

      if (!name && !email && !phone) {
        formMessage.textContent = 'Please enter at least one contact method.';
        formMessage.style.color = 'red';
        return;
      }

      const contactDetails = {
        name: name || null,
        email: email || null,
        phone: phone || null,
        timestamp: new Date().toISOString()
      };

      try {
        await logToFirebase('androidInterest', contactDetails);
        formMessage.textContent = 'Thank you! We will notify you.';
        formMessage.style.color = 'green';
        notifyForm.reset();
      } catch (error) {
        console.error('QR Page: Failed to log Android interest', error);
        formMessage.textContent = 'Submission failed. Please try again.';
        formMessage.style.color = 'red';
      }
    });
  }

  // --- Main Logic ---
  showLoading(true);

  const deviceType = getDeviceType();
  const locationInfo = await getUserLocationInfo(); // Wait for location

  const initialLogData = {
    deviceType: deviceType,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    ...(locationInfo && { location: locationInfo }) // Spread locationInfo if it exists
  };

  // Log to Firebase based on device type
  if (deviceType === "iOS" || deviceType === "Android") {
    try {
      await logToFirebase('qrScanLogs', initialLogData);
      console.log(`Logged to qrScanLogs for ${deviceType}`);
    } catch (error) {
      console.error(`QR Page: Failed to log to qrScanLogs for ${deviceType}`, error);
    }
  } else if (deviceType === "Desktop") {
    try {
      await logToFirebase('desktopQrPageAccess', initialLogData); // New collection for desktop
      console.log(`Logged to desktopQrPageAccess for ${deviceType}`);
    } catch (error) {
      console.error(`QR Page: Failed to log to desktopQrPageAccess for ${deviceType}`, error);
    }
  } else {
    console.log(`QR Page: Device type is '${deviceType}'. Skipping Firebase log for this type.`);
  }

  showLoading(false);

  if (deviceType === "iOS") {
    console.log('iOS device detected. Redirecting to App Store:', IOS_APP_STORE_URL);
    window.location.href = IOS_APP_STORE_URL;
  } else if (deviceType === "Android") {
    console.log('Android device detected. Displaying Android content.');
    displayAndroidContent();
  } else { // This covers "Desktop" and "Unknown"
    console.log(`Device type '${deviceType}'. Displaying generic message.`);
    pageContentElement.innerHTML = `
            <img src="img/safebot-logo.png" alt="SafeBot Logo" style="width: 200px; height: auto; margin-bottom: 10px;" class="logo">
            <h2>Welcome to SafeBot!</h2>
            <p style="margin-bottom: 15px;">If you're on an iPhone, you can find our app on the</p>
            <a href="${IOS_APP_STORE_URL}" class="app-btn" aria-label="Download on the App Store" target="_blank">
              <i class="fab fa-apple" aria-hidden="true"></i>
              <span>
                <small>Download on the</small>
                <strong>App Store</strong>
              </span>
            </a>
            <p style="margin-top: 25px;">An Android version is coming soon!</p>
        `;
  }
}); 
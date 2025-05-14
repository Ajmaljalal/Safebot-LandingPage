document.addEventListener('DOMContentLoaded', function () {
  const IOS_APP_URL = 'https://apps.apple.com/us/app/safebot/id6745245159';

  function isIOS() {
    // Standard iOS detection
    return /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }

  function hasBannerBeenClosed() {
    // Check sessionStorage to see if banner was closed in this session
    return sessionStorage.getItem('smartBannerClosed_v1') === 'true';
  }

  function setBannerClosed() {
    // Set flag in sessionStorage when banner is closed
    sessionStorage.setItem('smartBannerClosed_v1', 'true');
  }

  // Function to get approximate location based on IP address.
  // This uses a free service; for production, a dedicated service with an API key is recommended.
  // Note: This function is defined but not currently used to gate the banner display.
  async function getUserLocationInfo() {
    try {
      const response = await fetch('https://ipapi.co/json/');
      if (response.ok) {
        const data = await response.json();
        console.log('User location (approximate):', data); // For debugging/info
        return {
          city: data.city,
          region: data.region,
          country: data.country_name,
          zip: data.postal // Postal code / zip code
        };
      }
    } catch (error) {
      console.warn('Smart Banner: Could not fetch location info.', error);
    }
    return null;
  }

  function createSmartBanner() {
    if (isIOS() && !hasBannerBeenClosed()) {
      const banner = document.createElement('div');
      banner.id = 'smart-app-banner';
      // Styling to mimic native iOS smart app banners
      banner.style.position = 'fixed';
      banner.style.top = '0';
      banner.style.left = '0';
      banner.style.width = '100%';
      banner.style.height = 'auto'; // Auto height
      banner.style.minHeight = '70px'; // Minimum height
      banner.style.backgroundColor = '#f8f8f8'; // Light grey background
      banner.style.padding = '10px';
      banner.style.borderBottom = '1px solid #dadada'; // Subtle border
      banner.style.zIndex = '10000';
      banner.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif';
      banner.style.display = 'flex';
      banner.style.alignItems = 'center';
      banner.style.justifyContent = 'space-between';
      banner.style.boxSizing = 'border-box';

      const closeButton = document.createElement('button');
      closeButton.innerHTML = '&#x2715;'; // 'X' symbol
      closeButton.setAttribute('aria-label', 'Close banner');
      closeButton.style.background = 'transparent';
      closeButton.style.border = '1px solid #ccc';
      closeButton.style.color = '#888';
      closeButton.style.borderRadius = '50%';
      closeButton.style.width = '22px';
      closeButton.style.height = '22px';
      closeButton.style.lineHeight = '20px';
      closeButton.style.fontSize = '12px';
      closeButton.style.cursor = 'pointer';
      closeButton.style.padding = '0';
      closeButton.style.marginLeft = '5px'; // Small margin from edge

      const appDetailsContainer = document.createElement('a'); // Make it a link
      appDetailsContainer.href = IOS_APP_URL;
      appDetailsContainer.target = '_blank';
      appDetailsContainer.style.display = 'flex';
      appDetailsContainer.style.alignItems = 'center';
      appDetailsContainer.style.textDecoration = 'none';
      appDetailsContainer.style.flexGrow = '1';
      appDetailsContainer.style.marginLeft = '10px'; // Space from close button
      appDetailsContainer.style.marginRight = '10px';


      const appIcon = document.createElement('img');
      // Assuming img/safebot-logo.png is accessible from the root
      appIcon.src = 'img/safebot-logo.png';
      appIcon.alt = 'SafeBot App Icon';
      appIcon.style.width = '48px';
      appIcon.style.height = '48px';
      appIcon.style.marginRight = '12px';
      appIcon.style.borderRadius = '9px'; // iOS like rounded corners
      appIcon.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';

      const appTextInfo = document.createElement('div');
      appTextInfo.innerHTML = `
                <div style="font-weight: 600; color: #000; font-size: 15px; line-height: 1.2;">SafeBot</div>
                <div style="font-size: 12px; color: #555; line-height: 1.3;">By SafeBot Security</div>
                <div style="font-size: 11px; color: #888; line-height: 1.3;">GET - In the App Store</div>
            `;

      const viewButtonLink = document.createElement('a');
      viewButtonLink.href = IOS_APP_URL;
      viewButtonLink.target = '_blank';
      viewButtonLink.textContent = 'VIEW';
      viewButtonLink.setAttribute('aria-label', 'View in App Store');
      viewButtonLink.style.backgroundColor = '#f0f0f0'; // Light grey button
      viewButtonLink.style.color = '#007aff'; // Blue text
      viewButtonLink.style.padding = '7px 18px';
      viewButtonLink.style.textDecoration = 'none';
      viewButtonLink.style.borderRadius = '15px'; // Pill shape
      viewButtonLink.style.fontSize = '14px';
      viewButtonLink.style.fontWeight = 'bold';
      viewButtonLink.style.border = '1px solid #e0e0e0';
      viewButtonLink.style.marginRight = '5px'; // Small margin from edge
      viewButtonLink.style.whiteSpace = 'nowrap';

      closeButton.onclick = function (e) {
        e.preventDefault(); // Prevent navigation if close is somehow part of a link
        e.stopPropagation();
        banner.remove();
        setBannerClosed();
      };

      appDetailsContainer.appendChild(appIcon);
      appDetailsContainer.appendChild(appTextInfo);

      banner.appendChild(closeButton);
      banner.appendChild(appDetailsContainer);
      banner.appendChild(viewButtonLink);

      document.body.prepend(banner);

      // Example of how you might call the location function (optional)
      // getUserLocationInfo().then(location => {
      //     if (location) {
      //         // Potentially use location.zip or other data here
      //     }
      // });
    }
  }

  createSmartBanner();
}); 
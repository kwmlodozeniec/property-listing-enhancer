// Property Listing Enhancer - Content Script

(function() {
  'use strict';

  const BADGE_ID = 'rm-postcode-badge';
  const UK_POSTCODE_REGEX = /\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/i;

  // Extract postcode from page's inline script tags
  function extractPostcode() {
    const scripts = document.querySelectorAll('script:not([src])');
    
    for (const script of scripts) {
      const content = script.textContent;
      
      // Rightmove embeds property data in JSON within script tags
      // The postcode appears as \\"EX32 0RE\\" (with escaped quotes)
      // Match both regular quotes and escaped quotes
      const quotedPostcodeRegex = /\\?"([A-Z]{1,2}\d[A-Z\d]?\s+\d[A-Z]{2})\\?"/gi;
      const matches = [...content.matchAll(quotedPostcodeRegex)];
      
      if (matches.length > 0) {
        // Try to find the most likely postcode by looking for property-related context
        for (const match of matches) {
          const postcode = match[1].trim().toUpperCase();
          
          // Validate: UK postcodes don't start with Q, V, X, I, J, Z
          if (postcode.match(/^[A-PR-UWYZ][A-HK-Y]?\d[ABEHMNPRVWXY\d]?\s*\d[ABD-HJLN-UW-Z]{2}$/i)) {
            // Check if this appears in property context (near tenure, price, etc.)
            const contextStart = Math.max(0, match.index - 500);
            const contextEnd = Math.min(content.length, match.index + 500);
            const context = content.substring(contextStart, contextEnd).toLowerCase();
            
            // Look for property-related keywords near the postcode
            if (context.includes('tenure') || 
                context.includes('bedroom') || 
                context.includes('freehold') ||
                context.includes('leasehold') ||
                context.includes('detached') ||
                context.includes('resale') ||
                context.includes('ownership')) {
              return postcode;
            }
          }
        }
        
        // Fallback: return the first valid-looking postcode if no context match
        for (const match of matches) {
          const postcode = match[1].trim().toUpperCase();
          if (postcode.match(/^[A-PR-UWYZ][A-HK-Y]?\d[ABEHMNPRVWXY\d]?\s*\d[ABD-HJLN-UW-Z]{2}$/i)) {
            return postcode;
          }
        }
      }
    }
    
    return null;
  }

  // Create and style the postcode badge with EPC link
  function createBadge(postcode) {
    const container = document.createElement('span');
    container.id = BADGE_ID;
    container.style.cssText = `
      display: inline-block;
      margin-left: 12px;
      vertical-align: middle;
    `;
    
    // Postcode badge (clickable to copy)
    const badge = document.createElement('button');
    badge.textContent = postcode;
    badge.title = 'Click to copy postcode';
    badge.style.cssText = `
      display: inline-block;
      background-color: #262637;
      color: #ffffff;
      font-size: 0.85em;
      font-weight: 600;
      padding: 4px 10px;
      border-radius: 4px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      letter-spacing: 0.5px;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s;
    `;
    
    // Copy to clipboard functionality
    badge.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(postcode);
        
        // Visual feedback
        const originalText = badge.textContent;
        const originalBg = badge.style.backgroundColor;
        badge.textContent = '✓ Copied!';
        badge.style.backgroundColor = '#007054';
        
        setTimeout(() => {
          badge.textContent = originalText;
          badge.style.backgroundColor = originalBg;
        }, 1500);
      } catch (err) {
        // Fallback visual feedback
        const originalText = badge.textContent;
        badge.textContent = '✗ Failed';
        setTimeout(() => {
          badge.textContent = originalText;
        }, 1500);
      }
    });
    
    // Hover effect
    badge.addEventListener('mouseenter', () => {
      badge.style.backgroundColor = '#3a3a4d';
    });
    badge.addEventListener('mouseleave', () => {
      badge.style.backgroundColor = '#262637';
    });
    
    // EPC button
    const epcButton = document.createElement('button');
    const encodedPostcode = encodeURIComponent(postcode);
    const epcUrl = `https://find-energy-certificate.service.gov.uk/find-a-certificate/search-by-postcode?postcode=${encodedPostcode}`;
    epcButton.textContent = 'EPC';
    epcButton.title = 'View Energy Performance Certificates for this postcode';
    epcButton.style.cssText = `
      display: inline-block;
      background-color: #007054;
      color: #ffffff;
      font-size: 0.85em;
      font-weight: 600;
      padding: 4px 10px;
      margin-left: 6px;
      border-radius: 4px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      letter-spacing: 0.5px;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s;
    `;
    
    // Click handler - open EPC search in new tab
    epcButton.addEventListener('click', () => {
      window.open(epcUrl, '_blank', 'noopener,noreferrer');
    });
    
    // Hover effect for EPC button
    epcButton.addEventListener('mouseenter', () => {
      epcButton.style.backgroundColor = '#005a43';
    });
    epcButton.addEventListener('mouseleave', () => {
      epcButton.style.backgroundColor = '#007054';
    });
    
    // Flood Risk button
    const floodButton = document.createElement('button');
    const floodUrl = 'https://check-long-term-flood-risk.service.gov.uk/postcode';
    floodButton.textContent = 'Flood Risk';
    floodButton.title = 'Check flood risk (postcode will be copied to clipboard)';
    floodButton.style.cssText = `
      display: inline-block;
      background-color: #1d70b8;
      color: #ffffff;
      font-size: 0.85em;
      font-weight: 600;
      padding: 4px 10px;
      margin-left: 6px;
      border-radius: 4px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      letter-spacing: 0.5px;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s;
    `;
    
    // Click handler - copy postcode and open flood risk page
    floodButton.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(postcode);
        
        // Visual feedback
        const originalText = floodButton.textContent;
        const originalBg = floodButton.style.backgroundColor;
        floodButton.textContent = '✓ Copied';
        floodButton.style.backgroundColor = '#007054';
        
        // Open the flood risk page
        window.open(floodUrl, '_blank', 'noopener,noreferrer');
        
        // Reset button after delay
        setTimeout(() => {
          floodButton.textContent = originalText;
          floodButton.style.backgroundColor = originalBg;
        }, 2000);
      } catch (err) {
        // Still open the page even if copy failed
        window.open(floodUrl, '_blank', 'noopener,noreferrer');
        
        const originalText = floodButton.textContent;
        floodButton.textContent = 'Opened';
        setTimeout(() => {
          floodButton.textContent = originalText;
        }, 2000);
      }
    });
    
    // Hover effect for Flood button
    floodButton.addEventListener('mouseenter', () => {
      floodButton.style.backgroundColor = '#144e81';
    });
    floodButton.addEventListener('mouseleave', () => {
      floodButton.style.backgroundColor = '#1d70b8';
    });
    
    container.appendChild(badge);
    container.appendChild(epcButton);
    container.appendChild(floodButton);
    
    return container;
  }

  // Inject the postcode badge next to the property title
  function injectPostcode() {
    // Check if already injected
    if (document.getElementById(BADGE_ID)) {
      return;
    }

    // Find the h1 element (property title)
    const h1 = document.querySelector('h1');
    
    if (!h1) {
      return; // Title not yet in DOM
    }

    // Extract postcode from page
    const postcode = extractPostcode();
    
    if (!postcode) {
      return;
    }

    // Create and append the badge
    const badge = createBadge(postcode);
    h1.appendChild(badge);
  }

  // Wait for the page to be ready and inject
  function init() {
    // Try immediate injection
    injectPostcode();

    // If that didn't work, observe DOM changes (SPA handling)
    if (!document.getElementById(BADGE_ID)) {
      const observer = new MutationObserver((mutations, obs) => {
        injectPostcode();
        
        // Stop observing once injected
        if (document.getElementById(BADGE_ID)) {
          obs.disconnect();
        }
      });

      observer.observe(document.body, {
        childList: true,
        subtree: true
      });

      // Stop observing after 10 seconds regardless
      setTimeout(() => observer.disconnect(), 10000);
    }
  }

  // Run when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

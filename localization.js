// Localization system for Outline VPN website
// 
// Language Initialization Flow:
// 1. Check for stored user preference in localStorage
// 2. If no preference found, detect language via IP geolocation API
// 3. Apply the determined language once (no redundant calls)
// 4. Mark initialization as complete for other components to check
//
// Mobile Menu Management:
// - Handles both onclick and event listener styles
// - Provides unified functionality across all pages
// - Eliminates code duplication
//
// Language Toggle System:
// - Desktop: Added to navigation bar
// - Mobile: Added to mobile menu with proper styling
// - Both buttons stay synchronized when language changes
// - Uses translations for consistent localization
class LocalizationManager {
  constructor() {
    this.currentLanguage = 'en'; // Default to English
    this.translations = window.translations || {};
    this.initializationComplete = false; // Track initialization status
    this.init();
  }

  init() {
    // Add language toggle to the page
    this.addLanguageToggle();
    
    // Initialize mobile menu functionality
    this.initMobileMenu();
    
    // Determine the language to use
    this.determineInitialLanguage();
  }

  // Determine the initial language to use
  async determineInitialLanguage() {
    try {
      // Check for stored user preference first
      if (this.checkStoredPreference()) {
        // Use stored preference - no need to call setLanguage here
        console.log('Using stored language preference:', this.currentLanguage);
      } else {
        // No stored preference, detect via API
        await this.detectLanguage();
      }
      
      // Apply the determined language once
      this.setLanguage(this.currentLanguage);
      
      // Mark initialization as complete
      this.initializationComplete = true;
      
    } catch (error) {
      console.error('Language initialization failed:', error);
      // Fallback to English
      this.currentLanguage = 'en';
      this.setLanguage(this.currentLanguage);
      this.initializationComplete = true;
    }
  }

  // Detect user location and set appropriate language
  async detectLanguage() {
    try {
      const response = await fetch('https://ip-api.com/json/?fields=countryCode');
      const data = await response.json();
      
      if (data.countryCode === 'MY') {
        this.currentLanguage = 'ms';
        console.log('Malaysian user detected, setting language to Bahasa Melayu');
      } else {
        this.currentLanguage = 'en';
        console.log('Non-Malaysian user detected, setting language to English');
      }
    } catch (error) {
      console.error('IP detection failed, defaulting to English:', error);
      this.currentLanguage = 'en';
    }
    
    // Note: setLanguage is NOT called here - it's called once in determineInitialLanguage
  }

  // Initialize mobile menu functionality
  initMobileMenu() {
    // Handle both types of mobile menu implementations
    this.setupMobileMenu();
    
    // Close mobile menu when clicking outside
    this.setupClickOutsideHandler();
    
    // Close mobile menu when navigation links are clicked
    this.setupNavigationLinkHandlers();
  }

  // Setup mobile menu toggle functionality
  setupMobileMenu() {
    // Handle menu button clicks (for index.html style)
    const menuBtn = document.getElementById('menu-btn');
    if (menuBtn) {
      menuBtn.addEventListener('click', () => {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu) {
          mobileMenu.classList.toggle('is-open');
        }
      });
    }

    // Handle toggleMobileMenu function calls (for contact.html and legal.html style)
    window.toggleMobileMenu = () => {
      const menu = document.getElementById('mobile-menu');
      if (menu) {
        menu.classList.toggle('is-open');
      }
    };
  }

  // Setup click outside handler to close mobile menu
  setupClickOutsideHandler() {
    document.addEventListener('click', (e) => {
      const mobileMenu = document.getElementById('mobile-menu');
      if (!mobileMenu) return;

      // Check if click is outside the mobile menu and not on a menu button
      const isMenuButton = e.target.closest('[onclick*="toggleMobileMenu"], #menu-btn');
      const isInsideMenu = mobileMenu.contains(e.target);
      
      if (!isInsideMenu && !isMenuButton && mobileMenu.classList.contains('is-open')) {
        mobileMenu.classList.remove('is-open');
      }
    });
  }

  // Setup navigation link handlers to close mobile menu
  setupNavigationLinkHandlers() {
    // Close menu when any navigation link is clicked
    document.querySelectorAll('#mobile-menu a, .mobile-menu a').forEach(link => {
      link.addEventListener('click', () => {
        const mobileMenu = document.getElementById('mobile-menu');
        if (mobileMenu && mobileMenu.classList.contains('is-open')) {
          mobileMenu.classList.remove('is-open');
        }
      });
    });
  }

  // Add language toggle button to the header and mobile menu
  addLanguageToggle() {
    // Add to desktop navigation
    this.addLanguageToggleToDesktop();
    
    // Add to mobile menu
    this.addLanguageToggleToMobile();
  }

  // Add language toggle to desktop navigation
  addLanguageToggleToDesktop() {
    const header = document.querySelector('header nav');
    if (header) {
      const languageToggle = document.createElement('button');
      languageToggle.id = 'language-toggle-desktop';
      languageToggle.className = 'text-slate-300 hover:text-orange-400 transition-colors font-medium ml-4 px-3 py-1 rounded border border-slate-600 hover:border-orange-500';
      languageToggle.innerHTML = this.getText('languageToggle');
      languageToggle.addEventListener('click', () => this.toggleLanguage());
      
      // Insert after the navigation links
      const navLinks = header.querySelector('.hidden.md\\:flex');
      if (navLinks) {
        navLinks.appendChild(languageToggle);
      }
    }
  }

  // Add language toggle to mobile menu
  addLanguageToggleToMobile() {
    const mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenu) return;

    // Create mobile language toggle button
    const mobileLanguageToggle = document.createElement('button');
    mobileLanguageToggle.id = 'language-toggle-mobile';
    mobileLanguageToggle.className = 'w-full text-left text-slate-300 hover:text-orange-400 transition-colors font-medium py-3 px-4 rounded border border-slate-600 hover:border-orange-500 bg-gray-700/50 hover:bg-gray-600/50';
    mobileLanguageToggle.innerHTML = `${this.getText('languageLabel')}: ${this.getText('languageToggle')}`;
    mobileLanguageToggle.addEventListener('click', () => this.toggleLanguage());

    // Determine where to insert the language toggle based on mobile menu structure
    const navElement = mobileMenu.querySelector('nav');
    const firstNavLink = mobileMenu.querySelector('nav a');
    
    if (navElement && firstNavLink) {
      // For contact.html and legal.html style (with header section)
      // Insert at the top of the navigation section
      navElement.insertBefore(mobileLanguageToggle, firstNavLink);
      
      // Add a separator after the language toggle
      const separator = document.createElement('div');
      separator.className = 'border-t border-gray-600 my-4';
      navElement.insertBefore(separator, firstNavLink.nextSibling);
      
    } else if (mobileMenu.children.length > 0) {
      // For index.html style (direct navigation links)
      // Insert at the top of the mobile menu
      mobileMenu.insertBefore(mobileLanguageToggle, mobileMenu.firstChild);
      
      // Add a separator after the language toggle
      const separator = document.createElement('div');
      separator.className = 'border-t border-gray-600 my-4';
      mobileMenu.insertBefore(separator, mobileMenu.firstChild.nextSibling);
    }
  }

  // Toggle between English and Malay
  toggleLanguage() {
    this.currentLanguage = this.currentLanguage === 'en' ? 'ms' : 'en';
    this.setLanguage(this.currentLanguage);
    
    // Store user preference
    localStorage.setItem('preferred-language', this.currentLanguage);
    
    // Update page language attribute
    document.documentElement.lang = this.currentLanguage;
    
    // Update meta tags
    this.updateMetaTags();
    
    // Update language toggle button texts
    this.updateLanguageToggleTexts();
    
    // Show language change notification
    this.showLanguageNotification();
  }

  // Update the text of language toggle buttons
  updateLanguageToggleTexts() {
    const desktopToggle = document.getElementById('language-toggle-desktop');
    const mobileToggle = document.getElementById('language-toggle-mobile');
    
    const toggleText = this.getText('languageToggle');
    const mobileToggleText = `${this.getText('languageLabel')}: ${this.getText('languageToggle')}`;
    
    if (desktopToggle) {
      desktopToggle.innerHTML = toggleText;
    }
    
    if (mobileToggle) {
      mobileToggle.innerHTML = mobileToggleText;
    }
  }

  // Show a brief notification when language changes
  showLanguageNotification() {
    const langPack = this.translations[this.currentLanguage] || this.translations.en;
    const message = langPack.currentLanguage || 'Language changed';
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'fixed top-20 right-6 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-50 transform transition-all duration-300 translate-x-full';
    notification.innerHTML = `✓ ${message}`;
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }, 2000);
  }

  // Set language and update all text content
  setLanguage(lang) {
    const langPack = this.translations[lang] || this.translations.en;
    if (!langPack) {
      console.error('Language pack not found:', lang);
      return;
    }

    // Update all elements with data-lang-key attributes
    document.querySelectorAll('[data-lang-key]').forEach(element => {
      const key = element.getAttribute('data-lang-key');
      if (langPack[key]) {
        // Handle different element types
        if (element.tagName === 'INPUT' && element.placeholder !== undefined) {
          element.placeholder = langPack[key];
        } else if (element.tagName === 'META') {
          element.setAttribute('content', langPack[key]);
        } else {
          element.innerHTML = langPack[key];
        }
      }
    });

    // Update page title
    if (langPack.pageTitle) {
      document.title = langPack.pageTitle;
    }

    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && langPack.pageDescription) {
      metaDesc.setAttribute('content', langPack.pageDescription);
    }

    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && langPack.pageKeywords) {
      metaKeywords.setAttribute('content', langPack.pageKeywords);
    }

    // Update Open Graph tags
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && langPack.pageTitle) {
      ogTitle.setAttribute('content', langPack.pageTitle);
    }

    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && langPack.pageDescription) {
      ogDesc.setAttribute('content', langPack.pageDescription);
    }

    // Update Twitter tags
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle && langPack.pageTitle) {
      twitterTitle.setAttribute('content', langPack.pageTitle);
    }

    const twitterDesc = document.querySelector('meta[property="twitter:description"]');
    if (twitterDesc && langPack.pageDescription) {
      twitterDesc.setAttribute('content', langPack.pageDescription);
    }

    console.log(`Language set to: ${lang}`);
    
    // Update language toggle button texts to reflect current language
    this.updateLanguageToggleTexts();
  }

  // Update meta tags for SEO
  updateMetaTags() {
    const langPack = this.translations[this.currentLanguage] || this.translations.en;
    
    // Update hreflang tags
    let hreflangEn = document.querySelector('link[hreflang="en"]');
    let hreflangMs = document.querySelector('link[hreflang="ms-MY"]');
    
    if (!hreflangEn) {
      hreflangEn = document.createElement('link');
      hreflangEn.rel = 'alternate';
      hreflangEn.hreflang = 'en';
      hreflangEn.href = window.location.href;
      document.head.appendChild(hreflangEn);
    }
    
    if (!hreflangMs) {
      hreflangMs = document.createElement('link');
      hreflangMs.rel = 'alternate';
      hreflangMs.hreflang = 'ms-MY';
      hreflangMs.href = window.location.href;
      document.head.appendChild(hreflangMs);
    }
  }

  // Get current language
  getCurrentLanguage() {
    return this.currentLanguage;
  }

  // Check if user has a stored language preference
  checkStoredPreference() {
    const stored = localStorage.getItem('preferred-language');
    if (stored && (stored === 'en' || stored === 'ms')) {
      this.currentLanguage = stored;
      return true;
    }
    return false;
  }

  // Get translation for a specific key
  getText(key) {
    const langPack = this.translations[this.currentLanguage] || this.translations.en;
    return langPack[key] || key;
  }

  // Check if language initialization is complete
  isInitializationComplete() {
    return this.initializationComplete === true;
  }

  // Wait for language initialization to complete
  async waitForInitialization() {
    if (this.isInitializationComplete()) {
      return Promise.resolve();
    }
    
    return new Promise((resolve) => {
      const checkComplete = () => {
        if (this.isInitializationComplete()) {
          resolve();
        } else {
          setTimeout(checkComplete, 10);
        }
      };
      checkComplete();
    });
  }
}

// Initialize localization when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Wait for translations to be loaded
  if (window.translations) {
    const langManager = new LocalizationManager();
    window.langManager = langManager;
  } else {
    // If translations aren't loaded yet, wait a bit and try again
    setTimeout(() => {
      if (window.translations) {
        const langManager = new LocalizationManager();
        window.langManager = langManager;
      } else {
        console.error('Translations not loaded');
      }
    }, 100);
  }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LocalizationManager;
} 
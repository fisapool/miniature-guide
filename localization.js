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
    // Look for the navigation container in the new header structure
    const desktopNav = document.querySelector('header .hidden.md\\:flex');
    if (desktopNav) {
      const languageToggle = document.createElement('button');
      languageToggle.id = 'language-toggle-desktop';
      languageToggle.className = 'language-toggle';
      languageToggle.innerHTML = `
        <svg class="w-4 h-4 language-icon transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.41 12m2.41 0a18.022 18.022 0 006.41 0m2.41 0a18.022 18.022 0 006.41 0m2.41 0a18.022 18.022 0 006.41 0M9 12l-3-3m3 3l3-3m3 3l-3 3"></path>
        </svg>
        <span>${this.getText('languageToggle')}</span>
      `;
      languageToggle.addEventListener('click', () => this.toggleLanguage());
      
      // Insert after the navigation links but before the online users display
      const onlineUsersDiv = desktopNav.querySelector('.flex.items-center.space-x-2.text-sm');
      if (onlineUsersDiv) {
        desktopNav.insertBefore(languageToggle, onlineUsersDiv);
      } else {
        // Fallback: append to the end
        desktopNav.appendChild(languageToggle);
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
    mobileLanguageToggle.className = 'language-toggle-mobile';
    mobileLanguageToggle.innerHTML = `
      <div class="flex items-center space-x-3">
        <svg class="w-5 h-5 text-orange-400 language-icon transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.41 12m2.41 0a18.022 18.022 0 006.41 0m2.41 0a18.022 18.022 0 006.41 0m2.41 0a18.022 18.022 0 006.41 0M9 12l-3-3m3 3l3-3m3 3l-3 3"></path>
        </svg>
        <span>${this.getText('languageLabel')}</span>
      </div>
      <span class="text-orange-400 font-semibold">${this.getText('languageToggle')}</span>
    `;
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
    const languageLabel = this.getText('languageLabel');
    
    if (desktopToggle) {
      desktopToggle.innerHTML = `
        <svg class="w-4 h-4 language-icon transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.41 12m2.41 0a18.022 18.022 0 006.41 0m2.41 0a18.022 18.022 0 006.41 0m2.41 0a18.022 18.022 0 006.41 0M9 12l-3-3m3 3l3-3m3 3l-3 3"></path>
        </svg>
        <span>${toggleText}</span>
      `;
    }
    
    if (mobileToggle) {
      mobileToggle.innerHTML = `
        <div class="flex items-center space-x-3">
          <svg class="w-5 h-5 text-orange-400 language-icon transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.41 12m2.41 0a18.022 18.022 0 006.41 0m2.41 0a18.022 18.022 0 006.41 0m2.41 0a18.022 18.022 0 006.41 0M9 12l-3-3m3 3l3-3m3 3l-3 3"></path>
          </svg>
          <span>${languageLabel}</span>
        </div>
        <span class="text-orange-400 font-semibold">${toggleText}</span>
      `;
    }
  }

  // Show language change notification
  showLanguageNotification() {
    // Remove existing notification if any
    const existingNotification = document.getElementById('language-notification');
    if (existingNotification) {
      existingNotification.remove();
    }

    const notification = document.createElement('div');
    notification.id = 'language-notification';
    notification.className = 'fixed top-4 right-4 z-50 bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-lg shadow-2xl border border-orange-400 transform translate-x-full transition-transform duration-500 ease-out';
    
    const currentLang = this.currentLanguage === 'en' ? 'English' : 'Bahasa Melayu';
    notification.innerHTML = `
      <div class="flex items-center space-x-3">
        <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.41 12m2.41 0a18.022 18.022 0 006.41 0m2.41 0a18.022 18.022 0 006.41 0m2.41 0a18.022 18.022 0 006.41 0M9 12l-3-3m3 3l3-3m3 3l-3 3"></path>
        </svg>
        <span class="font-semibold">Language changed to ${currentLang}</span>
      </div>
    `;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 100);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.classList.add('translate-x-full');
      setTimeout(() => {
        if (notification.parentNode) {
          notification.remove();
        }
      }, 500);
    }, 3000);
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
    
    // Update page title
    if (langPack.pageTitle) {
      document.title = langPack.pageTitle;
    }
    
    // Update meta description
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && langPack.pageDescription) {
      metaDesc.content = langPack.pageDescription;
    }
    
    // Update meta keywords
    const metaKeywords = document.querySelector('meta[name="keywords"]');
    if (metaKeywords && langPack.pageKeywords) {
      metaKeywords.content = langPack.pageKeywords;
    }
    
    // Update Open Graph title
    const ogTitle = document.querySelector('meta[property="og:title"]');
    if (ogTitle && langPack.pageTitle) {
      ogTitle.content = langPack.pageTitle;
    }
    
    // Update Open Graph description
    const ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc && langPack.pageDescription) {
      ogDesc.content = langPack.pageDescription;
    }
    
    // Update Twitter title
    const twitterTitle = document.querySelector('meta[property="twitter:title"]');
    if (twitterTitle && langPack.pageTitle) {
      twitterTitle.content = langPack.pageTitle;
    }
    
    // Update Twitter description
    const twitterDesc = document.querySelector('meta[property="twitter:description"]');
    if (twitterDesc && langPack.pageDescription) {
      twitterDesc.content = langPack.pageDescription;
    }
    
    // Add language indicator to header
    this.updateLanguageIndicator();
  }
  
  // Add visual language indicator to header
  updateLanguageIndicator() {
    const header = document.querySelector('header');
    if (!header) return;
    
    // Remove existing indicator
    const existingIndicator = document.getElementById('language-indicator');
    if (existingIndicator) {
      existingIndicator.remove();
    }
    
    const currentLang = this.currentLanguage === 'en' ? 'EN' : 'MS';
    const langName = this.currentLanguage === 'en' ? 'English' : 'Bahasa Melayu';
    
    const indicator = document.createElement('div');
    indicator.id = 'language-indicator';
    indicator.className = 'absolute top-2 right-2 md:top-4 md:right-4 z-10';
    indicator.innerHTML = `
      <div class="flex items-center space-x-2 bg-slate-800/80 backdrop-blur-sm border border-slate-600 rounded-full px-3 py-1 text-xs text-slate-300">
        <span class="w-2 h-2 bg-green-400 rounded-full"></span>
        <span class="font-medium">${currentLang}</span>
        <span class="text-slate-500">|</span>
        <span class="text-slate-400">${langName}</span>
      </div>
    `;
    
    header.appendChild(indicator);
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
        console.error('Translations not loaded after retry');
        // Fallback: create a basic manager with empty translations
        window.translations = { en: {}, ms: {} };
        const langManager = new LocalizationManager();
        window.langManager = langManager;
      }
    }, 100);
  }
});

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = LocalizationManager;
} 
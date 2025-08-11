// Enhanced real-time updates simulation
function updateRealTimeStats() {
    // Update online users count
    const usersElement = document.getElementById('online-users');
    if (usersElement) {
        const baseUsers = 2800;
        const randomUsers = Math.floor(Math.random() * 100);
        usersElement.textContent = `${baseUsers + randomUsers} users online`;
    }

    // Update server load
    const loadElement = document.getElementById('server-load');
    if (loadElement) {
        const load = Math.floor(Math.random() * 30) + 15; // 15-45%
        loadElement.textContent = `${load}%`;
        loadElement.className = load < 30 ? 'text-green-400 font-semibold' : 
                               load < 50 ? 'text-yellow-400 font-semibold' : 
                               'text-red-400 font-semibold';
    }

    // Update ping time
    const pingElement = document.getElementById('ping-time');
    if (pingElement) {
        const ping = Math.floor(Math.random() * 10) + 5; // 5-15ms
        pingElement.textContent = `${ping}ms`;
    }

    // Update speed display
    const speedElement = document.getElementById('speed-display');
    if (speedElement) {
        const speed = Math.floor(Math.random() * 50) + 900; // 900-950 Mbps
        speedElement.textContent = speed;
    }
}

// Enhanced counter animation with better easing
function animateCounter(element, target) {
    if (!element || isNaN(target)) {
        console.warn('Invalid element or target for counter animation:', element, target);
        return;
    }
    
    const duration = 2000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        
        if (target === 99.9) {
            element.textContent = current.toFixed(1);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Enhanced intersection observer with better performance
const observeElements = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-up-animate');
                
                // Trigger counter animation if it has data-target
                if (entry.target.hasAttribute('data-target')) {
                    setTimeout(() => {
                        animateCounter(entry.target, parseFloat(entry.target.getAttribute('data-target')));
                    }, 200);
                }
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '50px'
    });

    document.querySelectorAll('.feature-card, [data-target]').forEach(el => {
        observer.observe(el);
    });
};

// Generate random floating particles
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const colors = ['bg-orange-400', 'bg-blue-400', 'bg-green-400', 'bg-purple-400'];
    const sizes = ['w-1 h-1', 'w-2 h-2', 'w-3 h-3'];
    
    particle.classList.add(colors[Math.floor(Math.random() * colors.length)]);
    particle.classList.add(...sizes[Math.floor(Math.random() * sizes.length)].split(' '));
    
    particle.style.left = Math.random() * 100 + '%';
    particle.style.animationDelay = Math.random() * 8 + 's';
    particle.style.animationDuration = (Math.random() * 4 + 6) + 's';
    
    document.body.appendChild(particle);
    
    // Remove particle after animation
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
        }
    }, 12000);
}

// Performance optimization: Reduce animations on slow devices
function optimizeForPerformance() {
    if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
        document.documentElement.style.setProperty('--animation-duration', '0.2s');
        // Reduce particle generation
        setInterval(createParticle, 6000);
    } else {
        // Normal particle generation
        setInterval(createParticle, 3000);
    }
}

// Initialize counter animations with proper target values
function initializeCounters() {
    console.log('Initializing counters...');
    
    // Define the actual metrics
    const metrics = {
        speed: 950,
        uptime: 99.9,
        support: 24,
        devices: '∞'
    };
    
    // Set up speed counter - show placeholder immediately
    const speedCounter = document.querySelector('[data-target="950"]');
    if (speedCounter) {
        console.log('Found speed counter, setting target to:', metrics.speed);
        speedCounter.setAttribute('data-target', metrics.speed);
        // Show placeholder value immediately instead of 0
        speedCounter.textContent = '≈950';
        // Start animation after a short delay for better UX
        setTimeout(() => {
            animateCounter(speedCounter, metrics.speed);
        }, 500);
    }
    
    // Set up uptime counter - show placeholder immediately
    const uptimeCounter = document.querySelector('[data-target="99.9"]');
    if (uptimeCounter) {
        console.log('Found uptime counter, setting target to:', metrics.uptime);
        uptimeCounter.setAttribute('data-target', metrics.uptime);
        // Show placeholder value immediately instead of 0
        uptimeCounter.textContent = '99.9';
        // Start animation after a short delay for better UX
        setTimeout(() => {
            animateCounter(uptimeCounter, metrics.uptime);
        }, 500);
    }
    
    // Set up support counter (static value, no animation needed)
    const supportCounter = document.querySelector('.glass-card:nth-child(3) .text-5xl');
    if (supportCounter) {
        console.log('Setting support counter to:', metrics.support);
        supportCounter.textContent = metrics.support;
    }
    
    // Set up devices counter (static value, no animation needed)
    const devicesCounter = document.querySelector('.glass-card:nth-child(4) .text-5xl');
    if (devicesCounter) {
        console.log('Setting devices counter to:', metrics.devices);
        devicesCounter.textContent = metrics.devices;
    }
}

// FAQ toggle functionality
function initializeFAQ() {
    const faqItems = document.querySelectorAll('.faq-item');
    
    faqItems.forEach(item => {
        const summary = item.querySelector('summary');
        const icon = summary?.querySelector('.icon');
        
        if (summary && icon) {
            item.addEventListener('toggle', () => {
                if (item.open) {
                    icon.style.transform = 'rotate(45deg)';
                    item.style.borderColor = '#f97316';
                } else {
                    icon.style.transform = 'rotate(0deg)';
                    item.style.borderColor = 'transparent';
                }
            });
        }
    });
}

// Smooth scrolling for anchor links
function initializeSmoothScrolling() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        }, { passive: false });
    });
}

// Initialize setup progress
function initializeSetupProgress() {
    // Setup progress functionality can be added here
    console.log('Setup progress initialized');
}

// Initialize chat widget
function initializeChatWidget() {
    const chatWidget = document.getElementById('chat-widget');
    const chatPopup = document.getElementById('chat-popup');
    const closeChat = document.getElementById('close-chat');
    
    if (chatWidget && chatPopup) {
        chatWidget.addEventListener('click', () => {
            chatPopup.classList.toggle('hidden');
        });
        
        if (closeChat) {
            closeChat.addEventListener('click', () => {
                chatPopup.classList.add('hidden');
            });
        }
        
        // Close chat when clicking outside
        document.addEventListener('click', (e) => {
            if (!chatWidget.contains(e.target) && !chatPopup.contains(e.target)) {
                chatPopup.classList.add('hidden');
            }
        });
    }
}

// Initialize enhanced FAQ
function initializeEnhancedFAQ() {
    // Enhanced FAQ functionality can be added here
    console.log('Enhanced FAQ initialized');
}

// Filter FAQ items based on search and category
function filterFAQ(searchTerm, category) {
    const faqItems = document.querySelectorAll('.faq-item');
    const noResults = document.getElementById('faq-no-results');
    let visibleCount = 0;
    
    faqItems.forEach(item => {
        const itemCategory = item.dataset.category;
        const keywords = item.dataset.keywords || '';
        const question = item.querySelector('summary').textContent.toLowerCase();
        const answer = item.querySelector('p').textContent.toLowerCase();
        
        const matchesSearch = searchTerm === '' || 
            question.includes(searchTerm) || 
            answer.includes(searchTerm) || 
            keywords.includes(searchTerm);
        
        const matchesCategory = category === 'all' || itemCategory === category;
        
        if (matchesSearch && matchesCategory) {
            item.style.display = 'block';
            visibleCount++;
            item.classList.add('slide-in-left');
        } else {
            item.style.display = 'none';
        }
    });
    
    // Show/hide no results message
    if (visibleCount === 0) {
        noResults.classList.remove('hidden');
    } else {
        noResults.classList.add('hidden');
    }
}

// Get active category
function getActiveCategory() {
    const activeBtn = document.querySelector('.faq-category-btn.active');
    return activeBtn ? activeBtn.dataset.category : 'all';
}

// Show connection guide popup
function showConnectionGuide() {
    const popup = document.createElement('div');
    popup.className = 'fixed inset-0 bg-black/50 flex items-center justify-center z-50';
    popup.innerHTML = `
        <div class="bg-gray-800 rounded-2xl p-8 max-w-2xl mx-4 border border-orange-500/30 max-h-[90vh] overflow-y-auto">
            <div class="flex justify-between items-center mb-6">
                <h3 class="text-2xl font-bold text-white">Connection Guide</h3>
                <button onclick="this.closest('.fixed').remove()" class="text-white">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <div class="space-y-6 text-slate-300">
                <div class="bg-slate-700/50 p-4 rounded-lg">
                    <h4 class="font-semibold text-white mb-2">Step 1: Open Outline App</h4>
                    <p>Launch the Outline Client app on your device</p>
                </div>
                <div class="bg-slate-700/50 p-4 rounded-lg">
                    <h4 class="font-semibold text-white mb-2">Step 2: Add Server</h4>
                    <p>Click the '+' icon or "Add Server" button</p>
                </div>
                <div class="bg-slate-700/50 p-4 rounded-lg">
                    <h4 class="font-semibold text-white mb-2">Step 3: Paste Access Key</h4>
                    <p>Paste your access key (starts with 'ss://') into the field</p>
                </div>
                <div class="bg-slate-700/50 p-4 rounded-lg">
                    <h4 class="font-semibold text-white mb-2">Step 4: Connect</h4>
                    <p>Click "Connect" and wait for the connection to establish</p>
                </div>
                <div class="bg-green-600/20 border border-green-500/30 p-4 rounded-lg">
                    <h4 class="font-semibold text-green-400 mb-2">✅ You're Connected!</h4>
                    <p>Your internet traffic is now encrypted and secure</p>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Close popup when clicking outside
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.remove();
        }
    });
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Start real-time updates
    updateRealTimeStats();
    setInterval(updateRealTimeStats, 5000); // Update every 5 seconds
    
    // Initialize intersection observer
    observeElements();
    
    // Initialize performance optimization
    optimizeForPerformance();
    
    // Create some initial particles
    for (let i = 0; i < 3; i++) {
        setTimeout(createParticle, i * 1000);
    }
    
    // Initialize existing functions
    initializeCounters();
    initializeFAQ();
    initializeSmoothScrolling();
    initializeSetupProgress();
    initializeChatWidget();
    initializeEnhancedFAQ();
    
    // Initialize FAQ search and filtering
    const searchInput = document.getElementById('faq-search');
    const categoryButtons = document.querySelectorAll('.faq-category-btn');
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            filterFAQ(searchTerm, getActiveCategory());
        });
    }
    
    if (categoryButtons.length > 0) {
        categoryButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Update active button
                categoryButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                // Filter FAQ items
                const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
                filterFAQ(searchTerm, btn.dataset.category);
            });
        });
    }
    
    console.log('Enhanced UI initialized successfully!');
});
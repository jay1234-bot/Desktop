// Enhanced JavaScript for Thakur Science Academy Website

// DOM Elements
const navbar = document.querySelector('.navbar');
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');
const modal = document.getElementById('contactModal');
const contactBtn = document.getElementById('contactBtn');
const closeBtn = document.querySelector('.close');
const contactForm = document.getElementById('contactForm');
const testimonialCards = document.querySelectorAll('.testimonial-card');
const prevBtn = document.querySelector('.testimonial-btn.prev');
const nextBtn = document.querySelector('.testimonial-btn.next');
const dots = document.querySelectorAll('.dot');

// Enhanced State Management
let currentTestimonial = 0;
let isScrolling = false;
let scrollTimeout;
let formSubmitted = false;
let observer;

// Enhanced Mobile Navigation
function toggleMobileMenu() {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
    
    // Animate hamburger
    const bars = hamburger.querySelectorAll('.bar');
    bars.forEach((bar, index) => {
        if (hamburger.classList.contains('active')) {
            if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
            if (index === 1) bar.style.opacity = '0';
            if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            bar.style.transform = 'none';
            bar.style.opacity = '1';
        }
    });
}

function closeMobileMenu() {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
    const bars = hamburger.querySelectorAll('.bar');
    bars.forEach(bar => {
        bar.style.transform = 'none';
        bar.style.opacity = '1';
    });
}

// Enhanced Navbar Scroll Effect
function handleNavbarScroll() {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// Smooth Scroll with Offset
function smoothScrollTo(target) {
    const targetElement = document.querySelector(target);
    if (targetElement) {
        const offsetTop = targetElement.offsetTop - 80; // Account for fixed navbar
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// Enhanced Intersection Observer for Animations
function initScrollAnimations() {
    const animationOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // Special animations for different elements
                if (entry.target.classList.contains('stat-number')) {
                    animateCounter(entry.target);
                }
                
                if (entry.target.classList.contains('course-card')) {
                    entry.target.style.animationDelay = `${entry.target.dataset.delay || 0}ms`;
                }
                
                observer.unobserve(entry.target);
            }
        });
    }, animationOptions);

    // Observe elements for animation
    const animatedElements = document.querySelectorAll('.course-card, .feature-card, .branch-card, .stat-number, .testimonial-card');
    animatedElements.forEach(el => observer.observe(el));
}

// Counter Animation
function animateCounter(element) {
    const target = parseInt(element.textContent);
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// Enhanced Testimonial Carousel
function showTestimonial(index) {
    testimonialCards.forEach((card, i) => {
        card.style.display = i === index ? 'block' : 'none';
        card.style.animation = i === index ? 'fadeInUp 0.6s ease-out' : 'none';
    });
    
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    currentTestimonial = index;
}

function nextTestimonial() {
    currentTestimonial = (currentTestimonial + 1) % testimonialCards.length;
    showTestimonial(currentTestimonial);
}

function prevTestimonial() {
    currentTestimonial = (currentTestimonial - 1 + testimonialCards.length) % testimonialCards.length;
    showTestimonial(currentTestimonial);
}

// Auto-rotate testimonials
let testimonialInterval = setInterval(nextTestimonial, 5000);

function pauseTestimonialRotation() {
    clearInterval(testimonialInterval);
}

function resumeTestimonialRotation() {
    testimonialInterval = setInterval(nextTestimonial, 5000);
}

// Enhanced Modal Management
function openModal() {
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
    
    // Focus management
    const firstInput = modal.querySelector('input, textarea, select');
    if (firstInput) {
        setTimeout(() => firstInput.focus(), 100);
    }
    
    // Add escape key listener
    document.addEventListener('keydown', handleModalEscape);
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
    document.removeEventListener('keydown', handleModalEscape);
    
    // Reset form if needed
    if (!formSubmitted) {
        contactForm.reset();
        clearFormErrors();
    }
}

function handleModalEscape(e) {
    if (e.key === 'Escape') {
        closeModal();
    }
}

// Enhanced Form Validation and Submission with Real-time Features
function validateForm() {
    const formData = new FormData(contactForm);
    const errors = {};
    
    // Enhanced validation rules with stricter patterns
    const rules = {
        name: {
            required: true,
            minLength: 2,
            maxLength: 50,
            pattern: /^[a-zA-Z\s]+$/
        },
        email: {
            required: true,
            pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        },
        phone: {
            required: true,
            pattern: /^[\d\s\-\+\(\)]{10,15}$/,
            exactLength: 10
        },
        course: {
            required: true
        },
        consent: {
            required: true
        },
        message: {
            required: true,
            minLength: 10,
            maxLength: 500
        }
    };
    
    // Validate each field
    Object.keys(rules).forEach(field => {
        const value = formData.get(field)?.trim();
        const rule = rules[field];
        
        if (rule.required && !value) {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
        } else if (value) {
            if (rule.minLength && value.length < rule.minLength) {
                errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be at least ${rule.minLength} characters`;
            }
            if (rule.maxLength && value.length > rule.maxLength) {
                errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be no more than ${rule.maxLength} characters`;
            }
            if (rule.exactLength && value.length !== rule.exactLength) {
                errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} must be exactly ${rule.exactLength} digits`;
            }
            if (rule.pattern && !rule.pattern.test(value)) {
                errors[field] = getPatternErrorMessage(field);
            }
        }
    });
    
    return errors;
}

function getPatternErrorMessage(field) {
    const messages = {
        name: 'Please use only letters and spaces',
        email: 'Please enter a valid email address',
        phone: 'Please enter a valid 10-digit phone number',
    };
    return messages[field] || 'Invalid format';
}

function displayFormErrors(errors) {
    clearFormErrors();
    
    Object.keys(errors).forEach(field => {
        const input = contactForm.querySelector(`[name="${field}"]`);
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.textContent = errors[field];
        errorDiv.style.color = '#ef4444';
        errorDiv.style.fontSize = '0.875rem';
        errorDiv.style.marginTop = '0.25rem';
        
        input.parentNode.appendChild(errorDiv);
        input.style.borderColor = '#ef4444';
    });
}

function clearFormErrors() {
    const errorMessages = contactForm.querySelectorAll('.error-message');
    errorMessages.forEach(error => error.remove());
    
    const inputs = contactForm.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.style.borderColor = '';
    });
    
    // Hide form status
    hideFormStatus();
}

async function submitForm(e) {
    e.preventDefault();
    console.log('Form submission triggered');
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
        console.log('Form validation failed:', errors);
        displayFormErrors(errors);
        return;
    }
    
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    
    // Show loading state
    submitBtn.innerHTML = '<span class="loading"></span> Sending...';
    submitBtn.disabled = true;
    
    // Show form status
    showFormStatus('Sending your enquiry to Formspree...', 'loading');
    
    try {
        // Prepare Formspree submission data
        const formData = new FormData(contactForm);
        const formObject = Object.fromEntries(formData.entries());
        
        // Clean phone number for submission
        formObject.phone = formObject.phone.replace(/\D/g, '');
        
        // Submit to Formspree
        const response = await fetch('https://formspree.io/f/xanbglel', {
            method: 'POST',
            headers: {
                'Accept': 'application/json'
            },
            body: JSON.stringify(formObject)
        });
        
        console.log('Form submission response:', response);
        
        if (response.ok) {
            // Success handling
            formSubmitted = true;
            showFormStatus('Thank you! Your enquiry has been submitted successfully. We\'ll contact you within 24 hours.', 'success');
            
            // Track conversion (placeholder for analytics)
            if (typeof gtag !== 'undefined') {
                gtag('event', 'conversion', {
                    'send_to': 'AW-CONVERSION_ID/CONVERSION_LABEL'
                });
            }
            
            // Auto-close modal after 3 seconds
            setTimeout(() => {
                contactForm.reset();
                updateCharCount();
                closeModal();
                formSubmitted = false;
            }, 3000);
            
        } else {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to submit form');
        }
        
    } catch (error) {
        console.error('Form submission error:', error);
        showFormStatus(`Failed to send message: ${error.message || 'Please try again later'}`, 'error');
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

function showFormStatus(message, type) {
    const statusDiv = document.getElementById('form-status') || createFormStatusDiv();
    statusDiv.textContent = message;
    statusDiv.className = `form-status ${type}`;
    statusDiv.style.display = 'block';
    
    // Style based on type
    const colors = {
        loading: '#3b82f6',
        success: '#10b981',
        error: '#ef4444'
    };
    statusDiv.style.cssText = `
        padding: 1rem;
        border-radius: 0.5rem;
        text-align: center;
        margin-bottom: 1rem;
        color: white;
        background: ${colors[type]};
        display: block;
    `;
}

function hideFormStatus() {
    const statusDiv = document.getElementById('form-status');
    if (statusDiv) statusDiv.style.display = 'none';
}

function createFormStatusDiv() {
    const statusDiv = document.createElement('div');
    statusDiv.id = 'form-status';
    contactForm.insertBefore(statusDiv, contactForm.firstChild);
    return statusDiv;
}

// Enhanced Phone Number Formatting with Real-time Validation
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length > 10) {
        value = value.slice(0, 10);
    }
    
    // Format as user types
    if (value.length > 6) {
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (value.length > 3) {
        value = value.replace(/(\d{3})(\d{0,3})/, '($1) $2');
    } else if (value.length > 0) {
        value = value.replace(/(\d{0,3})/, '($1');
    }
    
    input.value = value;
    
    // Real-time validation
    const phoneError = document.getElementById('phone-error');
    if (value.replace(/\D/g, '').length === 10) {
        input.classList.remove('error');
        if (phoneError) phoneError.style.display = 'none';
    }
}

// Character count for message field
function updateCharCount() {
    const textarea = contactForm?.querySelector('textarea[name="message"]');
    if (!textarea) return;
    
    const charCount = textarea.value.length;
    let charDisplay = textarea.parentElement.querySelector('.char-count');
    
    if (!charDisplay) {
        charDisplay = document.createElement('div');
        charDisplay.className = 'char-count';
        charDisplay.style.cssText = 'font-size: 0.75rem; color: var(--text-light); text-align: right; margin-top: 0.25rem;';
        textarea.parentElement.appendChild(charDisplay);
    }
    
    charDisplay.textContent = `${charCount}/500`;
    
    if (charCount > 450) {
        charDisplay.style.color = '#ef4444';
    } else {
        charDisplay.style.color = 'var(--text-light)';
    }
}

// Real-time form validation setup
function setupRealTimeValidation() {
    if (!contactForm) return;
    
    // Real-time validation on input
    contactForm.addEventListener('input', (e) => {
        const field = e.target;
        
        // Phone formatting
        if (field.name === 'phone') {
            formatPhoneNumber(field);
        }
        
        // Character count for message
        if (field.name === 'message') {
            updateCharCount();
        }
        
        // Clear error on input
        if (field.classList.contains('error')) {
            const errorElement = field.parentNode.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
                field.style.borderColor = '';
                field.classList.remove('error');
            }
        }
    });
    
    // Validate on blur for better UX
    contactForm.addEventListener('blur', (e) => {
        const field = e.target;
        if (field.name) {
            const errors = validateForm();
            if (errors[field.name]) {
                displayFormErrors({ [field.name]: errors[field.name] });
            }
        }
    }, true);
}

// Lazy Loading for Images
function initLazyLoading() {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.add('loaded');
                observer.unobserve(img);
            }
        });
    });
    
    const lazyImages = document.querySelectorAll('img[data-src]');
    lazyImages.forEach(img => imageObserver.observe(img));
}

// Enhanced Scroll Performance
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Preload Critical Resources
function preloadCriticalResources() {
    const criticalImages = [
        'assets/hero-students.jpg',
        'assets/about-classroom.jpg',
        'assets/course-jee.jpg',
        'assets/course-neet.jpg',
        'assets/course-boards.jpg'
    ];
    
    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

// Enhanced Error Handling
function handleImageError(img) {
    img.onerror = null;
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0xMDAgMTMzLjMzTDY2LjY2NjcgMTAwTDEwMCA2Ni42NjY3TDEzMy4zMzMgMTAwTDEwMCAxMzMuMzNaIiBmaWxsPSIjOUMzMzU1Ii8+Cjwvc3ZnPg==';
    img.alt = 'Image loading failed';
}

// Accessibility Improvements
function initAccessibility() {
    // Skip to main content link
    const skipLink = document.createElement('a');
    skipLink.href = '#main-content';
    skipLink.textContent = 'Skip to main content';
    skipLink.className = 'skip-link';
    skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 0;
        background: var(--primary-color);
        color: white;
        padding: 0.5rem 1rem;
        z-index: 9999;
        transition: top 0.3s;
    `;
    skipLink.addEventListener('focus', () => skipLink.style.top = '0');
    skipLink.addEventListener('blur', () => skipLink.style.top = '-40px');
    document.body.insertBefore(skipLink, document.body.firstChild);
    
    // Keyboard navigation for course cards
    const courseCards = document.querySelectorAll('.course-card');
    courseCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const link = card.querySelector('a');
                if (link) link.click();
            }
        });
    });
}

// Performance Monitoring
function initPerformanceMonitoring() {
    // Track page load time
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`Page loaded in ${Math.round(loadTime)}ms`);
        
        // Send to analytics (placeholder)
        if (typeof gtag !== 'undefined') {
            gtag('event', 'timing_complete', {
                'name': 'page_load',
                'value': Math.round(loadTime),
                'event_category': 'performance'
            });
        }
    });
}

// Initialize All Features
document.addEventListener('DOMContentLoaded', function() {
    // Basic setup
    initScrollAnimations();
    initLazyLoading();
    preloadCriticalResources();
    initAccessibility();
    initPerformanceMonitoring();
    
    // Navbar setup
    handleNavbarScroll();
    window.addEventListener('scroll', debounce(handleNavbarScroll, 10));
    
    // Navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                closeMobileMenu();
                smoothScrollTo(href);
            }
        });
    });
    
    // Mobile menu
    hamburger?.addEventListener('click', toggleMobileMenu);
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!navbar.contains(e.target)) {
            closeMobileMenu();
        }
    });
    
    // Modal setup
    contactBtn?.addEventListener('click', openModal);
    closeBtn?.addEventListener('click', closeModal);
    
    // Modal backdrop click
    modal?.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });
    
    // Testimonial controls
    prevBtn?.addEventListener('click', () => {
        prevTestimonial();
        pauseTestimonialRotation();
        resumeTestimonialRotation();
    });
    
    nextBtn?.addEventListener('click', () => {
        nextTestimonial();
        pauseTestimonialRotation();
        resumeTestimonialRotation();
    });
    
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            showTestimonial(index);
            pauseTestimonialRotation();
            resumeTestimonialRotation();
        });
    });
    
    // Testimonial hover pause
    const testimonialContainer = document.querySelector('.testimonials');
    if (testimonialContainer) {
        testimonialContainer.addEventListener('mouseenter', pauseTestimonialRotation);
        testimonialContainer.addEventListener('mouseleave', resumeTestimonialRotation);
    }
    
    // Form setup with enhanced debugging
    if (contactForm) {
        console.log('Contact form found:', contactForm);
        contactForm.addEventListener('submit', submitForm);
    } else {
        console.error('Contact form not found!');
    }
    
    // Phone number formatting
    const phoneInput = contactForm?.querySelector('input[name="phone"]');
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => formatPhoneNumber(e.target));
    }
    
    // Real-time form validation
    const formInputs = contactForm?.querySelectorAll('input, textarea, select');
    formInputs?.forEach(input => {
        input.addEventListener('blur', () => {
            const errors = validateForm();
            if (errors[input.name]) {
                displayFormErrors({ [input.name]: errors[input.name] });
            } else {
                const errorDiv = input.parentNode.querySelector('.error-message');
                if (errorDiv) errorDiv.remove();
                input.style.borderColor = '';
            }
        });
    });
    
    // Initialize testimonials
    if (testimonialCards.length > 0) {
        showTestimonial(0);
    }
    
    // Handle URL parameters for branch selection
    const urlParams = new URLSearchParams(window.location.search);
    const branch = urlParams.get('branch');
    if (branch) {
        const branchSelect = contactForm?.querySelector('select[name="branch"]');
        if (branchSelect) {
            branchSelect.value = branch;
        }
    }
    
    // Handle scroll restoration
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    
    // Preload Google Maps for branches page
    if (window.location.pathname.includes('branches.html')) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY&callback=initMap`;
        script.defer = true;
        document.head.appendChild(script);
    }
});

// Service Worker Registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('SW registered'))
            .catch(registrationError => console.log('SW registration failed'));
    });
}

// Export functions for testing
window.ThakurAcademy = {
    openModal,
    closeModal,
    nextTestimonial,
    prevTestimonial,
    validateForm,
    formatPhoneNumber
};
/* ============================================
   GÜLBAHÇE - Interactive JavaScript
   Features: Smooth scroll, Active nav, Scroll animations,
             Mobile menu, Button hover effects
   ============================================ */

// ========== DOM ELEMENTS ==========
const navbar = document.getElementById('navbar');
const navMenu = document.getElementById('navMenu');
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section, .hero');
const revealElements = document.querySelectorAll('.reveal');

// ========== MOBILE MENU TOGGLE ==========
function toggleMobileMenu() {
    navMenu.classList.toggle('open');
    mobileToggle.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('open') ? 'hidden' : '';
}

mobileToggle.addEventListener('click', toggleMobileMenu);

// Close mobile menu when a nav link is clicked
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('open')) {
            toggleMobileMenu();
        }
    });
});

// Close menu on outside click
document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && 
        !navMenu.contains(e.target) && 
        !mobileToggle.contains(e.target)) {
        toggleMobileMenu();
    }
});

// ========== NAVBAR SCROLL EFFECT ==========
function handleNavbarScroll() {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
}

// ========== ACTIVE SECTION HIGHLIGHTING ==========
function updateActiveNav() {
    const scrollPos = window.scrollY + window.innerHeight / 3;

    // Get all sections that have a corresponding nav link
    const allSections = document.querySelectorAll('[id]');
    
    let currentSection = '';

    allSections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('data-section') === currentSection) {
            link.classList.add('active');
        }
    });
}

// ========== SCROLL REVEAL ANIMATIONS ==========
function revealOnScroll() {
    const windowHeight = window.innerHeight;
    const revealPoint = 100;

    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;

        if (elementTop < windowHeight - revealPoint) {
            element.classList.add('active');
        }
    });
}

// ========== SMOOTH SCROLLING ==========
// Enhanced smooth scroll for nav links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            const navHeight = navbar.offsetHeight;
            const targetPosition = targetElement.offsetTop - navHeight - 10;

            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// ========== BUTTON HOVER EFFECTS ==========
// Add ripple/glow effect on CTA buttons
const ctaButtons = document.querySelectorAll('.btn-primary, .nav-cta');

ctaButtons.forEach(button => {
    button.addEventListener('mouseenter', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        this.style.setProperty('--mouse-x', `${x}px`);
        this.style.setProperty('--mouse-y', `${y}px`);
    });
});

// ========== GLASS CARD TILT EFFECT ==========
// Subtle tilt on glass cards for interactivity
const glassCards = document.querySelectorAll('.glass-card');

glassCards.forEach(card => {
    card.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        
        this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
    });

    card.addEventListener('mouseleave', function () {
        this.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
    });
});

// ========== PARALLAX FOR HERO GLOWS ==========
function parallaxGlows() {
    const scrolled = window.scrollY;
    const glows = document.querySelectorAll('.hero-glow');
    
    glows.forEach((glow, index) => {
        const speed = (index + 1) * 0.3;
        glow.style.transform = `translateY(${scrolled * speed}px)`;
    });
}

// ========== COUNTER ANIMATION ==========
// Animate stat numbers when they come into view
function animateCounters() {
    const statNumbers = document.querySelectorAll('.stat-number');
    
    statNumbers.forEach(stat => {
        const rect = stat.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;
        
        if (isVisible && !stat.classList.contains('animated')) {
            stat.classList.add('animated');
            const text = stat.textContent;
            const number = parseInt(text.replace(/[^0-9]/g, ''));
            const suffix = text.replace(/[0-9]/g, '');
            
            let current = 0;
            const increment = number / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= number) {
                    current = number;
                    clearInterval(timer);
                }
                stat.textContent = Math.floor(current) + suffix;
            }, 30);
        }
    });
}

// ========== PERFORMANCE UTILITIES ==========
// Throttle function for scroll events
function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Debounce function for resize events
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

// Intersection Observer for better performance
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
};

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
            revealObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

// Counter observer for animation
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('animated')) {
            entry.target.classList.add('animated');
            const text = entry.target.textContent;
            const number = parseInt(text.replace(/[^0-9]/g, ''));
            const suffix = text.replace(/[0-9]/g, '');
            
            let current = 0;
            const increment = number / 50;
            const timer = setInterval(() => {
                current += increment;
                if (current >= number) {
                    current = number;
                    clearInterval(timer);
                }
                entry.target.textContent = Math.floor(current) + suffix;
            }, 30);
        }
    });
}, observerOptions);

// ========== SCROLL EVENT LISTENER ==========
// Optimized scroll handler with throttling
const onScroll = throttle(() => {
    handleNavbarScroll();
    updateActiveNav();
}, 16); // ~60fps

window.addEventListener('scroll', onScroll, { passive: true });

// ========== INITIAL CALLS ==========
// Run on page load with optimized initialization
document.addEventListener('DOMContentLoaded', () => {
    // Observe reveal elements
    document.querySelectorAll('.reveal').forEach(el => {
        revealObserver.observe(el);
    });
    
    // Observe counter elements
    document.querySelectorAll('.stat-number').forEach(el => {
        counterObserver.observe(el);
    });
    
    // Initial calls
    handleNavbarScroll();
    updateActiveNav();
    
    // Add a small delay for initial animations
    setTimeout(() => {
        revealOnScroll();
    }, 200);
});

// ========== KEYBOARD NAVIGATION ==========
// ESC key closes mobile menu
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('open')) {
        toggleMobileMenu();
    }
});

// ========== RESIZE HANDLER ==========
// Debounced resize handler for better performance
const handleResize = debounce(() => {
    if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
        toggleMobileMenu();
    }
    // Re-initialize observers for new viewport
    updateActiveNav();
}, 250);

window.addEventListener('resize', handleResize, { passive: true });

// ========== COUNTDOWN LOGIC ==========
let countdownMode = 'deadline'; // 'deadline' or 'registration'

function updateCountdown() {
    const now = new Date().getTime();
    const deadlineDate = new Date('September 30, 2026 23:59:59').getTime();
    const registrationStartDate = new Date('September 1, 2026 00:00:00').getTime();
    
    let gap, targetDate, label;
    
    if (countdownMode === 'deadline') {
        gap = deadlineDate - now;
        targetDate = deadlineDate;
        
        if (gap <= 0) {
            // Switch to registration countdown
            countdownMode = 'registration';
            updateCountdownLabel('KAYITLARIN BAŞLAMASINA');
            return;
        }
    } else if (countdownMode === 'registration') {
        gap = registrationStartDate - now;
        targetDate = registrationStartDate;
        
        if (gap <= 0) {
            // Registration started
            updateCountdownLabel('KAYITLAR BAŞLADI!');
            document.querySelectorAll('.countdown-number').forEach(el => el.innerText = '00');
            return;
        }
    }

    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const d = Math.floor(gap / day);
    const h = Math.floor((gap % day) / hour);
    const m = Math.floor((gap % hour) / minute);
    const s = Math.floor((gap % minute) / second);

    // Update numbers
    document.getElementById('days').innerText = d < 10 ? '0' + d : d;
    document.getElementById('hours').innerText = h < 10 ? '0' + h : h;
    document.getElementById('minutes').innerText = m < 10 ? '0' + m : m;
    document.getElementById('seconds').innerText = s < 10 ? '0' + s : s;

    // Update Progress Rings (circumference for r=28 is ~175.9)
    const circ = 176;
    
    const daysRing = document.getElementById('days-ring');
    const hoursRing = document.getElementById('hours-ring');
    const minutesRing = document.getElementById('minutes-ring');
    const secondsRing = document.getElementById('seconds-ring');

    if (daysRing) daysRing.style.strokeDashoffset = circ - (Math.min(d, 365) / 365) * circ;
    if (hoursRing) hoursRing.style.strokeDashoffset = circ - (h / 24) * circ;
    if (minutesRing) minutesRing.style.strokeDashoffset = circ - (m / 60) * circ;
    if (secondsRing) secondsRing.style.strokeDashoffset = circ - (s / 60) * circ;
}

function updateCountdownLabel(text) {
    const label = document.querySelector('.countdown-label');
    if (label) {
        label.textContent = text;
    }
}

// Initial call and set interval
if (document.getElementById('days')) {
    setInterval(updateCountdown, 1000);
    updateCountdown();
}

// ========== DYNAMIC PARTICLE SWARM (OPTIMIZED) ==========
const particleContainer = document.getElementById('particle-container');
const particles = [];
const particleCount = 100; // Reduced from 150 for better performance
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let isMouseActive = false;
let animationId = null;

if (particleContainer) {
    // Generate particles with object pooling
    for (let i = 0; i < particleCount; i++) {
        const dot = document.createElement('div');
        dot.className = 'dot';
        
        const homeX = Math.random() * window.innerWidth;
        const homeY = Math.random() * window.innerHeight;
        
        dot.style.left = `${homeX}px`;
        dot.style.top = `${homeY}px`;
        
        particleContainer.appendChild(dot);
        
        particles.push({
            el: dot,
            x: homeX,
            y: homeY,
            homeX: homeX,
            homeY: homeY,
            offX: (Math.random() - 0.5) * 150,
            offY: (Math.random() - 0.5) * 150,
            ease: 0.03 + Math.random() * 0.05
        });
    }

    // Throttled mouse move handler
    const handleMouseMove = throttle((e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMouseActive = true;
    }, 16); // ~60fps

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', () => {
        isMouseActive = false;
    });

    // Optimized animation with early exit for hidden tabs
    function animateParticles() {
        // Don't animate if page is not visible
        if (document.hidden) {
            animationId = requestAnimationFrame(animateParticles);
            return;
        }

        particles.forEach(p => {
            let targetX = p.homeX;
            let targetY = p.homeY;

            if (isMouseActive) {
                const dx = mouseX - p.homeX;
                const dy = mouseY - p.homeY;
                const dist = Math.sqrt(dx*dx + dy*dy);

                if (dist < 500) {
                    const strength = 1 - (dist / 500);
                    targetX = p.homeX + (mouseX - p.homeX + p.offX) * strength;
                    targetY = p.homeY + (mouseY - p.homeY + p.offY) * strength;
                }
            }

            p.x += (targetX - p.x) * p.ease;
            p.y += (targetY - p.y) * p.ease;

            // Use transform3d for GPU acceleration
            p.el.style.transform = `translate3d(${p.x - p.homeX}px, ${p.y - p.homeY}px, 0)`;
        });
        
        const mouseGlow = document.querySelector('.hero-glow-3');
        if (mouseGlow) {
            mouseGlow.style.transform = `translate3d(${mouseX - 300}px, ${mouseY - 300}px, 0)`;
        }

        animationId = requestAnimationFrame(animateParticles);
    }

    // Start animation
    animateParticles();

    // Cleanup on page unload
    window.addEventListener('beforeunload', () => {
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    });
}

// ========== IMAGE SLIDER ==========
let currentSlideIndex = 0;
const slides = document.querySelectorAll('.slide');
const dots = document.querySelectorAll('.dot');

function changeSlide(direction) {
    let newIndex = currentSlideIndex + direction;
    
    // Handle backward navigation (go back 2 times when reaching start)
    if (newIndex < 0) {
        newIndex = 0; // Go to first slide instead of looping
    }
    // Handle forward navigation (stop at last slide instead of looping)
    else if (newIndex >= slides.length) {
        newIndex = slides.length - 1; // Stay at last slide
    }
    
    showSlide(newIndex);
}

function currentSlide(index) {
    showSlide(index);
}

function showSlide(index) {
    // Remove active class from all slides and dots
    slides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (dots[i]) dots[i].classList.remove('active');
    });
    
    // Add active class to current slide and dot
    currentSlideIndex = index;
    if (slides[index]) slides[index].classList.add('active');
    if (dots[index]) dots[index].classList.add('active');
}

// Keyboard navigation for slider
document.addEventListener('keydown', (e) => {
    // Only if slider is in viewport
    const slider = document.querySelector('.image-slider');
    if (slider) {
        const rect = slider.getBoundingClientRect();
        if (rect.top >= 0 && rect.bottom <= window.innerHeight) {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                changeSlide(-1);
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                changeSlide(1);
            }
        }
    }
});

// ========== FİZİKİ ORTAM CAROUSEL ==========
let carouselIndex = 0;
const carouselSlides = document.querySelectorAll('.carousel-slide');
const carouselDots = document.querySelectorAll('.carousel-dots .dot');

function moveCarousel(direction) {
    carouselIndex += direction;
    
    if (carouselIndex >= carouselSlides.length) {
        carouselIndex = 0;
    } else if (carouselIndex < 0) {
        carouselIndex = carouselSlides.length - 1;
    }
    
    updateCarousel();
}

function goToSlide(index) {
    carouselIndex = index;
    updateCarousel();
}

function updateCarousel() {
    // Remove active class from all slides and dots
    carouselSlides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (carouselDots[i]) carouselDots[i].classList.remove('active');
    });
    
    // Add active class to current slide and dot
    if (carouselSlides[carouselIndex]) carouselSlides[carouselIndex].classList.add('active');
    if (carouselDots[carouselIndex]) carouselDots[carouselIndex].classList.add('active');
}

// Auto-play carousel
setInterval(() => {
    if (carouselSlides.length > 0) {
        moveCarousel(1);
    }
}, 5000);

// ========== SOSYAL PROGRAMLAR CAROUSEL ==========
let sosyalCarouselIndex = 0;
const sosyalCarouselSlides = document.querySelectorAll('#sosyalCarousel .carousel-slide');
const sosyalCarouselDots = document.querySelectorAll('#sosyalCarousel + .carousel-nav .dot');

function moveSosyalCarousel(direction) {
    sosyalCarouselIndex += direction;
    
    if (sosyalCarouselIndex >= sosyalCarouselSlides.length) {
        sosyalCarouselIndex = 0;
    } else if (sosyalCarouselIndex < 0) {
        sosyalCarouselIndex = sosyalCarouselSlides.length - 1;
    }
    
    updateSosyalCarousel();
}

function goToSosyalSlide(index) {
    sosyalCarouselIndex = index;
    updateSosyalCarousel();
}

function updateSosyalCarousel() {
    // Remove active class from all slides and dots
    sosyalCarouselSlides.forEach((slide, i) => {
        slide.classList.remove('active');
        if (sosyalCarouselDots[i]) sosyalCarouselDots[i].classList.remove('active');
    });
    
    // Add active class to current slide and dot
    if (sosyalCarouselSlides[sosyalCarouselIndex]) sosyalCarouselSlides[sosyalCarouselIndex].classList.add('active');
    if (sosyalCarouselDots[sosyalCarouselIndex]) sosyalCarouselDots[sosyalCarouselIndex].classList.add('active');
}

// Auto-play sosyal carousel
setInterval(() => {
    if (sosyalCarouselSlides.length > 0) {
        moveSosyalCarousel(1);
    }
}, 5000);

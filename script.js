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

// ========== SCROLL EVENT LISTENER ==========
// Throttle scroll events for performance
let ticking = false;

function onScroll() {
    if (!ticking) {
        window.requestAnimationFrame(() => {
            handleNavbarScroll();
            updateActiveNav();
            revealOnScroll();
            parallaxGlows();
            animateCounters();
            ticking = false;
        });
        ticking = true;
    }
}

window.addEventListener('scroll', onScroll);

// ========== INITIAL CALLS ==========
// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    handleNavbarScroll();
    updateActiveNav();
    revealOnScroll();
    
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
// Close mobile menu on resize to desktop
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('open')) {
        toggleMobileMenu();
    }
});

// ========== COUNTDOWN LOGIC ==========
function updateCountdown() {
    // Target date: June 20, 2026 (approximate YKS date)
    const targetDate = new Date('June 20, 2026 00:00:00').getTime();
    const now = new Date().getTime();
    const gap = targetDate - now;

    if (gap <= 0) {
        // If countdown finished
        document.querySelectorAll('.countdown-number').forEach(el => el.innerText = '00');
        return;
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

// Initial call and set interval
if (document.getElementById('days')) {
    setInterval(updateCountdown, 1000);
    updateCountdown();
}

// ========== DYNAMIC PARTICLE SWARM ==========
const particleContainer = document.getElementById('particle-container');
const particles = [];
const particleCount = 150;
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let isMouseActive = false;

if (particleContainer) {
    // Generate particles
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

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        isMouseActive = true;
    });

    window.addEventListener('mouseleave', () => {
        isMouseActive = false;
    });

    function animateParticles() {
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

            p.el.style.transform = `translate3d(${p.x - p.homeX}px, ${p.y - p.homeY}px, 0)`;
        });
        
        const mouseGlow = document.querySelector('.hero-glow-3');
        if (mouseGlow) {
            mouseGlow.style.transform = `translate3d(${mouseX - 300}px, ${mouseY - 300}px, 0)`;
        }

        requestAnimationFrame(animateParticles);
    }

    animateParticles();
}

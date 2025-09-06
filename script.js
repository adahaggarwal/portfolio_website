// Mobile Navigation Toggle
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        
        if (target) {
            const headerOffset = 70;
            const elementPosition = target.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Active navigation link highlighting
window.addEventListener('scroll', () => {
    let current = '';
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionHeight = section.clientHeight;
        if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
            current = section.getAttribute('id');
        }
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Add background to navbar on scroll with enhanced effects
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(248, 250, 252, 0.98)';
        navbar.classList.add('scrolled');
    } else {
        navbar.style.background = 'rgba(248, 250, 252, 0.95)';
        navbar.classList.remove('scrolled');
    }
});

// Enhanced scroll-triggered animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Enhanced element observation with staggered animations
document.querySelectorAll('.project-card, .achievement-card, .skill-icon, .experience-card, .section-title').forEach((el, index) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`;
    observer.observe(el);
});

// Enhanced typing effect for hero subtitle
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.textContent = '';
    const timer = setInterval(() => {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
        } else {
            clearInterval(timer);
        }
    }, speed);
}

// Initialize typing effect
document.addEventListener('DOMContentLoaded', () => {
    const subtitle = document.querySelector('.hero-subtitle');
    if (subtitle) {
        const originalText = subtitle.textContent;
        setTimeout(() => {
            typeWriter(subtitle, originalText, 80);
        }, 1000);
    }
});

// Simple visibility observer (simplified)
const simpleObserverOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const simpleObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, simpleObserverOptions);

// Observe elements for simple visibility
document.querySelectorAll('.project-card, .achievement-card, .skill-icon, .experience-card').forEach(el => {
    el.style.opacity = '0.8';
    el.style.transform = 'translateY(10px)';
    el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    simpleObserver.observe(el);
});

// Skills Carousel Auto-Scroll Functionality
function initSkillsCarousel() {
    const skillsSection = document.getElementById('skills');
    const carousel = document.querySelector('.skills-carousel');
    
    if (!carousel || !skillsSection) return;

    let isCarouselInView = false;

    // Duplicate skills for seamless infinite scroll
    const skillIcons = carousel.querySelectorAll('.skill-icon');
    const skillsArray = Array.from(skillIcons);
    
    // Clone all skills and append them for seamless loop
    skillsArray.forEach(skill => {
        const clone = skill.cloneNode(true);
        carousel.appendChild(clone);
    });

    // Intersection Observer for auto-scroll when in view
    const skillsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                isCarouselInView = true;
                carousel.style.animationPlayState = 'running';
            } else {
                isCarouselInView = false;
                carousel.style.animationPlayState = 'paused';
            }
        });
    }, {
        threshold: 0.3, // Start when 30% of the section is visible
        rootMargin: '0px'
    });

    skillsObserver.observe(skillsSection);

    // Pause animation on hover
    carousel.addEventListener('mouseenter', () => {
        carousel.style.animationPlayState = 'paused';
    });

    // Resume animation when mouse leaves (only if section is in view)
    carousel.addEventListener('mouseleave', () => {
        if (isCarouselInView) {
            carousel.style.animationPlayState = 'running';
        }
    });

    // Touch support for mobile - pause on touch
    let touchStarted = false;

    carousel.addEventListener('touchstart', () => {
        touchStarted = true;
        carousel.style.animationPlayState = 'paused';
    }, { passive: true });

    carousel.addEventListener('touchend', () => {
        if (touchStarted && isCarouselInView) {
            // Resume after a short delay
            setTimeout(() => {
                if (isCarouselInView) {
                    carousel.style.animationPlayState = 'running';
                }
            }, 2000);
        }
        touchStarted = false;
    }, { passive: true });

    // Handle visibility change (when user switches tabs)
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
            carousel.style.animationPlayState = 'paused';
        } else if (isCarouselInView) {
            carousel.style.animationPlayState = 'running';
        }
    });

    console.log('Skills carousel initialized with continuous auto-scroll');
}

// Initialize carousel when DOM is loaded
document.addEventListener('DOMContentLoaded', initSkillsCarousel);

// Contact form handling
const contactForm = document.getElementById('contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const subject = formData.get('subject');
        const message = formData.get('message');
        
        // Create mailto link
        const mailtoLink = `mailto:aggadah21@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`)}`;
        
        // Open email client
        window.location.href = mailtoLink;
        
        // Show success message
        showNotification('Thank you! Your email client will open with the message ready to send.', 'success');
        
        // Reset form
        this.reset();
    });
}

// Enhanced notification system with better animations
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => {
        notification.style.transform = 'translateX(400px) scale(0.8)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <div class="notification-icon">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            </div>
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Enhanced notification styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? 'linear-gradient(135deg, #10B981, #059669)' : type === 'error' ? 'linear-gradient(135deg, #EF4444, #DC2626)' : 'linear-gradient(135deg, #2563EB, #1D4ED8)'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.15);
        z-index: 10000;
        transform: translateX(400px) scale(0.8);
        transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        max-width: 400px;
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.1);
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in with spring effect
    setTimeout(() => {
        notification.style.transform = 'translateX(0) scale(1)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px) scale(0.8)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove with fade out
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px) scale(0.8)';
            notification.style.opacity = '0';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Simplified styles
const additionalStyles = `
    .nav-link.active {
        color: #00D4AA;
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 1rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
    }
    
    .notification-close:hover {
        opacity: 0.7;
    }
`;

// Add the simplified styles to the page
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);

// Enhanced hover effects for project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-10px) scale(1.02)';
        this.style.boxShadow = '0 20px 40px rgba(37, 99, 235, 0.15)';
        
        // Add subtle rotation to tech tags
        this.querySelectorAll('.tech-tag').forEach((tag, index) => {
            setTimeout(() => {
                tag.style.transform = 'translateY(-3px) rotate(2deg)';
            }, index * 50);
        });
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
        this.style.boxShadow = '0 4px 6px rgba(37, 99, 235, 0.05)';
        
        // Reset tech tags
        this.querySelectorAll('.tech-tag').forEach(tag => {
            tag.style.transform = 'translateY(0) rotate(0deg)';
        });
    });
});

// Enhanced button interactions
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('mousedown', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
});

// Add ripple animation CSS
const rippleStyles = `
    @keyframes ripple {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
    
    .btn {
        position: relative;
        overflow: hidden;
    }
`;

const rippleStyleSheet = document.createElement('style');
rippleStyleSheet.textContent = rippleStyles;
document.head.appendChild(rippleStyleSheet);

// Enhanced scroll to top button with progress indicator
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = `
    <svg class="progress-ring" width="50" height="50">
        <circle class="progress-ring-circle" stroke="rgba(37, 99, 235, 0.2)" stroke-width="2" fill="transparent" r="22" cx="25" cy="25"/>
        <circle class="progress-ring-progress" stroke="#2563EB" stroke-width="2" fill="transparent" r="22" cx="25" cy="25"/>
    </svg>
    <i class="fas fa-arrow-up"></i>
`;
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.9);
    color: #2563EB;
    border: none;
    border-radius: 50%;
    font-size: 1.2rem;
    cursor: pointer;
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(37, 99, 235, 0.15);
    backdrop-filter: blur(10px);
`;

// Style the progress ring
const progressRingStyles = `
    .progress-ring {
        position: absolute;
        top: 0;
        left: 0;
        transform: rotate(-90deg);
    }
    
    .progress-ring-circle {
        transition: stroke-dasharray 0.3s ease;
    }
    
    .progress-ring-progress {
        transition: stroke-dasharray 0.3s ease;
        stroke-dasharray: 0 138;
    }
    
    .scroll-to-top i {
        position: relative;
        z-index: 1;
    }
`;

const progressStyleSheet = document.createElement('style');
progressStyleSheet.textContent = progressRingStyles;
document.head.appendChild(progressStyleSheet);

document.body.appendChild(scrollToTopBtn);

// Enhanced scroll progress and show/hide button
window.addEventListener('scroll', () => {
    const scrollPercent = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
    const circumference = 2 * Math.PI * 22;
    const strokeDasharray = `${(scrollPercent / 100) * circumference} ${circumference}`;
    
    const progressCircle = scrollToTopBtn.querySelector('.progress-ring-progress');
    if (progressCircle) {
        progressCircle.style.strokeDasharray = strokeDasharray;
    }
    
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
        scrollToTopBtn.style.transform = 'scale(1)';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
        scrollToTopBtn.style.transform = 'scale(0.8)';
    }
});

// Enhanced hover effects for scroll to top button
scrollToTopBtn.addEventListener('mouseenter', () => {
    scrollToTopBtn.style.background = 'rgba(37, 99, 235, 0.1)';
    scrollToTopBtn.style.transform = 'scale(1.1)';
    scrollToTopBtn.style.boxShadow = '0 8px 20px rgba(37, 99, 235, 0.25)';
});

scrollToTopBtn.addEventListener('mouseleave', () => {
    scrollToTopBtn.style.background = 'rgba(255, 255, 255, 0.9)';
    scrollToTopBtn.style.transform = 'scale(1)';
    scrollToTopBtn.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.15)';
});

// Preload images function (if you add images later)
function preloadImages(urls) {
    urls.forEach(url => {
        const img = new Image();
        img.src = url;
    });
}

// // Add text reveal animation
// function revealText() {
//     const textElements = document.querySelectorAll('.hero-description, .about-text p');
    
//     textElements.forEach(element => {
//         const text = element.textContent;
//         element.innerHTML = '';
        
//         text.split('').forEach((char, index) => {
//             const span = document.createElement('span');
//             span.textContent = char === ' ' ? '\u00A0' : char;
//             span.style.opacity = '0';
//             span.style.animation = `fadeInChar 0.05s ease forwards ${index * 0.02}s`;
//             element.appendChild(span);
//         });
//     });
// }

// Add fade in character animation
const fadeInCharStyles = `
    @keyframes fadeInChar {
        to {
            opacity: 1;
        }
    }
`;

const fadeInCharStyleSheet = document.createElement('style');
fadeInCharStyleSheet.textContent = fadeInCharStyles;
document.head.appendChild(fadeInCharStyleSheet);

// Text reveal disabled

// Particle effects disabled for better performance

console.log('Portfolio website loaded successfully!');
console.log('Created by Adah Aggarwal - Flutter & Mobile App Developer');
console.log('Skills carousel initialized with auto-scroll functionality');

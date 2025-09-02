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

// Add background to navbar on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(10, 14, 26, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 14, 26, 0.95)';
    }
});

// Simple visibility observer (simplified)
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for simple visibility
document.querySelectorAll('.project-card, .achievement-card, .skill-icon, .timeline-item').forEach(el => {
    el.style.opacity = '0.8';
    el.style.transform = 'translateY(10px)';
    el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    observer.observe(el);
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

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-message">${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add notification styles
    notification.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === 'success' ? '#10B981' : type === 'error' ? '#EF4444' : '#00D4AA'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 25px rgba(0,0,0,0.2);
        z-index: 10000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        max-width: 400px;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.transform = 'translateX(400px)';
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

// Simplified hover effects for project cards
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});

// Simplified button click feedback
document.querySelectorAll('.btn').forEach(button => {
    button.addEventListener('click', function(e) {
        // Simple scale effect
        this.style.transform = 'scale(0.98)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
});

// Add scroll to top button
const scrollToTopBtn = document.createElement('button');
scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
scrollToTopBtn.className = 'scroll-to-top';
scrollToTopBtn.style.cssText = `
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 50px;
    height: 50px;
    background: #00D4AA;
    color: white;
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
`;

document.body.appendChild(scrollToTopBtn);

// Show/hide scroll to top button
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        scrollToTopBtn.style.opacity = '1';
        scrollToTopBtn.style.visibility = 'visible';
    } else {
        scrollToTopBtn.style.opacity = '0';
        scrollToTopBtn.style.visibility = 'hidden';
    }
});

// Scroll to top functionality
scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Simplified hover effect for scroll to top button
scrollToTopBtn.addEventListener('mouseenter', () => {
    scrollToTopBtn.style.background = '#4EECD9';
});

scrollToTopBtn.addEventListener('mouseleave', () => {
    scrollToTopBtn.style.background = '#00D4AA';
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

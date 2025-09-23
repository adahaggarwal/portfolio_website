// Modern Portfolio JavaScript
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupScrollAnimations();
        this.setupNavigation();
        this.setupContactForm();
        this.setupScrollProgress();
        this.setupBackToTop();
        this.setupSkillBars();
        this.setupTypingEffect();
        this.setupParticles();
        
        // Setup projects after a short delay to ensure DOM is ready
        setTimeout(() => {
            this.setupProjectFilters();
        }, 100);
    }

    setupEventListeners() {
        window.addEventListener('load', () => {
            this.hideLoader();
            this.animateOnLoad();
        });

        window.addEventListener('scroll', () => {
            this.handleScroll();
        });

        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    setupNavigation() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.getElementById('navMenu');
        const navLinks = document.querySelectorAll('.nav-link');

        // Mobile menu toggle
        navToggle?.addEventListener('click', () => {
            navToggle.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close mobile menu when clicking on links
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navToggle?.classList.remove('active');
                navMenu.classList.remove('active');
            });
        });

        // Active link highlighting
        this.updateActiveNavLink();
    }

    setupScrollAnimations() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observe all animated elements
        const animatedElements = document.querySelectorAll(
            '.fade-in, .slide-in-left, .slide-in-right, .scale-in, .stagger-item'
        );

        animatedElements.forEach(el => {
            observer.observe(el);
        });
    }

    setupProjectFilters() {
        // Wait for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupFeaturedProjects();
                this.setupProjectsModal();
            });
        } else {
            this.setupFeaturedProjects();
            this.setupProjectsModal();
        }
    }

    setupFeaturedProjects() {
        const featuredGrid = document.getElementById('featuredProjects');
        const originalContainer = document.getElementById('originalProjects');
        
        if (!featuredGrid || !originalContainer) {
            console.log('Featured grid or original container not found');
            return;
        }
        
        const allProjectCards = originalContainer.querySelectorAll('.project-card');
        console.log('Found project cards:', allProjectCards.length);
        
        // Clear any existing content
        featuredGrid.innerHTML = '';
        
        // Clone first 3 projects to featured section
        const featuredProjects = Array.from(allProjectCards).slice(0, 3);
        featuredProjects.forEach((card, index) => {
            const clonedCard = card.cloneNode(true);
            clonedCard.style.display = 'block';
            clonedCard.style.opacity = '1';
            clonedCard.style.animationDelay = `${index * 0.1}s`;
            featuredGrid.appendChild(clonedCard);
        });

        // Move all projects to modal
        const allProjectsGrid = document.getElementById('allProjects');
        if (allProjectsGrid) {
            allProjectsGrid.innerHTML = '';
            allProjectCards.forEach(card => {
                const movedCard = card.cloneNode(true);
                movedCard.style.display = 'block';
                movedCard.style.opacity = '1';
                allProjectsGrid.appendChild(movedCard);
            });
        }
        
        console.log('Featured projects setup complete');
    }

    setupProjectsModal() {
        const viewAllBtn = document.getElementById('viewAllBtn');
        const modal = document.getElementById('projectsModal');
        const modalClose = document.getElementById('modalClose');
        const modalOverlay = document.getElementById('modalOverlay');

        // Open modal
        viewAllBtn?.addEventListener('click', () => {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                modal.classList.add('active');
            }, 10);
        });

        // Close modal
        const closeModal = () => {
            modal.classList.remove('active');
            setTimeout(() => {
                modal.style.display = 'none';
                document.body.style.overflow = '';
            }, 300);
        };

        modalClose?.addEventListener('click', closeModal);
        modalOverlay?.addEventListener('click', closeModal);

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && modal.classList.contains('active')) {
                closeModal();
            }
        });
    }

    setupContactForm() {
        const form = document.getElementById('contactForm');
        
        form?.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData);
            
            // Create mailto link
            const subject = encodeURIComponent(data.subject);
            const body = encodeURIComponent(
                `Name: ${data.name}\nEmail: ${data.email}\n\nMessage:\n${data.message}`
            );
            const mailtoLink = `mailto:aggadah21@gmail.com?subject=${subject}&body=${body}`;
            
            // Open email client
            window.location.href = mailtoLink;
            
            // Show success message
            this.showNotification('Thank you! Your email client will open with the message.', 'success');
            
            // Reset form
            form.reset();
        });
    }

    setupScrollProgress() {
        const progressBar = document.querySelector('.scroll-progress-bar');
        
        if (progressBar) {
            window.addEventListener('scroll', () => {
                const scrollPercent = (window.pageYOffset / 
                    (document.documentElement.scrollHeight - window.innerHeight)) * 100;
                progressBar.style.width = `${scrollPercent}%`;
            });
        }
    }

    setupBackToTop() {
        const backToTop = document.getElementById('backToTop');
        
        if (backToTop) {
            window.addEventListener('scroll', () => {
                if (window.pageYOffset > 300) {
                    backToTop.classList.add('visible');
                } else {
                    backToTop.classList.remove('visible');
                }
            });

            backToTop.addEventListener('click', (e) => {
                e.preventDefault();
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    setupSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        
        const skillObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const bar = entry.target;
                    const width = bar.style.width;
                    bar.style.width = '0%';
                    
                    setTimeout(() => {
                        bar.style.width = width;
                    }, 500);
                }
            });
        }, { threshold: 0.5 });

        skillBars.forEach(bar => {
            skillObserver.observe(bar);
        });
    }

    setupTypingEffect() {
        const typingElements = document.querySelectorAll('.typing-text');
        
        typingElements.forEach(element => {
            const text = element.textContent;
            element.textContent = '';
            
            let i = 0;
            const typeWriter = () => {
                if (i < text.length) {
                    element.textContent += text.charAt(i);
                    i++;
                    setTimeout(typeWriter, 100);
                }
            };
            
            // Start typing when element is visible
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        typeWriter();
                        observer.unobserve(entry.target);
                    }
                });
            });
            
            observer.observe(element);
        });
    }

    setupParticles() {
        // Create floating particles
        const createParticle = () => {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (Math.random() * 3 + 2) + 's';
            particle.style.opacity = Math.random();
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 5000);
        };

        // Create particles periodically
        setInterval(createParticle, 2000);
    }

    handleScroll() {
        const navbar = document.querySelector('.navbar');
        
        // Add scrolled class to navbar
        if (window.scrollY > 50) {
            navbar?.classList.add('scrolled');
        } else {
            navbar?.classList.remove('scrolled');
        }

        // Update active navigation link
        this.updateActiveNavLink();
    }

    updateActiveNavLink() {
        const sections = document.querySelectorAll('section[id]');
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;
            const sectionHeight = section.clientHeight;
            
            if (sectionTop <= 100 && sectionTop + sectionHeight > 100) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    handleResize() {
        // Handle responsive changes
        const navMenu = document.getElementById('navMenu');
        const navToggle = document.getElementById('navToggle');
        
        if (window.innerWidth > 768) {
            navMenu?.classList.remove('active');
            navToggle?.classList.remove('active');
        }
    }

    animateOnLoad() {
        // Animate elements on page load
        const heroElements = document.querySelectorAll('.hero .fade-in');
        
        heroElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('visible');
            }, index * 200);
        });
    }

    hideLoader() {
        const loader = document.querySelector('.loader');
        if (loader) {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.remove();
            }, 500);
        }
    }

    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => {
            notification.remove();
        });

        // Create notification
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
                <button class="notification-close">&times;</button>
            </div>
        `;

        // Style notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: type === 'success' ? 'var(--accent)' : 'var(--primary)',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: 'var(--radius-lg)',
            boxShadow: 'var(--shadow-xl)',
            zIndex: '10000',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s ease',
            maxWidth: '400px'
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Close button
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => notification.remove(), 300);
        });

        // Auto remove
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.transform = 'translateX(400px)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-exclamation-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };
        return icons[type] || icons.info;
    }
}

// Smooth scrolling for anchor links
document.addEventListener('DOMContentLoaded', () => {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    
    anchorLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Enhanced button interactions
document.addEventListener('DOMContentLoaded', () => {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
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
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
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
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: inherit;
        font-size: 1.25rem;
        cursor: pointer;
        padding: 0;
        margin-left: auto;
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = rippleStyles;
document.head.appendChild(styleSheet);

// Initialize the portfolio app
const portfolioApp = new PortfolioApp();

// Console message
console.log(`
🚀 Portfolio loaded successfully!
👨‍💻 Built by Adah Aggarwal
📧 Contact: aggadah21@gmail.com
🔗 LinkedIn: https://www.linkedin.com/in/adahaggarwal/
`);

// Performance monitoring
if ('performance' in window) {
    window.addEventListener('load', () => {
        const loadTime = performance.now();
        console.log(`⚡ Page loaded in ${Math.round(loadTime)}ms`);
    });
}

// Service Worker registration (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => {
                console.log('SW registered: ', registration);
            })
            .catch(registrationError => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}
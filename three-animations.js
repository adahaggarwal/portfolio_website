// ===============================
// 3D ANIMATIONS AND INTERACTIVITY
// ===============================

// Initialize Three.js Scene
let scene, camera, renderer, particles, mouse, raycaster;
let mouseX = 0, mouseY = 0;
let windowHalfX = window.innerWidth / 2;
let windowHalfY = window.innerHeight / 2;

// Animation variables
let animationId;
let isAnimating = true;

// Initialize 3D Background
function init3DBackground() {
    // Create scene
    scene = new THREE.Scene();
    
    // Create camera
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 500;
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('three-canvas'),
        alpha: true,
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Initialize mouse and raycaster for interactivity
    mouse = new THREE.Vector2();
    raycaster = new THREE.Raycaster();
    
    // Create particle system
    createParticleSystem();
    
    // Create floating geometries
    createFloatingGeometries();
    
    // Start animation loop
    animate();
    
    // Add event listeners
    addEventListeners();
}

// Create Particle System
function createParticleSystem() {
    const particleCount = 1500;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const sizes = new Float32Array(particleCount);
    
    const color1 = new THREE.Color(0x00D4AA); // Primary accent
    const color2 = new THREE.Color(0x4EECD9); // Secondary accent
    const color3 = new THREE.Color(0x8B5CF6); // Purple accent
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        
        // Random positions
        positions[i3] = (Math.random() - 0.5) * 2000;
        positions[i3 + 1] = (Math.random() - 0.5) * 2000;
        positions[i3 + 2] = (Math.random() - 0.5) * 1000;
        
        // Random colors
        const randomColor = Math.random();
        let selectedColor;
        if (randomColor < 0.33) selectedColor = color1;
        else if (randomColor < 0.66) selectedColor = color2;
        else selectedColor = color3;
        
        colors[i3] = selectedColor.r;
        colors[i3 + 1] = selectedColor.g;
        colors[i3 + 2] = selectedColor.b;
        
        // Random sizes
        sizes[i] = Math.random() * 3 + 1;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: 0.0 }
        },
        vertexShader: `
            attribute float size;
            attribute vec3 color;
            varying vec3 vColor;
            uniform float time;
            
            void main() {
                vColor = color;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = size * (300.0 / -mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
            }
        `,
        fragmentShader: `
            varying vec3 vColor;
            
            void main() {
                float r = length(gl_PointCoord - vec2(0.5, 0.5));
                if (r > 0.5) discard;
                
                float alpha = 1.0 - smoothstep(0.0, 0.5, r);
                gl_FragColor = vec4(vColor, alpha * 0.8);
            }
        `,
        transparent: true,
        vertexColors: true
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

// Create Floating Geometries
function createFloatingGeometries() {
    const geometries = [];
    const materials = [];
    
    // Create different geometric shapes
    const shapes = [
        new THREE.TetrahedronGeometry(20, 0),
        new THREE.OctahedronGeometry(15, 0),
        new THREE.IcosahedronGeometry(18, 0),
        new THREE.DodecahedronGeometry(16, 0)
    ];
    
    for (let i = 0; i < 12; i++) {
        const geometry = shapes[Math.floor(Math.random() * shapes.length)];
        const material = new THREE.MeshBasicMaterial({
            color: Math.random() < 0.5 ? 0x00D4AA : 0x4EECD9,
            wireframe: true,
            transparent: true,
            opacity: 0.3
        });
        
        const mesh = new THREE.Mesh(geometry, material);
        
        // Random position
        mesh.position.x = (Math.random() - 0.5) * 1500;
        mesh.position.y = (Math.random() - 0.5) * 1500;
        mesh.position.z = (Math.random() - 0.5) * 800;
        
        // Random rotation
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        mesh.rotation.z = Math.random() * Math.PI;
        
        // Store initial position for floating animation
        mesh.userData = {
            initialY: mesh.position.y,
            floatSpeed: Math.random() * 0.02 + 0.01,
            rotationSpeed: {
                x: Math.random() * 0.02 - 0.01,
                y: Math.random() * 0.02 - 0.01,
                z: Math.random() * 0.02 - 0.01
            }
        };
        
        scene.add(mesh);
        geometries.push(mesh);
    }
    
    // Store reference for animation
    scene.userData.floatingGeometries = geometries;
}

// Animation Loop
function animate() {
    if (!isAnimating) return;
    
    animationId = requestAnimationFrame(animate);
    
    const time = Date.now() * 0.001;
    
    // Animate particles
    if (particles) {
        particles.rotation.x += 0.0005;
        particles.rotation.y += 0.001;
        
        // Update particle positions based on mouse
        const positions = particles.geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += Math.sin(time + i) * 0.1;
            positions[i + 1] += Math.cos(time + i * 1.1) * 0.1;
        }
        particles.geometry.attributes.position.needsUpdate = true;
        
        // Update shader uniforms
        if (particles.material.uniforms) {
            particles.material.uniforms.time.value = time;
        }
    }
    
    // Animate floating geometries
    if (scene.userData.floatingGeometries) {
        scene.userData.floatingGeometries.forEach(mesh => {
            // Floating animation
            mesh.position.y = mesh.userData.initialY + Math.sin(time * mesh.userData.floatSpeed) * 30;
            
            // Rotation animation
            mesh.rotation.x += mesh.userData.rotationSpeed.x;
            mesh.rotation.y += mesh.userData.rotationSpeed.y;
            mesh.rotation.z += mesh.userData.rotationSpeed.z;
        });
    }
    
    // Camera movement based on mouse
    camera.position.x += (mouseX - camera.position.x) * 0.0002;
    camera.position.y += (-mouseY - camera.position.y) * 0.0002;
    camera.lookAt(scene.position);
    
    // Render the scene
    renderer.render(scene, camera);
}

// Add Event Listeners
function addEventListeners() {
    // Mouse movement
    document.addEventListener('mousemove', onMouseMove, false);
    
    // Window resize
    window.addEventListener('resize', onWindowResize, false);
    
    // Scroll interaction
    window.addEventListener('scroll', onScroll, false);
    
    // Visibility change (pause animation when tab is hidden)
    document.addEventListener('visibilitychange', onVisibilityChange, false);
}

// Mouse Movement Handler
function onMouseMove(event) {
    mouseX = (event.clientX - windowHalfX) * 2;
    mouseY = (event.clientY - windowHalfY) * 2;
    
    // Update mouse coordinates for raycasting
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Interactive particle effects
    if (particles) {
        const mouseInfluence = 0.1;
        const positions = particles.geometry.attributes.position.array;
        
        for (let i = 0; i < positions.length; i += 3) {
            const dx = positions[i] - mouseX * 0.1;
            const dy = positions[i + 1] - mouseY * 0.1;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 100) {
                positions[i] += dx * mouseInfluence;
                positions[i + 1] += dy * mouseInfluence;
            }
        }
        particles.geometry.attributes.position.needsUpdate = true;
    }
}

// Window Resize Handler
function onWindowResize() {
    windowHalfX = window.innerWidth / 2;
    windowHalfY = window.innerHeight / 2;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// Scroll Handler
function onScroll() {
    const scrollY = window.pageYOffset;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const scrollProgress = scrollY / maxScroll;
    
    // Rotate entire scene based on scroll
    if (scene) {
        scene.rotation.y = scrollProgress * Math.PI * 0.5;
        
        // Change particle colors based on scroll
        if (particles && particles.material.uniforms) {
            particles.material.uniforms.time.value = scrollProgress * 10;
        }
    }
}

// Visibility Change Handler
function onVisibilityChange() {
    if (document.hidden) {
        isAnimating = false;
        if (animationId) {
            cancelAnimationFrame(animationId);
        }
    } else {
        isAnimating = true;
        animate();
    }
}

// ===============================
// INTERACTIVE PROJECT CARDS
// ===============================

function enhance3DProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach((card, index) => {
        // Add 3D tilt effect
        card.addEventListener('mouseenter', function(e) {
            this.style.transform = 'translateY(-15px) rotateX(10deg) rotateY(10deg) scale(1.02)';
            this.style.boxShadow = '0 30px 60px rgba(0, 212, 170, 0.4)';
            
            // Add ripple effect
            createRippleEffect(e, this);
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
            this.style.boxShadow = '0 5px 15px rgba(0, 212, 170, 0.1)';
        });
        
        // Mouse move tilt effect
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / centerY * -10;
            const rotateY = (x - centerX) / centerX * 10;
            
            this.style.transform = `translateY(-15px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
        });
    });
}

// Create Ripple Effect
function createRippleEffect(event, element) {
    const ripple = document.createElement('div');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x}px;
        top: ${y}px;
        background: radial-gradient(circle, rgba(0, 212, 170, 0.3) 0%, transparent 70%);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleAnimation 0.8s ease-out;
        pointer-events: none;
        z-index: 1;
    `;
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => ripple.remove(), 800);
}

// ===============================
// SKILL ICONS 3D EFFECTS
// ===============================

function enhance3DSkillIcons() {
    const skillIcons = document.querySelectorAll('.skill-icon');
    
    skillIcons.forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) rotateX(15deg) rotateY(15deg) scale(1.1)';
            this.style.boxShadow = '0 20px 40px rgba(0, 212, 170, 0.4)';
            
            // Add glow effect
            this.style.background = 'rgba(0, 212, 170, 0.3)';
            this.style.borderRadius = '20px';
            
            // Animate icon inside
            const iconElement = this.querySelector('i, img');
            if (iconElement) {
                iconElement.style.transform = 'scale(1.2) rotateZ(10deg)';
                iconElement.style.filter = 'brightness(1.3) saturate(1.2)';
            }
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) rotateX(0) rotateY(0) scale(1)';
            this.style.boxShadow = '0 5px 15px rgba(0, 212, 170, 0.1)';
            this.style.background = 'rgba(0, 212, 170, 0.1)';
            
            const iconElement = this.querySelector('i, img');
            if (iconElement) {
                iconElement.style.transform = 'scale(1) rotateZ(0deg)';
                iconElement.style.filter = 'brightness(1) saturate(1)';
            }
        });
        
        // Add click animation
        icon.addEventListener('click', function(e) {
            this.style.animation = 'skillIconPulse 0.6s ease';
            setTimeout(() => {
                this.style.animation = '';
            }, 600);
        });
    });
}

// ===============================
// EDUCATION & EXPERIENCE 3D EFFECTS
// ===============================

function enhance3DTimelineItems() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    const educationItems = document.querySelectorAll('.education-item');
    
    [...timelineItems, ...educationItems].forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px) rotateY(5deg) scale(1.02)';
            this.style.boxShadow = '0 15px 30px rgba(0, 212, 170, 0.2)';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0) rotateY(0) scale(1)';
            this.style.boxShadow = '0 5px 15px rgba(0, 212, 170, 0.1)';
        });
    });
}

// ===============================
// FLOATING ANIMATION ELEMENTS
// ===============================

function createFloatingElements() {
    const floatingContainer = document.createElement('div');
    floatingContainer.className = 'floating-elements';
    floatingContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: -1;
        overflow: hidden;
    `;
    
    // Create floating shapes
    for (let i = 0; i < 8; i++) {
        const shape = document.createElement('div');
        const shapeType = Math.random();
        
        if (shapeType < 0.33) {
            shape.className = 'floating-triangle';
        } else if (shapeType < 0.66) {
            shape.className = 'floating-circle';
        } else {
            shape.className = 'floating-square';
        }
        
        shape.style.cssText = `
            position: absolute;
            width: ${Math.random() * 60 + 20}px;
            height: ${Math.random() * 60 + 20}px;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            opacity: 0.1;
            animation: float ${Math.random() * 10 + 15}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        
        if (shape.className === 'floating-triangle') {
            shape.style.background = 'transparent';
            shape.style.borderLeft = '15px solid transparent';
            shape.style.borderRight = '15px solid transparent';
            shape.style.borderBottom = '25px solid #00D4AA';
            shape.style.width = '0';
            shape.style.height = '0';
        } else if (shape.className === 'floating-circle') {
            shape.style.background = 'linear-gradient(45deg, #00D4AA, #4EECD9)';
            shape.style.borderRadius = '50%';
        } else {
            shape.style.background = 'linear-gradient(45deg, #4EECD9, #8B5CF6)';
            shape.style.borderRadius = '10px';
            shape.style.transform = 'rotate(45deg)';
        }
        
        floatingContainer.appendChild(shape);
    }
    
    document.body.appendChild(floatingContainer);
}

// ===============================
// SCROLL TRIGGERED ANIMATIONS
// ===============================

function enhanceScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const element = entry.target;
                
                // Add 3D entrance animation
                element.style.animation = 'enter3D 0.8s ease forwards';
                element.classList.add('animate-3d');
                
                // Stagger animation for child elements
                const children = element.querySelectorAll('.skill-icon, .project-card, .achievement-card');
                children.forEach((child, index) => {
                    setTimeout(() => {
                        child.style.animation = 'slideIn3D 0.6s ease forwards';
                    }, index * 100);
                });
            }
        });
    }, observerOptions);
    
    // Observe sections
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });
}

// ===============================
// HERO IMAGE 3D ENHANCEMENT
// ===============================

function enhance3DHeroImage() {
    const heroImage = document.querySelector('.hero-image .image-placeholder');
    if (!heroImage) return;
    
    heroImage.addEventListener('mousemove', function(e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / centerY * -15;
        const rotateY = (x - centerX) / centerX * 15;
        
        const img = this.querySelector('img');
        if (img) {
            img.style.transform = `scale(1.05) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        }
    });
    
    heroImage.addEventListener('mouseleave', function() {
        const img = this.querySelector('img');
        if (img) {
            img.style.transform = 'scale(1) rotateX(0deg) rotateY(0deg)';
        }
    });
}

// ===============================
// BUTTON 3D EFFECTS
// ===============================

function enhance3DButtons() {
    const buttons = document.querySelectorAll('.btn');
    
    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
            this.style.boxShadow = '0 15px 30px rgba(0, 212, 170, 0.4)';
        });
        
        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none';
        });
        
        // 3D press effect
        button.addEventListener('mousedown', function() {
            this.style.transform = 'translateY(0) scale(0.98)';
        });
        
        button.addEventListener('mouseup', function() {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });
    });
}

// ===============================
// INITIALIZATION
// ===============================

// Add all the necessary CSS animations
function addAnimationStyles() {
    const animationStyles = `
        @keyframes enter3D {
            from {
                opacity: 0;
                transform: translateZ(-100px) rotateX(-10deg);
            }
            to {
                opacity: 1;
                transform: translateZ(0) rotateX(0deg);
            }
        }
        
        @keyframes slideIn3D {
            from {
                opacity: 0;
                transform: translateY(30px) rotateX(-15deg);
            }
            to {
                opacity: 1;
                transform: translateY(0) rotateX(0deg);
            }
        }
        
        @keyframes float {
            0% {
                transform: translateY(0px) rotate(0deg);
            }
            50% {
                transform: translateY(-20px) rotate(180deg);
            }
            100% {
                transform: translateY(0px) rotate(360deg);
            }
        }
        
        @keyframes rippleAnimation {
            0% {
                transform: scale(0);
                opacity: 1;
            }
            100% {
                transform: scale(1);
                opacity: 0;
            }
        }
        
        @keyframes skillIconPulse {
            0%, 100% {
                transform: translateY(-10px) rotateX(15deg) rotateY(15deg) scale(1.1);
            }
            50% {
                transform: translateY(-15px) rotateX(20deg) rotateY(20deg) scale(1.2);
            }
        }
        
        /* Enhanced 3D perspective for sections */
        section {
            perspective: 1000px;
            transform-style: preserve-3d;
        }
        
        /* Floating elements improvements */
        .floating-elements {
            background: radial-gradient(circle at 20% 80%, rgba(0, 212, 170, 0.05) 0%, transparent 50%),
                       radial-gradient(circle at 80% 20%, rgba(78, 236, 217, 0.05) 0%, transparent 50%);
        }
    `;
    
    const styleSheet = document.createElement('style');
    styleSheet.textContent = animationStyles;
    document.head.appendChild(styleSheet);
}

// Initialize all 3D effects
function initializeAll3DEffects() {
    console.log('Initializing 3D animations and effects...');
    
    // Add CSS animations
    addAnimationStyles();
    
    // Initialize 3D background
    setTimeout(() => {
        init3DBackground();
    }, 100);
    
    // Enhance elements
    enhance3DProjectCards();
    enhance3DSkillIcons();
    enhance3DTimelineItems();
    enhance3DHeroImage();
    enhance3DButtons();
    
    // Create floating elements
    createFloatingElements();
    
    // Setup scroll animations  
    enhanceScrollAnimations();
    
    console.log('3D effects initialized successfully!');
}

// Start when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeAll3DEffects);
} else {
    initializeAll3DEffects();
}

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
    isAnimating = false;
    if (animationId) {
        cancelAnimationFrame(animationId);
    }
});

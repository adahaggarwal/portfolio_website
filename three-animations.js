// ===============================
// SIMPLIFIED 3D BACKGROUND
// ===============================

// Simple particle system without complex animations
let scene, camera, renderer, particles;
let isAnimating = false; // Disabled by default

// Simple initialization with minimal effects
function init3DBackground() {
    // Only initialize if user wants 3D (currently disabled)
    console.log('3D animations disabled for better performance');
    return;
    
    // Commented out complex 3D initialization
    /*
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.z = 500;
    
    renderer = new THREE.WebGLRenderer({ 
        canvas: document.getElementById('three-canvas'),
        alpha: true,
        antialias: false // Reduced quality for performance
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    
    // Very simple particle system
    createSimpleParticles();
    animate();
    
    window.addEventListener('resize', onWindowResize, false);
    */
}

// Simplified particle system (currently disabled)
function createSimpleParticles() {
    const particleCount = 100; // Reduced from 1500
    const positions = new Float32Array(particleCount * 3);
    
    for (let i = 0; i < particleCount; i++) {
        const i3 = i * 3;
        positions[i3] = (Math.random() - 0.5) * 1000;
        positions[i3 + 1] = (Math.random() - 0.5) * 1000;
        positions[i3 + 2] = (Math.random() - 0.5) * 500;
    }
    
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    
    const material = new THREE.PointsMaterial({
        color: 0x00D4AA,
        size: 2,
        transparent: true,
        opacity: 0.3
    });
    
    particles = new THREE.Points(geometry, material);
    scene.add(particles);
}

// Minimal animation loop
function animate() {
    if (!isAnimating) return;
    
    requestAnimationFrame(animate);
    
    // Minimal rotation
    if (particles) {
        particles.rotation.y += 0.001;
    }
    
    renderer.render(scene, camera);
}

// Window resize handler
function onWindowResize() {
    if (!camera || !renderer) return;
    
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// ===============================
// SIMPLIFIED INTERACTIVE EFFECTS
// ===============================

// Very basic hover effects only
function enhanceBasicHoverEffects() {
    // Simple project card hover
    document.querySelectorAll('.project-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
    
    // Simple skill icon hover
    document.querySelectorAll('.skill-icon').forEach(icon => {
        icon.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-3px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        icon.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });
}

// ===============================
// SIMPLE INITIALIZATION
// ===============================

// Initialize basic effects only
function initializeSimpleEffects() {
    console.log('Initializing simplified effects...');
    
    // Only basic hover effects
    enhanceBasicHoverEffects();
    
    // 3D background is disabled for performance
    // init3DBackground(); // Commented out
    
    console.log('Simple effects initialized successfully!');
}

// Start when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeSimpleEffects);
} else {
    initializeSimpleEffects();
}

// Optional: Add this function to re-enable 3D if needed
function enable3DBackground() {
    isAnimating = true;
    init3DBackground();
}

// Optional: Add this function to disable all animations
function disableAllAnimations() {
    isAnimating = false;
    
    // Remove any existing canvas
    const canvas = document.getElementById('three-canvas');
    if (canvas && canvas.style) {
        canvas.style.display = 'none';
    }
    
    console.log('All animations disabled');
}

// Auto-disable animations on mobile for better performance
if (window.innerWidth < 768) {
    disableAllAnimations();
}

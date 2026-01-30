/* ========================================
   SHIVATANAYA CONSTRUCTIONS - JavaScript Functionality
   Dynamic Project Loading & Interactions
   ======================================== */

// Configuration - Update this with your server path if hosting
const CONFIG = {
    projectFolders: {
        completed: 'completed_projects',
        ongoing: 'ongoing_projects',
        upcoming: 'upcoming_projects'
    },
    projectFile: 'project.txt',
    imageExtensions: ['jpg', 'jpeg', 'png', 'gif', 'webp']
};

// Sample projects data (fallback when can't read from folders)
// This will be replaced once you upload actual images and details
const SAMPLE_PROJECTS = {
    completed: [
        {
            name: 'Luxury Villa - Green Gardens',
            owner: 'Mr. Ramesh Kumar',
            address: '45, Green Gardens Layout, Whitefield, Bangalore - 560066',
            review: 'Shivatanaya Constructions exceeded our expectations! The attention to detail and quality of construction is outstanding. VinodKumar and his team were professional throughout the entire process. Our dream home became a reality thanks to them. Highly recommended for anyone looking for quality construction in Bangalore!',
            images: [],
            folder: 'Sample_Luxury_Villa'
        }
    ],
    ongoing: [
        {
            name: 'Contemporary 3BHK Home',
            owner: 'Mrs. Priya Sharma',
            address: '78, Sarjapur Road Extension, Electronic City, Bangalore - 560100',
            review: 'Construction is progressing smoothly and we\'re impressed with the regular updates from the team. Can\'t wait to see our finished home!',
            images: [],
            folder: 'Sample_Modern_Home'
        }
    ],
    upcoming: [
        {
            name: 'Tech Park Commercial Complex',
            owner: 'Innovate Solutions Pvt Ltd',
            address: 'Plot 23, Outer Ring Road, Marathahalli, Bangalore - 560037',
            review: 'We chose Shivatanaya Constructions for their excellent reputation and competitive pricing. Looking forward to the construction phase!',
            images: [],
            folder: 'Sample_Commercial_Complex'
        }
    ]
};

// DOM Elements
const preloader = document.getElementById('preloader');
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const backToTop = document.getElementById('backToTop');
const projectModal = document.getElementById('projectModal');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');
const contactForm = document.getElementById('contactForm');

// ========================================
// PRELOADER
// ========================================
window.addEventListener('load', () => {
    setTimeout(() => {
        preloader.classList.add('hidden');
        initAnimations();
    }, 1500);
});

// ========================================
// NAVIGATION
// ========================================
// Scroll effect for navbar
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Back to top button visibility
    if (window.scrollY > 500) {
        backToTop.classList.add('visible');
    } else {
        backToTop.classList.remove('visible');
    }

    // Update active nav link
    updateActiveNavLink();
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close mobile menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Update active navigation link based on scroll position
function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const scrollPos = window.scrollY + 200;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
            document.querySelectorAll('.nav-link').forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

// Back to top functionality
backToTop.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ========================================
// COUNTER ANIMATION
// ========================================
function initAnimations() {
    // Animate stats counter
    const statNumbers = document.querySelectorAll('.stat-number');

    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statNumbers.forEach(num => observer.observe(num));
}

function animateCounter(element) {
    const target = parseInt(element.getAttribute('data-count'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    const timer = setInterval(() => {
        current += step;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 16);
}

// ========================================
// PROJECT TABS
// ========================================
const tabBtns = document.querySelectorAll('.tab-btn');
const projectGalleries = document.querySelectorAll('.project-gallery');

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tab = btn.getAttribute('data-tab');

        // Update active tab button
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // Update active gallery
        projectGalleries.forEach(gallery => {
            gallery.classList.remove('active');
            if (gallery.id === `${tab}-gallery`) {
                gallery.classList.add('active');
            }
        });
    });
});

// ========================================
// PROJECT LOADING
// ========================================
// Store loaded projects for testimonials
let loadedProjects = {
    completed: [],
    ongoing: [],
    upcoming: []
};

async function loadProjects() {
    // Try to fetch from API first (when running with server.js)
    try {
        const response = await fetch('/api/projects');
        if (response.ok) {
            const apiProjects = await response.json();
            loadedProjects = apiProjects;

            // Load from API data
            loadProjectCategory('completed', apiProjects.completed);
            loadProjectCategory('ongoing', apiProjects.ongoing);
            loadProjectCategory('upcoming', apiProjects.upcoming);

            // Load testimonials from API projects
            loadTestimonialsFromData(apiProjects);
            console.log('✅ Projects loaded from server API');
            return;
        }
    } catch (error) {
        console.log('ℹ️ API not available, using sample projects');
    }

    // Fall back to sample projects
    loadedProjects = SAMPLE_PROJECTS;
    loadProjectCategory('completed', SAMPLE_PROJECTS.completed);
    loadProjectCategory('ongoing', SAMPLE_PROJECTS.ongoing);
    loadProjectCategory('upcoming', SAMPLE_PROJECTS.upcoming);

    // Load testimonials from sample projects
    loadTestimonials();
}

function loadProjectCategory(category, projects) {
    const container = document.getElementById(`${category}-projects`);
    const floatingContainer = document.getElementById(`${category}-floating`);

    if (!projects || projects.length === 0) {
        container.innerHTML = `
            <div class="no-projects">
                <i class="fas fa-folder-open"></i>
                <h3>No Projects Yet</h3>
                <p>Projects will appear here once added to the ${category.replace('_', ' ')} folder</p>
            </div>
        `;
        return;
    }

    // Clear loading state
    container.innerHTML = '';

    // Create project cards
    projects.forEach((project, index) => {
        const card = createProjectCard(project, category);
        container.appendChild(card);

        // Add floating images if project has images
        if (project.images && project.images.length > 0) {
            project.images.slice(0, 3).forEach((img, imgIndex) => {
                createFloatingImage(floatingContainer, img, imgIndex);
            });
        }
    });
}

function createProjectCard(project, category) {
    const card = document.createElement('div');
    card.className = 'project-card';
    card.dataset.project = JSON.stringify(project);

    const hasImages = project.images && project.images.length > 0;
    const firstImage = hasImages ? project.images[0] : null;

    // Category icons and labels
    const categoryLabels = {
        completed: { icon: 'fas fa-check-circle', label: 'Completed' },
        ongoing: { icon: 'fas fa-spinner', label: 'In Progress' },
        upcoming: { icon: 'fas fa-calendar-alt', label: 'Coming Soon' }
    };

    card.innerHTML = `
        <div class="project-image">
            ${hasImages ?
            `<img src="${firstImage}" alt="${project.name}">` :
            `<div class="project-image-placeholder">
                    <i class="fas fa-image"></i>
                    <span>Add photos to ${project.folder}</span>
                </div>`
        }
            <div class="project-overlay">
                <div class="project-overlay-content">
                    <span><i class="${categoryLabels[category].icon}"></i> ${categoryLabels[category].label}</span>
                </div>
            </div>
        </div>
        <div class="project-info">
            <h3 class="project-name">${project.name}</h3>
            <div class="project-meta">
                <span><i class="fas fa-user"></i> ${project.owner}</span>
                <span><i class="fas fa-map-marker-alt"></i> ${project.address}</span>
            </div>
        </div>
    `;

    card.addEventListener('click', () => openProjectModal(project));

    return card;
}

function createFloatingImage(container, imageSrc, index) {
    const img = document.createElement('img');
    img.src = imageSrc;
    img.className = 'floating-img';
    img.style.top = `${Math.random() * 60 + 10}%`;
    img.style.left = `${Math.random() * 60 + 10}%`;
    img.style.animationDelay = `${index * -5}s`;
    container.appendChild(img);
}

// ========================================
// PROJECT MODAL
// ========================================
function openProjectModal(project) {
    const hasImages = project.images && project.images.length > 0;

    modalBody.innerHTML = `
        ${hasImages ? `
            <div class="modal-gallery">
                ${project.images.map(img => `<img src="${img}" alt="${project.name}">`).join('')}
            </div>
        ` : ''}
        <div class="modal-info">
            <h2>${project.name}</h2>
            <div class="modal-info-item">
                <i class="fas fa-user"></i>
                <div>
                    <strong>Owner</strong>
                    <span>${project.owner}</span>
                </div>
            </div>
            <div class="modal-info-item">
                <i class="fas fa-map-marker-alt"></i>
                <div>
                    <strong>Address</strong>
                    <span>${project.address}</span>
                </div>
            </div>
            ${project.review ? `
                <div class="modal-review">
                    <p>"${project.review}"</p>
                </div>
            ` : ''}
        </div>
    `;

    projectModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    projectModal.classList.remove('active');
    document.body.style.overflow = '';
}

modalClose.addEventListener('click', closeModal);
projectModal.addEventListener('click', (e) => {
    if (e.target === projectModal) {
        closeModal();
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && projectModal.classList.contains('active')) {
        closeModal();
    }
});

// ========================================
// TESTIMONIALS
// ========================================
function loadTestimonials() {
    loadTestimonialsFromData(SAMPLE_PROJECTS);
}

function loadTestimonialsFromData(projectsData) {
    const container = document.getElementById('testimonials-container');
    const allProjects = [
        ...(projectsData.completed || []),
        ...(projectsData.ongoing || []).filter(p => p.review),
    ].filter(p => p.review);

    if (allProjects.length === 0) {
        container.innerHTML = `
            <div class="no-projects">
                <i class="fas fa-comments"></i>
                <h3>No Reviews Yet</h3>
                <p>Client reviews will appear here from project files</p>
            </div>
        `;
        return;
    }

    container.innerHTML = allProjects.map(project => `
        <div class="testimonial-card">
            <div class="testimonial-quote">"</div>
            <p class="testimonial-content">${project.review}</p>
            <div class="testimonial-author">
                <div class="author-avatar">${getInitials(project.owner)}</div>
                <div class="author-info">
                    <h4>${project.owner}</h4>
                    <span>${project.name}</span>
                </div>
            </div>
            <div class="testimonial-rating">
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
                <i class="fas fa-star"></i>
            </div>
        </div>
    `).join('');
}

function getInitials(name) {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .substring(0, 2)
        .toUpperCase();
}

// ========================================
// CONTACT FORM
// ========================================
contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData.entries());

    // Email configuration
    const emailTo = 'kb.vinod20@gmail.com';
    const emailSubject = `New Inquiry - ${data.projectType || 'Construction Project'} - From ${data.name}`;

    // Create email body
    const emailBody = `
New Construction Inquiry - Shivatanaya Constructions

Client Details:
---------------
Name: ${data.name}
Phone: ${data.phone}
Email: ${data.email || 'Not provided'}

Project Information:
-------------------
Project Type: ${data.projectType}

Project Details:
${data.message || 'No additional details provided'}

---
This inquiry was sent from the Shivatanaya Constructions website.
    `.trim();

    // Create mailto link
    const mailtoUrl = `mailto:${emailTo}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

    // Open email client
    window.location.href = mailtoUrl;

    // Show success message
    showNotification('Opening your email client...', 'success');

    // Reset form after a short delay
    setTimeout(() => {
        contactForm.reset();
    }, 1000);
});

// ========================================
// NOTIFICATION
// ========================================
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
        <span>${message}</span>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 30px;
        background: ${type === 'success' ? '#10B981' : '#EF4444'};
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        display: flex;
        align-items: center;
        gap: 12px;
        font-size: 15px;
        font-weight: 500;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;

    // Add animation keyframes
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOut {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

    document.body.appendChild(notification);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 80;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ========================================
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.service-card, .feature, .why-item, .testimonial-card');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    elements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
};

// ========================================
// DYNAMIC PROJECT LOADING FROM FOLDERS
// For server deployment, uncomment and configure this section
// ========================================
/*
async function fetchProjectsFromServer() {
    try {
        const categories = ['completed', 'ongoing', 'upcoming'];
        
        for (const category of categories) {
            const response = await fetch(`/api/projects/${category}`);
            if (response.ok) {
                const projects = await response.json();
                loadProjectCategory(category, projects);
            }
        }
    } catch (error) {
        console.error('Error loading projects:', error);
        // Fall back to sample projects
        loadProjects();
    }
}
*/

// ========================================
// INITIALIZE
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    loadProjects();
    animateOnScroll();
});

// ========================================
// UTILITY: Parse project.txt file format
// ========================================
function parseProjectFile(content) {
    const lines = content.split('\n');
    const project = {};

    lines.forEach(line => {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
            const key = line.substring(0, colonIndex).trim().toLowerCase();
            const value = line.substring(colonIndex + 1).trim();

            switch (key) {
                case 'project name':
                    project.name = value;
                    break;
                case 'owner':
                    project.owner = value;
                    break;
                case 'address':
                    project.address = value;
                    break;
                case 'review':
                    project.review = value;
                    break;
            }
        }
    });

    return project;
}

// ========================================
// Export for potential server-side use
// ========================================
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { parseProjectFile, CONFIG };
}

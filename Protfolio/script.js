// ===== DOM ELEMENTS =====
const navbar = document.querySelector('.navbar');
const navToggle = document.getElementById('nav-toggle');
const navMenu = document.getElementById('nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const currentYear = document.getElementById('current-year');
const videoCarousel = document.getElementById('video-carousel');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');

// ===== NAVIGATION FUNCTIONALITY =====

// Mobile menu toggle
if (navToggle && navMenu) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('active');
        
        // Animate hamburger menu
        const bars = navToggle.querySelectorAll('.bar');
        bars.forEach((bar, index) => {
            if (navMenu.classList.contains('active')) {
                if (index === 0) bar.style.transform = 'rotate(45deg) translate(5px, 5px)';
                if (index === 1) bar.style.opacity = '0';
                if (index === 2) bar.style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                bar.style.transform = 'none';
                bar.style.opacity = '1';
            }
        });
    });
}

// Close mobile menu when clicking on a link
if (navLinks.length > 0) {
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu) {
                navMenu.classList.remove('active');
                const bars = navToggle?.querySelectorAll('.bar');
                if (bars) {
                    bars.forEach(bar => {
                        bar.style.transform = 'none';
                        bar.style.opacity = '1';
                    });
                }
            }
        });
    });
}

// Navbar scroll effect
if (navbar) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ===== SMOOTH SCROLLING =====
if (navLinks.length > 0) {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const offsetTop = targetSection.offsetTop - 70; // Account for fixed navbar
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===== ANIMATION ON SCROLL =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in-up');
        }
    });
}, observerOptions);

// Observe all sections for animation
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// ===== SKILL BARS ANIMATION =====
const skillBars = document.querySelectorAll('.skill-progress');
if (skillBars.length > 0) {
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                progressBar.style.width = '0%';
                
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 200);
            }
        });
    }, { threshold: 0.5 });

    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// ===== YOUTUBE API INTEGRATION =====
// ===== Redesigned YouTube Video Grid Loader =====
const YOUTUBE_API_KEY = 'AIzaSyD2aJMypU4Bw-GfLLtdXBi2BW81O_yybbk';
const YOUTUBE_CHANNEL_ID = 'UCb0zEd9-zhKc1jFs6AYrT9w';
const YT_VIDEO_GRID = document.getElementById('youtube-video-grid');
const YT_LOADING_STATE = document.getElementById('loading-state');

const YT_FALLBACK_VIDEOS = [
    {
        id: { videoId: 'IjVA9JkqciE' },
        snippet: {
            title: 'Web Development Tutorial for Beginners',
            thumbnails: { medium: { url: 'https://i.ytimg.com/vi/IjVA9JkqciE/mqdefault.jpg' } },
            publishedAt: '2024-01-15T10:00:00Z'
        }
    },
    {
        id: { videoId: 'dQw4w9WgXcQ' },
        snippet: {
            title: 'JavaScript Tips and Tricks',
            thumbnails: { medium: { url: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/mqdefault.jpg' } },
            publishedAt: '2024-01-10T10:00:00Z'
        }
    },
    {
        id: { videoId: '9bZkp7q19f0' },
        snippet: {
            title: 'React.js Complete Course',
            thumbnails: { medium: { url: 'https://i.ytimg.com/vi/9bZkp7q19f0/mqdefault.jpg' } },
            publishedAt: '2024-01-05T10:00:00Z'
        }
    }
];

async function loadYouTubeGridVideos() {
    if (!YT_VIDEO_GRID) return;
    if (YT_LOADING_STATE) YT_LOADING_STATE.style.display = 'flex';
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${YOUTUBE_CHANNEL_ID}&part=snippet,id&order=date&maxResults=6&type=video`
        );
        if (!response.ok) throw new Error('YouTube API error');
        const data = await response.json();
        if (data.items && data.items.length > 0) {
            renderYouTubeGridVideos(data.items);
        } else {
            renderYouTubeGridVideos(YT_FALLBACK_VIDEOS);
        }
    } catch (e) {
        renderYouTubeGridVideos(YT_FALLBACK_VIDEOS);
    } finally {
        if (YT_LOADING_STATE) YT_LOADING_STATE.style.display = 'none';
    }
}

function renderYouTubeGridVideos(videos) {
    if (!YT_VIDEO_GRID) return;
    YT_VIDEO_GRID.innerHTML = '';
    videos.forEach(video => {
        const card = document.createElement('div');
        card.className = 'youtube-video-card';
        card.tabIndex = 0;
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', video.snippet?.title || 'YouTube Video');
        card.onclick = () => {
            const videoId = video.id?.videoId;
            if (videoId) window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank', 'rel=noopener');
        };
        card.innerHTML = `
            <img class="youtube-video-thumb" src="${video.snippet?.thumbnails?.medium?.url || ''}" alt="${video.snippet?.title || ''}" onerror="this.src='https://via.placeholder.com/320x180/667eea/ffffff?text=Video'" />
            <div class="youtube-video-info">
                <div class="youtube-video-title">${video.snippet?.title || ''}</div>
                <div class="youtube-video-date">${video.snippet?.publishedAt ? new Date(video.snippet.publishedAt).toLocaleDateString() : ''}</div>
            </div>
        `;
        YT_VIDEO_GRID.appendChild(card);
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadYouTubeGridVideos();
});

// ===== CAROUSEL CONTROLS =====
if (prevBtn && nextBtn && videoCarousel) {
    prevBtn.addEventListener('click', () => {
        videoCarousel.scrollBy({
            left: -300,
            behavior: 'smooth'
        });
        
        // Update button states after scroll
        setTimeout(updateCarouselControls, 300);
    });
    
    nextBtn.addEventListener('click', () => {
        videoCarousel.scrollBy({
            left: 300,
            behavior: 'smooth'
        });
        
        // Update button states after scroll
        setTimeout(updateCarouselControls, 300);
    });

    // Update controls on scroll
    videoCarousel.addEventListener('scroll', () => {
        updateCarouselControls();
    });
}

// ===== FORM HANDLING =====
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        if (!submitBtn) return;
        
        const originalText = submitBtn.innerHTML;
        
        // Show loading state
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
        submitBtn.disabled = true;
        
        try {
            const formData = new FormData(contactForm);
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });
            
            if (response.ok) {
                showNotification('Message sent successfully!', 'success');
                contactForm.reset();
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            showNotification('Failed to send message. Please try again.', 'error');
        } finally {
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    });
}

// ===== NOTIFICATION SYSTEM =====
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 8px;
        color: white;
        font-weight: 500;
        z-index: 10000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
    `;
    
    const bgColor = type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#667eea';
    notification.style.backgroundColor = bgColor;
    
    const iconClass = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle';
    
    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 10px;">
            <i class="fas fa-${iconClass}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// ===== PROJECT CARD INTERACTIONS =====
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        const overlay = card.querySelector('.project-overlay');
        if (overlay) {
            overlay.style.opacity = '1';
        }
    });
    
    card.addEventListener('mouseleave', () => {
        const overlay = card.querySelector('.project-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
        }
    });
});

// ===== STATS COUNTER ANIMATION =====
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const text = counter.textContent;
        const target = parseInt(text.replace('+', '')) || 0;
        const increment = target / 100;
        let current = 0;
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + '+';
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
            }
        };
        
        updateCounter();
    });
}

// ===== LAZY LOADING FOR IMAGES =====
const images = document.querySelectorAll('img[data-src]');
if (images.length > 0) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// ===== UTILITY FUNCTIONS =====

// Update copyright year
if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

// Add loading animation to buttons
document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
        if (this.type === 'submit') return; // Don't animate form submit buttons
        
        const ripple = document.createElement('span');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
        `;
        
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            if (this.contains(ripple)) {
                ripple.remove();
            }
        }, 600);
    });
});

// Add CSS for ripple animation
const style = document.createElement('style');
style.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Fetch YouTube videos
    loadYouTubeGridVideos();
    
    // Animate counters when they come into view
    const statsSection = document.querySelector('.about-stats');
    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    statsObserver.unobserve(entry.target);
                }
            });
        });
        
        statsObserver.observe(statsSection);
    }
    
    // Add smooth reveal animations to elements
    const revealElements = document.querySelectorAll('.skill-card, .project-card, .contact-item');
    revealElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        
        setTimeout(() => {
            el.style.transition = 'all 0.6s ease';
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// ===== PERFORMANCE OPTIMIZATIONS =====

// Debounce scroll events
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

// Optimized scroll handler
if (navbar) {
    const optimizedScrollHandler = debounce(() => {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, 10);

    window.addEventListener('scroll', optimizedScrollHandler);
}

// ===== ACCESSIBILITY IMPROVEMENTS =====

// Add keyboard navigation for carousel
if (prevBtn && nextBtn) {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevBtn.click();
        } else if (e.key === 'ArrowRight') {
            nextBtn.click();
        }
    });
}

// Add focus indicators for better accessibility
document.querySelectorAll('a, button').forEach(element => {
    element.addEventListener('focus', () => {
        element.style.outline = '2px solid #667eea';
        element.style.outlineOffset = '2px';
    });
    
    element.addEventListener('blur', () => {
        element.style.outline = 'none';
    });
});

// ===== ERROR HANDLING =====
window.addEventListener('error', (e) => {
    console.error('JavaScript error:', e.error);
    // You can add error reporting here
});

// ===== CLEANUP =====
window.addEventListener('beforeunload', () => {
    // Clean up any resources if needed
    if (typeof imageObserver !== 'undefined') {
        imageObserver.disconnect();
    }
    if (observer) {
        observer.disconnect();
    }
    if (typeof skillObserver !== 'undefined') {
        skillObserver.disconnect();
    }
}); 
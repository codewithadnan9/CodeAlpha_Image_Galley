// Gallery data
let galleryItems = [
    {
        src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400',
        title: 'Mountain Landscape',
        category: 'nature',
        type: 'image'
    },
    {
        src: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400',
        title: 'City Skyline',
        category: 'city',
        type: 'image'
    },
    {
        src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400',
        title: 'Portrait',
        category: 'people',
        type: 'image'
    },
    {
        src: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400',
        title: 'Forest Path',
        category: 'nature',
        type: 'image'
    },
    {
        src: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=400',
        title: 'Urban Architecture',
        category: 'city',
        type: 'image'
    },
    {
        src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400',
        title: 'Person Walking',
        category: 'people',
        type: 'image'
    }
];

let currentIndex = 0;
let filteredItems = [...galleryItems];

// DOM Elements
const gallery = document.getElementById('gallery');
const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const lightboxVideo = document.getElementById('lightbox-video');
const closeBtn = document.querySelector('.close');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const filterBtns = document.querySelectorAll('.filter-btn');
const filterControls = document.querySelectorAll('.filter-control');
const addImagesBtn = document.getElementById('addImagesBtn');
const addVideosBtn = document.getElementById('addVideosBtn');
const fileInput = document.getElementById('fileInput');

// Initialize gallery
function initGallery() {
    renderGallery();
    setupEventListeners();
}

// Render gallery items
function renderGallery() {
    gallery.innerHTML = '';
    
    filteredItems.forEach((item, index) => {
        const galleryItem = createGalleryItem(item, index);
        gallery.appendChild(galleryItem);
    });
}

// Create gallery item element
function createGalleryItem(item, index) {
    const div = document.createElement('div');
    div.className = `gallery-item ${item.type}-item`;
    div.setAttribute('data-category', item.category);
    div.setAttribute('data-index', index);
    
    if (item.type === 'image') {
        div.innerHTML = `
            <img src="${item.src}" alt="${item.title}" loading="lazy">
            <div class="overlay">
                <h3>${item.title}</h3>
                <p>${item.category}</p>
            </div>
        `;
    } else if (item.type === 'video') {
        div.innerHTML = `
            <video muted>
                <source src="${item.src}" type="video/mp4">
            </video>
            <div class="overlay">
                <h3>${item.title}</h3>
                <p>Video</p>
            </div>
        `;
    }
    
    div.addEventListener('click', () => openLightbox(index));
    return div;
}

// Setup event listeners
function setupEventListeners() {
    // Filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.getAttribute('data-filter');
            filterGallery(filter);
            
            // Update active button
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
        });
    });
    
    // Lightbox controls
    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', showPrev);
    nextBtn.addEventListener('click', showNext);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (lightbox.style.display === 'flex') {
            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') showPrev();
            if (e.key === 'ArrowRight') showNext();
        }
    });
    
    // Click outside to close
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });
    
    // Filter controls in lightbox
    filterControls.forEach(control => {
        control.addEventListener('click', () => {
            const filter = control.getAttribute('data-filter');
            applyFilter(filter);
        });
    });
    
    // Add images/videos buttons
    addImagesBtn.addEventListener('click', () => {
        fileInput.accept = 'image/*';
        fileInput.click();
    });
    
    addVideosBtn.addEventListener('click', () => {
        fileInput.accept = 'video/*';
        fileInput.click();
    });
    
    fileInput.addEventListener('change', handleFileUpload);
}

// Filter gallery
function filterGallery(category) {
    if (category === 'all') {
        filteredItems = [...galleryItems];
    } else if (category === 'videos') {
        filteredItems = galleryItems.filter(item => item.type === 'video');
    } else {
        filteredItems = galleryItems.filter(item => item.category === category);
    }
    renderGallery();
}

// Open lightbox
function openLightbox(index) {
    currentIndex = index;
    const item = filteredItems[index];
    
    if (item.type === 'image') {
        lightboxImg.src = item.src;
        lightboxImg.style.display = 'block';
        lightboxVideo.style.display = 'none';
    } else if (item.type === 'video') {
        lightboxVideo.src = item.src;
        lightboxVideo.style.display = 'block';
        lightboxImg.style.display = 'none';
    }
    
    lightbox.style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

// Close lightbox
function closeLightbox() {
    lightbox.style.display = 'none';
    document.body.style.overflow = 'auto';
    lightboxImg.src = '';
    lightboxVideo.src = '';
    
    // Reset filters
    lightboxImg.className = '';
    lightboxVideo.className = '';
}

// Show previous item
function showPrev() {
    currentIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    openLightbox(currentIndex);
}

// Show next item
function showNext() {
    currentIndex = (currentIndex + 1) % filteredItems.length;
    openLightbox(currentIndex);
}

// Apply filters to lightbox content
function applyFilter(filter) {
    lightboxImg.className = filter;
    lightboxVideo.className = filter;
}

// Handle file upload
function handleFileUpload(event) {
    const files = event.target.files;
    
    Array.from(files).forEach(file => {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const newItem = {
                src: e.target.result,
                title: file.name.split('.')[0],
                category: 'user-upload',
                type: file.type.startsWith('image/') ? 'image' : 'video'
            };
            
            galleryItems.push(newItem);
            filteredItems = [...galleryItems];
            renderGallery();
        };
        
        reader.readAsDataURL(file);
    });
    
    // Reset file input
    fileInput.value = '';
}

// Touch/swipe support for mobile
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    if (lightbox.style.display === 'flex') {
        if (touchEndX < touchStartX - 50) showNext();
        if (touchEndX > touchStartX + 50) showPrev();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', initGallery);

// Lazy loading for images
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    // Observe images when gallery is rendered
    const observeImages = () => {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => imageObserver.observe(img));
    };
    
    // Call after rendering
    const originalRenderGallery = renderGallery;
    renderGallery = function() {
        originalRenderGallery();
        setTimeout(observeImages, 100);
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const filterButtons = document.querySelectorAll('.filter-btn');
    // const imageGallery = document.getElementById('imageGallery'); // Not strictly needed here

    let currentImageIndex = 0;
    let images = []; // Store all currently visible images for navigation

    // Function to update the images array based on current filter
    const updateImagesArray = () => {
        // Select only currently visible items for navigation
        images = Array.from(document.querySelectorAll('.gallery-item')).filter(item => {
            return window.getComputedStyle(item).display !== 'none';
        });
    };

    // Initial update of images array (important for first load)
    updateImagesArray();

    // Open Lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            updateImagesArray(); // Recalculate images based on current filtered view
            const dataSrc = item.getAttribute('data-src');
            lightboxImg.src = dataSrc;
            lightbox.classList.add('active');
            // Find the index of the clicked item within the currently visible images
            currentImageIndex = images.findIndex(imgItem => imgItem === item);
        });
    });

    // Close Lightbox
    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    // Close lightbox when clicking outside the image
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            lightbox.classList.remove('active');
        }
    });

    // Navigate to previous image
    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent closing lightbox
        if (images.length === 0) return;
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        lightboxImg.src = images[currentImageIndex].getAttribute('data-src');
    });

    // Navigate to next image
    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation(); // Prevent closing lightbox
        if (images.length === 0) return;
        currentImageIndex = (currentImageIndex + 1) % images.length;
        lightboxImg.src = images[currentImageIndex].getAttribute('data-src');
    });

    // Keyboard navigation (Escape to close, Arrows for next/prev)
    document.addEventListener('keydown', (e) => {
        if (lightbox.classList.contains('active')) {
            if (e.key === 'Escape') {
                lightbox.classList.remove('active');
            } else if (e.key === 'ArrowLeft') {
                prevBtn.click();
            } else if (e.key === 'ArrowRight') {
                nextBtn.click();
            }
        }
    });

    // Image Filtering
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to the clicked button
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');
                if (filterValue === 'all' || itemCategory === filterValue) {
                    item.style.display = 'block'; // Or 'grid' for grid items
                    item.style.animation = 'fadeIn 0.5s ease-out forwards'; // Apply fade-in
                } else {
                    item.style.display = 'none';
                    item.style.animation = 'none'; // Reset animation for hidden items
                }
            });
            // Crucially, update the images array AFTER filtering has applied and elements are visible/hidden
            setTimeout(updateImagesArray, 0); // Use setTimeout to ensure DOM is updated
        });
    });

    // Helper for fade-in animation (for filtering)
    // This part should already be in your CSS or inline like this for dynamic use.
    // If you've moved @keyframes fadeIn to style.css, you can remove this JS part.
    // However, it's fine here too.
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = `
        @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.9); }
            to { opacity: 1; transform: scale(1); }
        }
    `;
    document.head.appendChild(styleSheet);
});
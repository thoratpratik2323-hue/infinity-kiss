document.addEventListener('DOMContentLoaded', () => {
    const kissZone = document.getElementById('kissZone');
    const countDisplay = document.getElementById('kissCount');
    const autoKissBtn = document.getElementById('autoKissBtn');
    const container = document.getElementById('particles-container');

    let count = 0;
    let autoInterval = null;
    const items = ['💋', '❤️', '💖', '💗', '💓', '🥰', '😍'];

    function createParticle(x, y) {
        const particle = document.createElement('div');
        particle.classList.add('floating-item');
        particle.textContent = items[Math.floor(Math.random() * items.length)];

        // Randomize
        const tx = (Math.random() - 0.5) * 200; // X spread
        const rot = (Math.random() - 0.5) * 60; // Rotation spread

        particle.style.setProperty('--tx', `${tx}px`);
        particle.style.setProperty('--rot', `${rot}deg`);
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;

        container.appendChild(particle);

        // Remove after animation
        setTimeout(() => {
            particle.remove();
        }, 3000);
    }

    function addKiss() {
        count++;
        countDisplay.textContent = count.toLocaleString();

        // Trigger vibration on mobile if supported
        if (navigator.vibrate) {
            navigator.vibrate(50);
        }

        // Get center of kiss zone for auto kisses
        const rect = kissZone.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        // Use slightly randomized position around center
        const x = centerX + (Math.random() - 0.5) * 50;
        const y = centerY + (Math.random() - 0.5) * 50;

        createParticle(x, y);
    }

    // Click handler
    kissZone.addEventListener('mousedown', (e) => {
        addKiss();
        kissZone.style.transform = 'scale(0.9)';
    });

    kissZone.addEventListener('mouseup', () => {
        kissZone.style.transform = 'scale(1)';
    });

    // Touch support
    kissZone.addEventListener('touchstart', (e) => {
        e.preventDefault(); // Prevent scrolling on rapid taps
        addKiss();
        kissZone.style.transform = 'scale(0.9)';
    }, { passive: false });

    kissZone.addEventListener('touchend', () => {
        kissZone.style.transform = 'scale(1)';
    });

    // Auto Kiss Mode
    autoKissBtn.addEventListener('click', () => {
        if (autoInterval) {
            clearInterval(autoInterval);
            autoInterval = null;
            autoKissBtn.innerHTML = '<i class="fas fa-infinity"></i> Auto Kiss Mode';
            autoKissBtn.classList.remove('auto-kiss-active');
        } else {
            autoKissBtn.innerHTML = '<i class="fas fa-pause"></i> Stop Kisses';
            autoKissBtn.classList.add('auto-kiss-active');

            // Start rapid kisses
            autoInterval = setInterval(() => {
                addKiss();
            }, 100); // 10 kisses per second
        }
    });
});

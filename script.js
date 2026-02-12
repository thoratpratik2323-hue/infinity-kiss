document.addEventListener('DOMContentLoaded', () => {
    const kissZone = document.getElementById('kissZone');
    const countDisplay = document.getElementById('kissCount');
    const autoKissBtn = document.getElementById('autoKissBtn');
    const musicBtn = document.getElementById('musicBtn');
    const container = document.getElementById('particles-container');

    let count = 0;
    let autoInterval = null;
    const items = ['💋', '❤️', '💖', '💗', '💓', '🥰', '😍'];

    // --- YouTube API Setup ---
    let player;
    let isMusicPlaying = false;

    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = function () {
        player = new YT.Player('player', {
            height: '0',
            width: '0',
            videoId: 'gvyUuxdRdR4', // Raataan Lambiyan
            playerVars: {
                'autoplay': 0,
                'controls': 0,
                'loop': 1,
                'playlist': 'gvyUuxdRdR4'
            },
            events: {
                'onReady': onPlayerReady
            }
        });
    };

    function onPlayerReady(event) {
        musicBtn.addEventListener('click', toggleMusic);
    }

    function toggleMusic() {
        if (isMusicPlaying) {
            player.pauseVideo();
            musicBtn.innerHTML = '<i class="fas fa-music"></i> Play Music';
            musicBtn.classList.remove('music-playing');
            isMusicPlaying = false;
        } else {
            player.playVideo();
            musicBtn.innerHTML = '<i class="fas fa-pause"></i> Pause Music';
            musicBtn.classList.add('music-playing');
            isMusicPlaying = true;
        }
    }

    // --- Particle Logic ---
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

        // Auto-play music on first kiss interaction if not playing
        if (!isMusicPlaying && player && player.getPlayerState) {
            // Intentionally left blank or simple console log to avoid forced interaction issues,
            // but user requested "romance", so maybe prompt? No, let's leave it manual for better UX.
            // Or we can try to play it once if the browser allows.
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

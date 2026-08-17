/**
 * pr1vate - Configuration & Scripts V3.2
 */

const CONFIG = {
    username: "pr1vate",
    tagline: "just passing through.",
    music: {
        title: "Bye (Altare)",
        artist: "Ariana Grande",
        src: "assets/music/song.mp3",
        cover: "assets/images/music-cover.jpg"
    },
    socials: [
        { name: "Discord", icon: "fa-brands fa-discord", url: "https://discordapp.com/users/984311820036755476" },
        { name: "Spotify", icon: "fa-brands fa-spotify", url: "https://open.spotify.com/user/31uteugqbsjnxqcksvywvqyfwncm?si=1accebfbfeb940ee" },
        { name: "TikTok", icon: "fa-brands fa-tiktok", url: "https://www.tiktok.com/@eetavirp?is_from_webapp=1&sender_device=pc" },
        { name: "Instagram", icon: "fa-brands fa-instagram", url: "https://www.instagram.com/aalfathr?igsh=eDR5ZHJ3dncxNjdo&igsi=eDR5ZHJ3dncxNjdo" },
        { name: "YouTube", icon: "fa-brands fa-youtube", url: "https://youtube.com/@hier4rchy?si=grh2NkFpeEtvqgFs" }
    ]
};

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Inject Data
    document.getElementById('nav-username').textContent = CONFIG.username;
    document.getElementById('hero-username').textContent = CONFIG.username;
    document.getElementById('hero-tagline').textContent = CONFIG.tagline;
    document.getElementById('song-title').textContent = CONFIG.music.title;
    document.getElementById('artist-name').textContent = CONFIG.music.artist;
    document.getElementById('footer-username').textContent = CONFIG.username;
    document.getElementById('footer-tagline').textContent = CONFIG.tagline;
    document.title = `${CONFIG.username} - ${CONFIG.tagline}`;

    // 2. Render Social Links
    const socialContainer = document.getElementById('social-links-container');
    CONFIG.socials.forEach(social => {
        const link = document.createElement('a');
        link.href = social.url;
        link.target = "_blank";
        link.rel = "noopener noreferrer";
        link.className = "social-item";
        link.innerHTML = `
            <div class="social-item-left">
                <i class="${social.icon} social-item-icon"></i>
                <span>${social.name}</span>
            </div>
            <i class="fa-solid fa-arrow-up-right-from-square social-item-arrow"></i>
        `;
        socialContainer.appendChild(link);
    });

    // 3. Music Player Setup
    const coverImg = document.getElementById('cover-image');
    const coverIcon = document.getElementById('cover-icon');
    const coverArtContainer = document.getElementById('cover-art-container');
    
    coverImg.src = CONFIG.music.cover;
    coverImg.onload = () => {
        coverImg.style.display = 'block';
        coverIcon.style.display = 'none';
    };
    coverImg.onerror = () => {
        coverImg.style.display = 'none';
        coverIcon.style.display = 'block';
    };

    const audio = document.getElementById('audio-element');
    audio.src = CONFIG.music.src;
    
    const playPauseBtn = document.getElementById('play-pause-btn');
    const playIcon = document.getElementById('play-icon');
    const progressBar = document.getElementById('progress-bar');
    const progressContainer = document.getElementById('progress-container');
    const currentTimeEl = document.getElementById('current-time');
    const durationEl = document.getElementById('duration');

    const updatePlayStateUI = (isPlaying) => {
        if (isPlaying) {
            playIcon.classList.remove('fa-play');
            playIcon.classList.add('fa-pause');
            coverArtContainer.classList.add('is-playing'); 
        } else {
            playIcon.classList.remove('fa-pause');
            playIcon.classList.add('fa-play');
            coverArtContainer.classList.remove('is-playing');
        }
    };

    audio.addEventListener('play', () => updatePlayStateUI(true));
    audio.addEventListener('pause', () => updatePlayStateUI(false));
    audio.addEventListener('ended', () => {
        updatePlayStateUI(false);
        progressBar.style.width = '0%';
        currentTimeEl.textContent = '0:00';
    });

    playPauseBtn.addEventListener('click', () => {
        if (audio.paused) {
            audio.play().catch(() => updatePlayStateUI(false));
        } else {
            audio.pause();
        }
    });

    const formatTime = (time) => {
        if (isNaN(time) || time === Infinity) return "0:00";
        const m = Math.floor(time / 60);
        const s = Math.floor(time % 60);
        return `${m}:${s < 10 ? '0' : ''}${s}`;
    };

    audio.addEventListener('timeupdate', () => {
        if (!isNaN(audio.duration) && audio.duration > 0) {
            progressBar.style.width = `${(audio.currentTime / audio.duration) * 100}%`;
            currentTimeEl.textContent = formatTime(audio.currentTime);
            if (durationEl.textContent === "0:00") {
                durationEl.textContent = formatTime(audio.duration);
            }
        }
    });

    audio.addEventListener('loadedmetadata', () => {
        durationEl.textContent = formatTime(audio.duration);
    });

    progressContainer.addEventListener('click', (e) => {
        if (!isNaN(audio.duration)) {
            audio.currentTime = (e.offsetX / progressContainer.clientWidth) * audio.duration;
        }
    });

    // 4. Smooth Scroll Interaction for Navbar
    document.querySelectorAll('.music-scroll').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const player = document.getElementById('music-player');
            player.scrollIntoView({ behavior: 'smooth', block: 'end' });
            player.classList.add('highlight');
            setTimeout(() => player.classList.remove('highlight'), 400);
        });
    });

    document.querySelectorAll('.socials-scroll').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const socialsSection = document.getElementById('socials-section');
            const socialCard = document.getElementById('prlx-socials');
            
            socialsSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
            
            if (socialCard) {
                socialCard.classList.add('highlight');
                setTimeout(() => socialCard.classList.remove('highlight'), 400);
            }
        });
    });

    // 5. V2 Subtle Mouse Parallax (Optimized to NOT run on mobile touches)
    const isFinePointer = window.matchMedia('(pointer: fine)');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    if (isFinePointer.matches && !prefersReducedMotion.matches) {
        const prlxAvatar = document.getElementById('prlx-avatar');
        const prlxSocials = document.getElementById('prlx-socials');
        
        document.addEventListener('mousemove', (e) => {
            requestAnimationFrame(() => {
                const x = (window.innerWidth / 2 - e.pageX) / 80;
                const y = (window.innerHeight / 2 - e.pageY) / 80;
                
                if (prlxAvatar) prlxAvatar.style.transform = `translate(${x * 0.8}px, ${y * 0.8}px)`;
                if (prlxSocials) prlxSocials.style.transform = `translate(${x * 1.2}px, ${y * 1.2}px)`;
            });
        });
    }
// --- V3.2 Mobile-Safe Video Playback Handler (REVISI) ---
    const bgVideo = document.getElementById('bg-video');
    const avatarVideo = document.getElementById('hero-avatar');
    const bgVideos = [bgVideo, avatarVideo].filter(Boolean);

    const safePlayVideo = async (vid) => {
        try {
            // Hanya jalankan jika sedang pause dan tab sedang aktif
            if (vid.paused && document.visibilityState === 'visible') {
                await vid.play();
            }
        } catch (error) {
            // Berhenti memaksa jika di-blokir oleh OS (misal: Low Power Mode)
            console.warn("Video playback prevented by OS:", error);
        }
    };

    bgVideos.forEach(vid => {
        // 1. Beri sedikit jeda agar DOM & resources browser siap sebelum memaksa play
        setTimeout(() => safePlayVideo(vid), 150);

        // 2. Play ulang saat video selesai (mengakali loop yang kadang gagal di mobile)
        vid.addEventListener('ended', () => {
            vid.currentTime = 0;
            safePlayVideo(vid);
        });

        // 3. Play jika browser merasa buffer sudah cukup
        vid.addEventListener('canplay', () => safePlayVideo(vid));
        
        // HAPUS event 'pause', 'stalled', dan 'waiting' yang agresif di versi sebelumnya.
    });

    // 4. Lanjutkan play saat user kembali ke tab ini
    document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') {
            bgVideos.forEach(vid => safePlayVideo(vid));
        }
    });
    // --------------------------------------------------------
    // --- V3.3 Jurus Pamungkas: Force Unlock Video on First User Interaction ---
    const unlockVideos = () => {
        bgVideos.forEach(vid => {
            if (vid.paused) {
                let playPromise = vid.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {});
                }
            }
        });
        // Hapus listener setelah jalan biar nggak menuhin memori HP
        document.removeEventListener('touchstart', unlockVideos);
        document.removeEventListener('click', unlockVideos);
        document.removeEventListener('scroll', unlockVideos);
    };

    // Begitu user nyentuh, ngeklik, atau scroll dikit aja, video langsung dipaksa bangun
    document.addEventListener('touchstart', unlockVideos, { passive: true, once: true });
    document.addEventListener('click', unlockVideos, { once: true });
    document.addEventListener('scroll', unlockVideos, { passive: true, once: true });
    // -------------------------------------------------------------------------
});

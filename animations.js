// animations.js

export function initAnimations() {
    initPreloader(); // Penting: Agar loading screen hilang
    initParticles();
    initShootingStars();
    initFadeInObserver();
    initNavbarScroll();
    initScrollTracker();
}

// 1. Preloader Logic (Agar website terbuka)
function initPreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('opacity-0');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 500);
            }, 800);
        });
    }
}

// 2. Particles Animation (Titik-titik mengapung di background)
function initParticles() {
    const particlesContainer = document.getElementById('particles-container');
    if (particlesContainer) {
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.classList.add('particle');
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.animationDuration = `${Math.random() * 15 + 10}s`;
            particle.style.animationDelay = `${Math.random() * 25}s`;
            const size = Math.random() * 3 + 1;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particlesContainer.appendChild(particle);
        }
    }
}

// 3. Shooting Stars (Bintang jatuh di background)
function initShootingStars() {
    const starsContainer = document.getElementById('shooting-stars-container');
    if (starsContainer) {
        const createStar = () => {
            const star = document.createElement('div');
            star.classList.add('shooting-star');
            star.style.top = `${Math.random() * 100}%`;
            star.style.left = `-${Math.random() * 25}%`;
            star.style.animationDelay = `${Math.random() * 5}s`;
            starsContainer.appendChild(star);
            setTimeout(() => star.remove(), 3000);
        };
        setInterval(createStar, 1500);
    }
}

// 4. Fade In Sections (Muncul perlahan saat discroll)
function initFadeInObserver() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in-section');
        observer.observe(section);
    });
    // Pastikan home langsung muncul
    const home = document.querySelector('#home');
    if(home) home.classList.add('fade-in-visible');
}

// 5. Navbar Hide on Scroll (Menyembunyikan navbar saat scroll ke bawah)
function initNavbarScroll() {
    let lastScrollY = window.scrollY;
    const navbar = document.querySelector('nav');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > lastScrollY && window.scrollY > 150) {
                navbar.style.transform = 'translateY(-100%)';
            } else {
                navbar.style.transform = 'translateY(0)';
            }
            lastScrollY = window.scrollY;
        });
    }
}

// 6. Scroll Tracker & Morphing Dots (Indikator bawah yang menyatu)
function initScrollTracker() {
    const scrollTracker = document.getElementById('scroll-tracker-container');
    const dotsTrack = document.getElementById('dots-track');
    const dotLeft = document.getElementById('dot-left');
    const dotRight = document.getElementById('dot-right');
    const contactSection = document.getElementById('contact'); // Target untuk efek morph

    if (scrollTracker && dotsTrack && dotLeft && dotRight) {
        window.addEventListener('scroll', () => {
            const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
            if (scrollableHeight <= 0) return;

            const scrollProgress = window.scrollY / scrollableHeight;
            
            // Hitung pergerakan dot agar bertemu di tengah
            // Asumsi lebar track sekitar 80px-100px, dot bergerak mendekat
            const maxMove = (dotsTrack.clientWidth / 2) - (dotLeft.clientWidth);

            dotLeft.style.transform = `translateX(${scrollProgress * maxMove}px) translateY(-50%)`;
            dotRight.style.transform = `translateX(${-scrollProgress * maxMove}px) translateY(-50%)`;
        });

        // Efek Morph saat sampai di Contact Section
        const contactObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                scrollTracker.classList.toggle('morphed', entry.isIntersecting);
            });
        }, { threshold: 0.1 });

        if (contactSection) {
            contactObserver.observe(contactSection);
        }

        // Dorong tracker ke atas saat ketemu Footer
        const pageFooter = document.getElementById('page-footer');
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const footerHeight = pageFooter.offsetHeight;
                    scrollTracker.style.transform = `translateY(-${footerHeight}px)`;
                } else {
                    scrollTracker.style.transform = 'translateY(0px)';
                }
            });
        }, { threshold: 0 });

        if (pageFooter) {
            footerObserver.observe(pageFooter);
        }
    }
}
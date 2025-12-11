// main.js UPDATE TERBARU (Dengan Fitur Slider)

import { translations, allProjects } from './data.js';
import { initAnimations } from './animations.js';

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. JALANKAN ANIMASI UMUM
    initAnimations();

    // ----------------------------------------------------
    // 2. LOGIKA SLIDER BACKGROUND (INI YANG HILANG KEMARIN)
    // ----------------------------------------------------
    const slides = document.querySelectorAll('#main-slider img');
    let currentSlide = 0;
    const slideInterval = 4000; // Ganti gambar setiap 4 detik

    if (slides.length > 0) {
        setInterval(() => {
            // 1. Sembunyikan slide yang sedang tampil sekarang
            slides[currentSlide].classList.remove('opacity-100');
            slides[currentSlide].classList.add('opacity-0');

            // 2. Hitung urutan slide berikutnya (kalau sudah terakhir, balik ke 0)
            currentSlide = (currentSlide + 1) % slides.length;

            // 3. Munculkan slide berikutnya
            slides[currentSlide].classList.remove('opacity-0');
            slides[currentSlide].classList.add('opacity-100');
        }, slideInterval);
    }
    // ----------------------------------------------------


    // 3. LOGIKA BAHASA & LAINNYA (TETAP SAMA SEPERTI SEBELUMNYA)
    const langBtn = document.getElementById('lang-btn');
    const langMenu = document.getElementById('lang-menu');
    const langText = document.getElementById('lang-text');
    const langLoader = document.getElementById('lang-loader');

    if (langBtn && langMenu) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langMenu.classList.toggle('hidden');
            setTimeout(() => {
                langMenu.classList.toggle('opacity-0');
            }, 10);
        });

        document.addEventListener('click', (e) => {
            if (!langBtn.contains(e.target) && !langMenu.contains(e.target)) {
                langMenu.classList.add('opacity-0');
                setTimeout(() => {
                    langMenu.classList.add('hidden');
                }, 200);
            }
        });

        langMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                const selectedLang = e.target.getAttribute('data-lang-option');
                const currentLang = localStorage.getItem('language') || 'id';
                
                if (selectedLang !== currentLang) {
                    if (langLoader) langLoader.classList.remove('opacity-0', 'pointer-events-none');
                    langMenu.classList.add('hidden', 'opacity-0');

                    setTimeout(() => {
                        updateContent(selectedLang);
                        if (langText) langText.textContent = selectedLang.toUpperCase();
                        if (langLoader) langLoader.classList.add('opacity-0', 'pointer-events-none');
                    }, 500);
                } else {
                    langMenu.classList.add('hidden', 'opacity-0');
                }
            }
        });
    }

    function updateContent(lang) {
        const elements = document.querySelectorAll('[data-key]');
        elements.forEach(el => {
            const key = el.getAttribute('data-key');
            if (translations[lang] && translations[lang][key]) {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = translations[lang][key];
                } else {
                    el.innerHTML = translations[lang][key];
                }
            }
        });

        localStorage.setItem('language', lang);
        renderProjects(lang);
    }

    function renderProjects(lang) {
        const grid = document.getElementById('project-grid');
        if (!grid) return;

        grid.innerHTML = ''; 

        allProjects.forEach(project => {
            const card = document.createElement('div');
            card.className = 'card-hover-effect bg-white border border-pink-100 rounded-2xl overflow-hidden shadow-md flex flex-col h-full opacity-0 translate-y-10 transition-all duration-700';
            
            card.innerHTML = `
                <div class="h-48 overflow-hidden bg-gray-100 relative group">
                    <img src="${project.images[0]}" alt="${project.title}" class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110">
                    <div class="absolute inset-0 bg-indigo-900/20 group-hover:bg-indigo-900/0 transition-colors"></div>
                </div>
                <div class="p-6 flex flex-col flex-grow">
                    <h3 class="text-xl font-bold text-indigo-900 mb-2">${project.title}</h3>
                    <p class="text-slate-500 text-sm mb-4 flex-grow line-clamp-3">
                        ${project.shortDesc[lang]}
                    </p>
                    <div class="flex flex-wrap gap-2 mb-4">
                        ${project.tags.slice(0, 3).map(tag => 
                            `<span class="bg-pink-50 text-pink-600 text-xs font-bold px-2 py-1 rounded-md">${tag}</span>`
                        ).join('')}
                    </div>
                    <button class="open-modal-btn mt-auto text-purple-600 font-bold hover:text-purple-800 transition-colors flex items-center gap-1 text-sm" data-project-id="${project.id}">
                        ${translations[lang]['card-learn-more'] || 'Baca Detail →'}
                    </button>
                </div>
            `;
            grid.appendChild(card);
        });

        setTimeout(() => {
            const newCards = grid.querySelectorAll('.card-hover-effect');
            newCards.forEach((c, index) => {
                setTimeout(() => {
                    c.classList.remove('opacity-0', 'translate-y-10');
                }, index * 100); 
            });
        }, 100);

        attachModalListeners();
    }

    const modal = document.getElementById('project-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-description');
    const modalTags = document.getElementById('modal-tags');
    const modalImgContainer = document.getElementById('modal-image-container');

    function openModal(projectId) {
        const project = allProjects.find(p => p.id === projectId);
        if (!project) return;
        const currentLang = localStorage.getItem('language') || 'id';
        modalTitle.textContent = project.title;
        modalDesc.textContent = project.description[currentLang];
        modalTags.innerHTML = '';
        project.tags.forEach(tag => {
            const span = document.createElement('span');
            span.className = 'bg-pink-100 text-pink-700 text-xs font-bold px-3 py-1 rounded-full';
            span.textContent = tag;
            modalTags.appendChild(span);
        });
        if (project.images && project.images.length > 0) {
            modalImgContainer.innerHTML = `<img src="${project.images[0]}" class="w-full h-full object-cover">`;
        }
        modal.classList.remove('invisible', 'opacity-0');
    }

    function closeModal() {
        modal.classList.add('opacity-0');
        setTimeout(() => {
            modal.classList.add('invisible');
        }, 300);
    }

    function attachModalListeners() {
        document.querySelectorAll('.open-modal-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const pid = btn.getAttribute('data-project-id');
                openModal(pid);
            });
        });
    }

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeModal);
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
    }
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && !modal.classList.contains('invisible')) {
            closeModal();
        }
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    const savedLang = localStorage.getItem('language') || 'id';
    if (langText) langText.textContent = savedLang.toUpperCase();
    updateContent(savedLang);
});

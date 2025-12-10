// main.js
// Logika Utama: Bahasa, Modal, dan Render Data

import { translations, allProjects } from './data.js';
import { initAnimations } from './animations.js'; // Import file animasi yang sudah ada

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. JALANKAN ANIMASI
    initAnimations();

    // 2. LOGIKA GANTI BAHASA
    const langBtn = document.getElementById('lang-btn');
    const langMenu = document.getElementById('lang-menu');
    const langText = document.getElementById('lang-text');
    const langLoader = document.getElementById('lang-loader');

    // Toggle Menu Bahasa
    if (langBtn && langMenu) {
        langBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            langMenu.classList.toggle('hidden');
            setTimeout(() => {
                langMenu.classList.toggle('opacity-0');
            }, 10);
        });

        // Tutup menu jika klik di luar
        document.addEventListener('click', (e) => {
            if (!langBtn.contains(e.target) && !langMenu.contains(e.target)) {
                langMenu.classList.add('opacity-0');
                setTimeout(() => {
                    langMenu.classList.add('hidden');
                }, 200);
            }
        });

        // Klik Opsi Bahasa
        langMenu.addEventListener('click', (e) => {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                const selectedLang = e.target.getAttribute('data-lang-option');
                const currentLang = localStorage.getItem('language') || 'id';
                
                if (selectedLang !== currentLang) {
                    // Efek Loading saat ganti bahasa
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

    // Fungsi Update Konten
    function updateContent(lang) {
        // Update teks statis (Navbar, Hero, dll)
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
        
        // Render ulang Grid Proyek dengan bahasa baru
        renderProjects(lang);
    }

    // 3. LOGIKA RENDER GRID PROYEK
    function renderProjects(lang) {
        const grid = document.getElementById('project-grid');
        if (!grid) return;

        grid.innerHTML = ''; // Reset isi grid

        allProjects.forEach(project => {
            const card = document.createElement('div');
            // Class style disamakan dengan tema
            card.className = 'card-hover-effect bg-white border border-pink-100 rounded-2xl overflow-hidden shadow-md flex flex-col h-full opacity-0 translate-y-10 transition-all duration-700'; // opacity-0 untuk animasi entry
            
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

        // Jalankan animasi fade-in untuk grid yang baru dibuat
        setTimeout(() => {
            const newCards = grid.querySelectorAll('.card-hover-effect');
            newCards.forEach((c, index) => {
                setTimeout(() => {
                    c.classList.remove('opacity-0', 'translate-y-10');
                }, index * 100); // Stagger animation
            });
        }, 100);

        attachModalListeners();
    }

    // 4. LOGIKA MODAL POPUP
    const modal = document.getElementById('project-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-description');
    const modalTags = document.getElementById('modal-tags');
    const modalImgContainer = document.getElementById('modal-image-container');
    const modalLiveLink = document.getElementById('modal-live-link');
    const modalRepoLink = document.getElementById('modal-repo-link');

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

    // Smooth Scroll untuk Anchor Links
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

    // --- INITIALIZE STARTUP ---
    const savedLang = localStorage.getItem('language') || 'id'; // Default Bahasa
    if (langText) langText.textContent = savedLang.toUpperCase();
    updateContent(savedLang);
});
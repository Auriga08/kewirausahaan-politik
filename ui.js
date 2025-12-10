// ui.js

import { allProjects, translations } from './data.js';

let currentLanguage = 'en';
let currentProjectImages = [];
let currentImageIndex = 0;

const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalDescription = document.getElementById('modal-description');
const modalTags = document.getElementById('modal-tags');
const modalImageContainer = document.getElementById('modal-image-container');
const modalLiveLink = document.getElementById('modal-live-link');
const modalRepoLink = document.getElementById('modal-repo-link');
const prevImageBtn = document.getElementById('prev-image-btn');
const nextImageBtn = document.getElementById('next-image-btn');

export function updateContent(lang) {
    currentLanguage = lang;
    document.querySelectorAll('[data-key]').forEach(element => {
        const key = element.getAttribute('data-key');
        if (translations[lang] && translations[lang][key]) {
            element.innerHTML = translations[lang][key];
        }
    });
    document.getElementById('lang-text').innerText = lang.toUpperCase();
    localStorage.setItem('language', lang);
    populateProjectGrid();
}

function updateImage() {
    modalImageContainer.innerHTML = `<img src="${currentProjectImages[currentImageIndex]}" class="w-full h-full object-contain absolute top-0 left-0 animate-[fadeIn_0.5s]" alt="Project Screenshot">`;
    prevImageBtn.classList.toggle('hidden', currentProjectImages.length <= 1);
    nextImageBtn.classList.toggle('hidden', currentProjectImages.length <= 1);
}

export function openModal(projectId) {
    const project = allProjects.find(p => p.id === projectId);
    if (!project) return;

    modalTitle.textContent = project.title;
    modalDescription.textContent = project.description[currentLanguage];
    modalLiveLink.href = project.liveLink;
    modalRepoLink.href = project.repoLink;

    modalTags.innerHTML = project.tags.map(tag => `<span class="bg-cyan-500/20 text-cyan-300 text-xs font-semibold px-2.5 py-1 rounded-full">${tag}</span>`).join('');

    currentProjectImages = project.images;
    currentImageIndex = 0;
    updateImage();

    modal.classList.remove('invisible', 'opacity-0');
    modal.querySelector('.modal-content').classList.remove('scale-95');
    document.body.style.overflow = 'hidden';
}

export function closeModal() {
    modal.classList.add('opacity-0');
    modal.querySelector('.modal-content').classList.add('scale-95');
    setTimeout(() => {
        modal.classList.add('invisible');
        document.body.style.overflow = '';
    }, 300);
}

export function populateProjectGrid() {
    const projectGrid = document.getElementById('project-grid');
    if (projectGrid) {
        const gridProjects = allProjects.filter(p => p.id !== 'antima');
        projectGrid.innerHTML = gridProjects.map(p => `
            <div class="card-hover-effect bg-gray-800/50 border border-gray-700 rounded-2xl transform transition-transform duration-300 shadow-lg flex flex-col overflow-hidden">
                <div class="aspect-video bg-gray-700">
                     <img src="${p.images[0]}" alt="${p.title}" class="w-full h-full object-cover">
                </div>
                <div class="p-6 flex flex-col flex-grow">
                     <h3 class="text-2xl font-bold text-white mb-2">${p.title}</h3>
                     <p class="text-slate-400 mb-4 flex-grow">${p.shortDesc[currentLanguage]}</p>
                     <div class="flex flex-wrap gap-2 mb-6">
                        ${p.tags.map(tag => `<span class="bg-gray-700 text-gray-300 text-xs font-medium px-2.5 py-1 rounded-full">${tag}</span>`).join('')}
                     </div>
                     <button data-project-id="${p.id}" class="open-modal-btn mt-auto text-cyan-400 font-semibold hover:text-cyan-300 transition-colors self-start" data-key="card-learn-more">
                        ${translations[currentLanguage]['card-learn-more']}
                     </button>
                </div>
            </div>
        `).join('');
        document.querySelectorAll('.open-modal-btn').forEach(btn => {
            btn.addEventListener('click', () => openModal(btn.dataset.projectId));
        });
    }
}

export function initModalNav() {
    prevImageBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex - 1 + currentProjectImages.length) % currentProjectImages.length;
        updateImage();
    });

    nextImageBtn.addEventListener('click', () => {
        currentImageIndex = (currentImageIndex + 1) % currentProjectImages.length;
        updateImage();
    });
}
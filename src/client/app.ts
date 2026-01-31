import { fetchCharacters, fetchLocations, getFavorites } from './api.js';
import { renderCharacters, renderLocations, renderNotes, toggleLoader, switchTab } from './ui.js';
import { playSound } from './audio.js';
import { initAuth, checkAuth } from './auth.js';

// Елементи керування
const btnChars = document.getElementById('btn-chars');
const btnFavs = document.getElementById('btn-favorites'); // <--- БУЛО btnRicks
const btnLocs = document.getElementById('btn-locations');
const btnResearch = document.getElementById('btn-research');
const btnMap = document.getElementById('btn-map');
const btnLoadMore = document.getElementById('btn-load-more');

// Елементи фільтрів та пошуку
const searchInput = document.getElementById('search-input') as HTMLInputElement;
const filterStatus = document.getElementById('filter-status') as HTMLSelectElement;
const filterGender = document.getElementById('filter-gender') as HTMLSelectElement;
const btnGo = document.getElementById('btn-search-go');

const closeModalBtn = document.getElementById('close-modal');
const modalOverlay = document.getElementById('modal-overlay');

// СТАН ДОДАТКУ
let currentPage = 1;
let currentSearch = '';
let currentStatus = '';
let currentGender = '';

async function init() {
    console.log(">> SMDS v4.2 SYSTEM READY");

    initAuth();
    const isLoggedIn = checkAuth();

    const allButtons = document.querySelectorAll('button');
    allButtons.forEach(btn => {
        btn.addEventListener('click', () => playSound('click'));
        btn.addEventListener('mouseenter', () => playSound('hover'));
    });

    if (isLoggedIn) {
        await startSearch();
    } else {
        console.log(">> WAITING FOR AUTHENTICATION...");
    }

    // --- КНОПКИ МЕНЮ ---
    btnChars?.addEventListener('click', async () => {
        switchTab('view-characters');
        highlightBtn(btnChars);
        searchInput.value = '';
        filterStatus.value = '';
        filterGender.value = '';
        await startSearch();
    });

    // --- КНОПКА MY SQUAD (FAVORITES) ---
    btnFavs?.addEventListener('click', async () => {
        switchTab('view-characters');
        highlightBtn(btnFavs);

        toggleLoader(true);
        // Завантажуємо з бази
        const favorites = await getFavorites();
        renderCharacters(favorites, true);

        // Ховаємо кнопку "Load More", бо це весь список
        document.getElementById('btn-load-more')?.classList.add('hidden');

        toggleLoader(false);
    });

    // --- КНОПКА ЗАВАНТАЖИТИ ЩЕ ---
    btnLoadMore?.addEventListener('click', async () => {
        currentPage++;
        toggleLoader(true);
        const data = await fetchCharacters(currentSearch, currentPage, currentStatus, currentGender);
        renderCharacters(data.results, false);
        toggleLoader(false);
    });

    // --- КНОПКА GO (Фільтри) ---
    btnGo?.addEventListener('click', async () => {
        switchTab('view-characters');
        await startSearch();
    });

    // --- ІНШІ ВКЛАДКИ ---
    btnLocs?.addEventListener('click', async () => {
        switchTab('view-locations');
        highlightBtn(btnLocs);
        toggleLoader(true);
        const data = await fetchLocations();
        renderLocations(data.results);
        toggleLoader(false);
    });

    btnResearch?.addEventListener('click', async () => {
        switchTab('view-research');
        highlightBtn(btnResearch);
        await renderNotes();
    });

    btnMap?.addEventListener('click', () => {
        switchTab('view-map');
        highlightBtn(btnMap);
    });

    // ПОШУК (Enter)
    searchInput.addEventListener('keypress', async (e) => {
        if (e.key === 'Enter') {
            switchTab('view-characters');
            await startSearch();
        }
    });

    closeModalBtn?.addEventListener('click', () => {
        modalOverlay?.classList.add('hidden');
    });
}

async function startSearch() {
    currentSearch = searchInput.value || '';
    currentStatus = filterStatus ? filterStatus.value : '';
    currentGender = filterGender ? filterGender.value : '';

    currentPage = 1;

    // --- ЛОГІКА ПАСХАЛКИ ---
    // Перевіряємо, чи ввів користувач слово "Jerry" (незалежно від регістру)
    if (currentSearch.toLowerCase().includes('jerry')) {
        document.body.classList.add('jerry-theme'); // Вмикаємо "Режим Джеррі"
        console.log("⚠️ JERRY DETECTED. SYSTEM DOWNGRADE INITIATED.");

        // Можна навіть поміняти заголовок в сайдбарі
        const title = document.querySelector('aside h2');
        if (title) title.innerHTML = "JERRY'S PAD v1.0";
    } else {
        document.body.classList.remove('jerry-theme'); // Вимикаємо, якщо шукають нормальних людей

        // Повертаємо заголовок назад
        const title = document.querySelector('aside h2');
        if (title) title.innerHTML = "SMDS v4.2";
    }
    // -----------------------

    toggleLoader(true);
    const data = await fetchCharacters(currentSearch, currentPage, currentStatus, currentGender);
    renderCharacters(data.results, true);
    toggleLoader(false);
}

function highlightBtn(activeBtn: HTMLElement | null) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    activeBtn?.classList.add('active');
}

init();
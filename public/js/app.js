var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const searchInput = document.getElementById('search-input');
const filterStatus = document.getElementById('filter-status');
const filterGender = document.getElementById('filter-gender');
const btnGo = document.getElementById('btn-search-go');
const closeModalBtn = document.getElementById('close-modal');
const modalOverlay = document.getElementById('modal-overlay');
// СТАН ДОДАТКУ
let currentPage = 1;
let currentSearch = '';
let currentStatus = '';
let currentGender = '';
function init() {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(">> SMDS v4.2 SYSTEM READY");
        initAuth();
        const isLoggedIn = checkAuth();
        const allButtons = document.querySelectorAll('button');
        allButtons.forEach(btn => {
            btn.addEventListener('click', () => playSound('click'));
            btn.addEventListener('mouseenter', () => playSound('hover'));
        });
        if (isLoggedIn) {
            yield startSearch();
        }
        else {
            console.log(">> WAITING FOR AUTHENTICATION...");
        }
        // --- КНОПКИ МЕНЮ ---
        btnChars === null || btnChars === void 0 ? void 0 : btnChars.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            switchTab('view-characters');
            highlightBtn(btnChars);
            searchInput.value = '';
            filterStatus.value = '';
            filterGender.value = '';
            yield startSearch();
        }));
        // --- КНОПКА MY SQUAD (FAVORITES) ---
        btnFavs === null || btnFavs === void 0 ? void 0 : btnFavs.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            var _a;
            switchTab('view-characters');
            highlightBtn(btnFavs);
            toggleLoader(true);
            // Завантажуємо з бази
            const favorites = yield getFavorites();
            renderCharacters(favorites, true);
            // Ховаємо кнопку "Load More", бо це весь список
            (_a = document.getElementById('btn-load-more')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
            toggleLoader(false);
        }));
        // --- КНОПКА ЗАВАНТАЖИТИ ЩЕ ---
        btnLoadMore === null || btnLoadMore === void 0 ? void 0 : btnLoadMore.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            currentPage++;
            toggleLoader(true);
            const data = yield fetchCharacters(currentSearch, currentPage, currentStatus, currentGender);
            renderCharacters(data.results, false);
            toggleLoader(false);
        }));
        // --- КНОПКА GO (Фільтри) ---
        btnGo === null || btnGo === void 0 ? void 0 : btnGo.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            switchTab('view-characters');
            yield startSearch();
        }));
        // --- ІНШІ ВКЛАДКИ ---
        btnLocs === null || btnLocs === void 0 ? void 0 : btnLocs.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            switchTab('view-locations');
            highlightBtn(btnLocs);
            toggleLoader(true);
            const data = yield fetchLocations();
            renderLocations(data.results);
            toggleLoader(false);
        }));
        btnResearch === null || btnResearch === void 0 ? void 0 : btnResearch.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
            switchTab('view-research');
            highlightBtn(btnResearch);
            yield renderNotes();
        }));
        btnMap === null || btnMap === void 0 ? void 0 : btnMap.addEventListener('click', () => {
            switchTab('view-map');
            highlightBtn(btnMap);
        });
        // ПОШУК (Enter)
        searchInput.addEventListener('keypress', (e) => __awaiter(this, void 0, void 0, function* () {
            if (e.key === 'Enter') {
                switchTab('view-characters');
                yield startSearch();
            }
        }));
        closeModalBtn === null || closeModalBtn === void 0 ? void 0 : closeModalBtn.addEventListener('click', () => {
            modalOverlay === null || modalOverlay === void 0 ? void 0 : modalOverlay.classList.add('hidden');
        });
    });
}
function startSearch() {
    return __awaiter(this, void 0, void 0, function* () {
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
            if (title)
                title.innerHTML = "JERRY'S PAD v1.0";
        }
        else {
            document.body.classList.remove('jerry-theme'); // Вимикаємо, якщо шукають нормальних людей
            // Повертаємо заголовок назад
            const title = document.querySelector('aside h2');
            if (title)
                title.innerHTML = "SMDS v4.2";
        }
        // -----------------------
        toggleLoader(true);
        const data = yield fetchCharacters(currentSearch, currentPage, currentStatus, currentGender);
        renderCharacters(data.results, true);
        toggleLoader(false);
    });
}
function highlightBtn(activeBtn) {
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    activeBtn === null || activeBtn === void 0 ? void 0 : activeBtn.classList.add('active');
}
init();

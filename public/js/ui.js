var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// ВСІ ІМПОРТИ В ОДНОМУ РЯДКУ 👇
import { getNote, saveNote, getAllNotes, deleteNote, fetchResidents, addToFavorites, removeFromFavorites, checkFavorite } from './api.js';
import { playSound } from './audio.js';
const contentArea = document.getElementById('content-area');
const portalLoader = document.getElementById('portal-loader');
function speakData(text) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 0.5;
    utterance.rate = 1.1;
    const voices = window.speechSynthesis.getVoices();
    const enVoice = voices.find(v => v.lang.startsWith('en'));
    if (enVoice)
        utterance.voice = enVoice;
    window.speechSynthesis.speak(utterance);
}
export function toggleLoader(show) {
    if (show) {
        portalLoader.style.display = 'block';
        contentArea.style.opacity = '0.2';
    }
    else {
        portalLoader.style.display = 'none';
        contentArea.style.opacity = '1';
    }
}
export function renderCharacters(characters, clear = true) {
    const btnMore = document.getElementById('btn-load-more');
    if (clear) {
        contentArea.innerHTML = '';
        if (!characters || characters.length === 0) {
            contentArea.innerHTML = '<div style="color:red; text-align:center; margin-top: 50px;">>> NO LIFEFORMS DETECTED <<</div>';
            btnMore === null || btnMore === void 0 ? void 0 : btnMore.classList.add('hidden');
            return;
        }
    }
    characters.forEach(char => {
        const card = document.createElement('div');
        card.className = 'char-card';
        card.innerHTML = `
            <img src="${char.image}" alt="${char.name}">
            <h3>${char.name}</h3>
            <p>Status: <span style="color: ${getStatusColor(char.status)}">${char.status}</span></p>
        `;
        card.onclick = () => openModal(char);
        contentArea.appendChild(card);
    });
    if (characters.length > 0) {
        btnMore === null || btnMore === void 0 ? void 0 : btnMore.classList.remove('hidden');
    }
}
function getStatusColor(status) {
    if (status === 'Alive')
        return 'var(--rick-green)';
    if (status === 'Dead')
        return 'var(--rick-error)';
    return 'gray';
}
function openModal(char) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        playSound('click');
        const modal = document.getElementById('modal-overlay');
        const body = document.getElementById('modal-body');
        const noteInput = document.getElementById('char-note');
        const saveBtn = document.getElementById('save-note-btn');
        if (modal && body && noteInput && saveBtn) {
            modal.classList.remove('hidden');
            noteInput.value = 'Loading data...';
            let isFav = yield checkFavorite(char.id);
            const heartIcon = isFav ? '❤️' : '🤍';
            body.innerHTML = `
            <div style="display:flex; gap: 20px; align-items: center;">
                <img src="${char.image}" style="width: 100px; border-radius: 50%; border: 2px solid var(--rick-green);">
                <div style="flex-grow: 1;">
                    <h2 style="margin: 0; color: var(--rick-blue)">${char.name}</h2>
                    <p>${char.species} | ${char.location.name}</p>
                    <p>Status: ${char.status}</p>
                </div>
                
                <div style="display: flex; flex-direction: column; gap: 5px;">
                     <button id="speak-btn" style="background: transparent; border: 1px solid var(--rick-green); color: var(--rick-green); font-size: 1.5rem; cursor: pointer; padding: 5px;">🔊</button>
                     <button id="fav-btn" style="background: transparent; border: 1px solid var(--rick-error); color: var(--rick-error); font-size: 1.5rem; cursor: pointer; padding: 5px;">${heartIcon}</button>
                </div>
            </div>
        `;
            const favBtn = document.getElementById('fav-btn');
            favBtn === null || favBtn === void 0 ? void 0 : favBtn.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
                e.stopPropagation();
                if (isFav) {
                    yield removeFromFavorites(char.id);
                    favBtn.innerText = '🤍';
                    isFav = false;
                    playSound('click');
                }
                else {
                    yield addToFavorites(char);
                    favBtn.innerText = '❤️';
                    isFav = true;
                    playSound('success');
                }
            }));
            (_a = document.getElementById('speak-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (e) => {
                e.stopPropagation();
                const speechText = `Subject: ${char.name}. Status: ${char.status}. Species: ${char.species}. Origin: ${char.location.name}.`;
                speakData(speechText);
            });
            const savedText = yield getNote(char.id);
            noteInput.value = savedText;
            const newSaveBtn = saveBtn.cloneNode(true);
            (_b = saveBtn.parentNode) === null || _b === void 0 ? void 0 : _b.replaceChild(newSaveBtn, saveBtn);
            newSaveBtn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
                const text = noteInput.value;
                yield saveNote(char.id, char.name, text);
                playSound('success');
                alert(`✅ SAVED: ${char.name}`);
            }));
        }
    });
}
export function renderLocations(locations) {
    const locArea = document.getElementById('locations-area');
    if (!locArea)
        return;
    locArea.innerHTML = '';
    locations.forEach(loc => {
        const div = document.createElement('div');
        div.className = 'char-card';
        div.style.padding = '20px';
        div.style.cursor = 'pointer';
        div.innerHTML = `
            <h3 style="color: var(--rick-blue)">${loc.name}</h3>
            <p style="font-size: 0.8rem;">Type: ${loc.type}</p>
            <p style="font-size: 0.8rem; color: var(--rick-green);">${loc.residents.length} residents</p>
        `;
        div.onclick = () => openLocationModal(loc);
        locArea.appendChild(div);
    });
}
function openLocationModal(location) {
    return __awaiter(this, void 0, void 0, function* () {
        const modal = document.getElementById('modal-overlay');
        const body = document.getElementById('modal-body');
        if (modal && body) {
            modal.classList.remove('hidden');
            body.innerHTML = `
            <div style="text-align: center;">
                <h1 style="color: var(--rick-green); text-shadow: 0 0 10px var(--rick-green);">${location.name}</h1>
                <p>${location.type} | ${location.dimension}</p>
                <hr style="border: 1px dashed var(--rick-blue); margin: 20px 0;">
                <div id="residents-grid">
                    <p class="blink">SCANNING RESIDENTS...</p>
                </div>
                <p style="font-size: 0.8rem; margin-top: 10px; color: gray;">
                    Found ${location.residents.length} lifeforms. Scroll to view more.
                </p>
            </div>
        `;
            const residentUrls = location.residents.slice(0, 50);
            if (residentUrls.length === 0) {
                const grid = document.getElementById('residents-grid');
                if (grid)
                    grid.innerHTML = '<p>>> NO LIFEFORMS DETECTED <<</p>';
                return;
            }
            const ids = residentUrls.map((url) => url.split('/').pop());
            const residents = yield fetchResidents(ids);
            const grid = document.getElementById('residents-grid');
            if (grid) {
                grid.innerHTML = '';
                residents.forEach(char => {
                    const badge = document.createElement('div');
                    badge.className = 'resident-node';
                    badge.style.textAlign = 'center';
                    badge.style.width = '80px';
                    badge.innerHTML = `
                    <img src="${char.image}" style="width: 60px; height: 60px; border-radius: 50%; border: 2px solid var(--rick-blue);">
                    <div style="font-size: 0.7rem; margin-top: 5px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${char.name}</div>
                `;
                    badge.onclick = (e) => {
                        e.stopPropagation();
                        openModal(char);
                    };
                    grid.appendChild(badge);
                });
            }
        }
    });
}
export function renderNotes() {
    return __awaiter(this, void 0, void 0, function* () {
        const notesArea = document.getElementById('notes-area');
        if (!notesArea)
            return;
        notesArea.innerHTML = '<p>LOADING CLASSIFIED DATA...</p>';
        const notes = yield getAllNotes();
        notesArea.innerHTML = '';
        if (notes.length === 0) {
            notesArea.innerHTML = '<h3>NO RESEARCH DATA FOUND.</h3>';
            return;
        }
        notes.forEach((note) => {
            var _a;
            const div = document.createElement('div');
            div.style.border = '1px dashed var(--rick-green)';
            div.style.margin = '10px 0';
            div.style.padding = '15px';
            div.style.background = 'rgba(0, 50, 0, 0.3)';
            div.style.position = 'relative';
            div.innerHTML = `
            <h3 style="color: var(--rick-blue); margin: 0;">Subject: ${note.characterName}</h3>
            <p style="color: var(--rick-text); font-style: italic;">"${note.text}"</p>
            <small style="opacity: 0.6">Logged at: ${new Date(note.createdAt).toLocaleString()}</small>
            <button class="delete-btn" style="position: absolute; top: 10px; right: 10px; background: var(--rick-error); color: white; border: none; cursor: pointer; font-weight: bold;">X</button>
        `;
            (_a = div.querySelector('.delete-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', (e) => __awaiter(this, void 0, void 0, function* () {
                e.stopPropagation();
                if (confirm('ERASE DATA?')) {
                    yield deleteNote(note.characterId);
                    div.remove();
                    if (notesArea.children.length === 0)
                        notesArea.innerHTML = '<h3>NO RESEARCH DATA FOUND.</h3>';
                }
            }));
            notesArea.appendChild(div);
        });
    });
}
export function switchTab(tabId) {
    var _a;
    const allSections = document.querySelectorAll('.view-section');
    allSections.forEach(el => {
        el.classList.add('hidden');
        el.style.display = 'none';
    });
    const activeView = document.getElementById(tabId);
    if (activeView) {
        activeView.classList.remove('hidden');
        activeView.style.display = 'block';
    }
    (_a = document.getElementById('modal-overlay')) === null || _a === void 0 ? void 0 : _a.classList.add('hidden');
    window.scrollTo(0, 0);
}

var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const API_URL = 'https://rickandmortyapi.com/api/character';
// Допоміжна функція для заголовків (щоб додавати токен)
function getHeaders() {
    const token = localStorage.getItem('rick-token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // <--- ЦЕ ВАШ ПАСПОРТ
    };
}
export function fetchCharacters() {
    return __awaiter(this, arguments, void 0, function* (name = '', page = 1, status = '', gender = '') {
        try {
            let query = `${API_URL}/?page=${page}&name=${name}`;
            if (status)
                query += `&status=${status}`;
            if (gender)
                query += `&gender=${gender}`;
            const response = yield fetch(query);
            if (!response.ok)
                throw new Error('End of data');
            return yield response.json();
        }
        catch (error) {
            return { results: [] };
        }
    });
}
// --- FAVORITES (НОВІ ФУНКЦІЇ) ---
export function addToFavorites(char) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch('/api/favorites', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({
                characterId: char.id,
                name: char.name,
                image: char.image,
                status: char.status,
                species: char.species
            })
        });
    });
}
export function removeFromFavorites(charId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch(`/api/favorites/${charId}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
    });
}
export function getFavorites() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch('/api/favorites', { headers: getHeaders() });
        return yield res.json();
    });
}
export function checkFavorite(charId) {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch(`/api/favorites/check/${charId}`, { headers: getHeaders() });
        const data = yield res.json();
        return data.isFavorite;
    });
}
// --- NOTES (Оновлені з заголовками) ---
export function saveNote(charId, name, text) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch('/api/notes', {
            method: 'POST',
            headers: getHeaders(),
            body: JSON.stringify({ characterId: charId, characterName: name, text: text })
        });
    });
}
export function getNote(charId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const res = yield fetch(`/api/notes/${charId}`, { headers: getHeaders() });
            const data = yield res.json();
            return data.text || '';
        }
        catch (e) {
            return '';
        }
    });
}
export function getAllNotes() {
    return __awaiter(this, void 0, void 0, function* () {
        const res = yield fetch('/api/all-notes', { headers: getHeaders() });
        return yield res.json();
    });
}
export function deleteNote(charId) {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch(`/api/notes/${charId}`, {
            method: 'DELETE',
            headers: getHeaders()
        });
    });
}
// --- LOCATIONS ---
export function fetchLocations() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch('https://rickandmortyapi.com/api/location');
            return yield response.json();
        }
        catch (error) {
            return { results: [] };
        }
    });
}
export function fetchResidents(ids) {
    return __awaiter(this, void 0, void 0, function* () {
        if (ids.length === 0)
            return [];
        try {
            const response = yield fetch(`https://rickandmortyapi.com/api/character/${ids.join(',')}`);
            const data = yield response.json();
            return Array.isArray(data) ? data : [data];
        }
        catch (error) {
            return [];
        }
    });
}

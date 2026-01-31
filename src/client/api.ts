import { ApiResponse } from './interfaces.js';

const API_URL = 'https://rickandmortyapi.com/api/character';

// Допоміжна функція для заголовків (щоб додавати токен)
function getHeaders() {
    const token = localStorage.getItem('rick-token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // <--- ЦЕ ВАШ ПАСПОРТ
    };
}

export async function fetchCharacters(name: string = '', page: number = 1, status: string = '', gender: string = ''): Promise<ApiResponse> {
    try {
        let query = `${API_URL}/?page=${page}&name=${name}`;
        if (status) query += `&status=${status}`;
        if (gender) query += `&gender=${gender}`;

        const response = await fetch(query);
        if (!response.ok) throw new Error('End of data');
        return await response.json();
    } catch (error) {
        return { results: [] };
    }
}

// --- FAVORITES (НОВІ ФУНКЦІЇ) ---

export async function addToFavorites(char: any) {
    await fetch('/api/favorites', {
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
}

export async function removeFromFavorites(charId: number) {
    await fetch(`/api/favorites/${charId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
}

export async function getFavorites(): Promise<any[]> {
    const res = await fetch('/api/favorites', { headers: getHeaders() });
    return await res.json();
}

export async function checkFavorite(charId: number): Promise<boolean> {
    const res = await fetch(`/api/favorites/check/${charId}`, { headers: getHeaders() });
    const data = await res.json();
    return data.isFavorite;
}

// --- NOTES (Оновлені з заголовками) ---

export async function saveNote(charId: number, name: string, text: string) {
    await fetch('/api/notes', {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ characterId: charId, characterName: name, text: text })
    });
}

export async function getNote(charId: number): Promise<string> {
    try {
        const res = await fetch(`/api/notes/${charId}`, { headers: getHeaders() });
        const data = await res.json();
        return data.text || '';
    } catch (e) {
        return '';
    }
}

export async function getAllNotes(): Promise<any[]> {
    const res = await fetch('/api/all-notes', { headers: getHeaders() });
    return await res.json();
}

export async function deleteNote(charId: number) {
    await fetch(`/api/notes/${charId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
}

// --- LOCATIONS ---
export async function fetchLocations(): Promise<any> {
    try {
        const response = await fetch('https://rickandmortyapi.com/api/location');
        return await response.json();
    } catch (error) {
        return { results: [] };
    }
}

export async function fetchResidents(ids: string[]): Promise<any[]> {
    if (ids.length === 0) return [];
    try {
        const response = await fetch(`https://rickandmortyapi.com/api/character/${ids.join(',')}`);
        const data = await response.json();
        return Array.isArray(data) ? data : [data];
    } catch (error) {
        return [];
    }
}
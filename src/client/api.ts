import { ApiResponse, Character, Note, Location } from './interfaces.js';

const API_URL = 'https://rickandmortyapi.com/api/character';
const LOCATION_URL = 'https://rickandmortyapi.com/api/location';

function getHeaders() {
    const token = localStorage.getItem('rick-token');
    return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
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

export async function fetchResidents(ids: string[]): Promise<Character[]> {
    if (ids.length === 0) return [];
    try {
        const response = await fetch(`${API_URL}/${ids.join(',')}`);
        const data = await response.json();
        return Array.isArray(data) ? data : [data];
    } catch (error) {
        return [];
    }
}

export async function addToFavorites(char: Character) {
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

export async function getFavorites(): Promise<Character[]> {
    try {
        const res = await fetch('/api/favorites', { headers: getHeaders() });
        if (!res.ok) return [];
        return await res.json();
    } catch (e) {
        return [];
    }
}

export async function checkFavorite(charId: number): Promise<boolean> {
    try {
        const res = await fetch(`/api/favorites/check/${charId}`, { headers: getHeaders() });
        const data = await res.json();
        return data.isFavorite;
    } catch (e) {
        return false;
    }
}

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

export async function getAllNotes(): Promise<Note[]> {
    try {
        const res = await fetch('/api/all-notes', { headers: getHeaders() });
        if (!res.ok) return [];
        return await res.json();
    } catch (e) {
        return [];
    }
}

export async function deleteNote(charId: number) {
    await fetch(`/api/notes/${charId}`, {
        method: 'DELETE',
        headers: getHeaders()
    });
}

export async function fetchLocations(): Promise<{ results: Location[] }> {
    try {
        const response = await fetch(LOCATION_URL);
        if (!response.ok) throw new Error('Failed to load locations');
        return await response.json();
    } catch (error) {
        return { results: [] };
    }
}
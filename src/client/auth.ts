import { playSound } from './audio.js';

const loginScreen = document.getElementById('login-screen');
const usernameInput = document.getElementById('auth-username') as HTMLInputElement;
const passwordInput = document.getElementById('auth-password') as HTMLInputElement;
const loginBtn = document.getElementById('btn-login-action');
const registerBtn = document.getElementById('btn-register-action');
const messageBox = document.getElementById('auth-message');

const userDisplay = document.getElementById('user-display');
const logoutBtn = document.getElementById('btn-logout');

export function checkAuth(): boolean {
    const token = localStorage.getItem('rick-token');
    const username = localStorage.getItem('rick-username');

    if (token && username) {
        if (loginScreen) loginScreen.classList.add('hidden');
        updateUserInfo(username);
        return true;
    }
    return false;
}

function updateUserInfo(name: string) {
    if (userDisplay) {
        userDisplay.innerText = `USER: ${name.toUpperCase()}`;
    }
}

function showMessage(msg: string, isError: boolean = true) {
    if (messageBox) {
        messageBox.innerText = msg;
        messageBox.style.color = isError ? 'var(--rick-error)' : 'var(--rick-green)';
    }
}

function performLogout() {
    playSound('click');
    localStorage.removeItem('rick-token');
    localStorage.removeItem('rick-username');

    location.reload();
}

export function initAuth() {
    logoutBtn?.addEventListener('click', performLogout);

    loginBtn?.addEventListener('click', async () => {
        playSound('click');
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (!username || !password) {
            showMessage("ENTER CREDENTIALS!");
            return;
        }

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('rick-token', data.token);
                localStorage.setItem('rick-username', data.username);

                playSound('success');
                showMessage("ACCESS GRANTED", false);

                setTimeout(() => {
                    if (loginScreen) loginScreen.classList.add('hidden');
                    updateUserInfo(data.username);
                    location.reload();
                }, 1000);
            } else {
                playSound('hover');
                showMessage(data.error || "ACCESS DENIED");
            }
        } catch (e) {
            showMessage("SERVER ERROR");
        }
    });

    registerBtn?.addEventListener('click', async () => {
        playSound('click');
        const username = usernameInput.value;
        const password = passwordInput.value;

        if (!username || !password) {
            showMessage("ENTER DATA FOR NEW ID");
            return;
        }

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = await res.json();

            if (res.ok) {
                playSound('success');
                showMessage("REGISTRATION COMPLETE. PLEASE LOGIN.", false);
                passwordInput.value = '';
            } else {
                showMessage(data.error || "REGISTRATION FAILED");
            }
        } catch (e) {
            showMessage("SERVER ERROR");
        }
    });
}
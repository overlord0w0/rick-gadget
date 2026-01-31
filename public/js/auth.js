var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { playSound } from './audio.js';
// Елементи форми входу
const loginScreen = document.getElementById('login-screen');
const usernameInput = document.getElementById('auth-username');
const passwordInput = document.getElementById('auth-password');
const loginBtn = document.getElementById('btn-login-action');
const registerBtn = document.getElementById('btn-register-action');
const messageBox = document.getElementById('auth-message');
// Елементи сайдбару
const userDisplay = document.getElementById('user-display');
const logoutBtn = document.getElementById('btn-logout'); // <--- НОВА КНОПКА
// Перевірка при старті
export function checkAuth() {
    const token = localStorage.getItem('rick-token');
    const username = localStorage.getItem('rick-username');
    if (token && username) {
        if (loginScreen)
            loginScreen.classList.add('hidden');
        updateUserInfo(username);
        return true;
    }
    return false;
}
// Оновлення імені в сайдбарі
function updateUserInfo(name) {
    if (userDisplay) {
        userDisplay.innerText = `USER: ${name.toUpperCase()}`;
    }
}
function showMessage(msg, isError = true) {
    if (messageBox) {
        messageBox.innerText = msg;
        messageBox.style.color = isError ? 'var(--rick-error)' : 'var(--rick-green)';
    }
}
// Функція виходу
function performLogout() {
    playSound('click');
    // 1. Видаляємо ключі
    localStorage.removeItem('rick-token');
    localStorage.removeItem('rick-username');
    // 2. Перезавантажуємо сторінку (найпростіший спосіб повернути екран входу)
    location.reload();
}
export function initAuth() {
    // Слухаємо кнопку виходу
    logoutBtn === null || logoutBtn === void 0 ? void 0 : logoutBtn.addEventListener('click', performLogout);
    // Логін
    loginBtn === null || loginBtn === void 0 ? void 0 : loginBtn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
        playSound('click');
        const username = usernameInput.value;
        const password = passwordInput.value;
        if (!username || !password) {
            showMessage("ENTER CREDENTIALS!");
            return;
        }
        try {
            const res = yield fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = yield res.json();
            if (res.ok) {
                localStorage.setItem('rick-token', data.token);
                localStorage.setItem('rick-username', data.username);
                playSound('success');
                showMessage("ACCESS GRANTED", false);
                setTimeout(() => {
                    if (loginScreen)
                        loginScreen.classList.add('hidden');
                    updateUserInfo(data.username);
                    // Перезавантажимо сторінку, щоб підтягнути дані саме цього юзера
                    location.reload();
                }, 1000);
            }
            else {
                playSound('hover');
                showMessage(data.error || "ACCESS DENIED");
            }
        }
        catch (e) {
            showMessage("SERVER ERROR");
        }
    }));
    // Реєстрація
    registerBtn === null || registerBtn === void 0 ? void 0 : registerBtn.addEventListener('click', () => __awaiter(this, void 0, void 0, function* () {
        playSound('click');
        const username = usernameInput.value;
        const password = passwordInput.value;
        if (!username || !password) {
            showMessage("ENTER DATA FOR NEW ID");
            return;
        }
        try {
            const res = yield fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });
            const data = yield res.json();
            if (res.ok) {
                playSound('success');
                showMessage("REGISTRATION COMPLETE. PLEASE LOGIN.", false);
                passwordInput.value = '';
            }
            else {
                showMessage(data.error || "REGISTRATION FAILED");
            }
        }
        catch (e) {
            showMessage("SERVER ERROR");
        }
    }));
}

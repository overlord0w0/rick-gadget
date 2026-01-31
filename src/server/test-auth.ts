// test-auth.ts
// Цей скрипт імітує роботу сайту: пробує зареєструватись і увійти
async function testAuth() {
    console.log("1. Пробую зареєструвати юзера 'Morty'...");

    // 1. Реєстрація
    const regRes = await fetch('http://localhost:3000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'Morty', password: 'password123' })
    });
    console.log("Registration Status:", regRes.status, await regRes.json());

    console.log("\n2. Пробую увійти як 'Morty'...");

    // 2. Логін
    const loginRes = await fetch('http://localhost:3000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: 'Morty', password: 'password123' })
    });
    const loginData = await loginRes.json();
    console.log("Login Status:", loginRes.status);
    console.log("TOKEN:", loginData.token ? "✅ ОТРИМАНО" : "❌ НЕМАЄ");
}

testAuth();
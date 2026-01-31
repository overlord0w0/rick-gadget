import mongoose from 'mongoose';
import Note from './note.model';

async function testConnection() {
    console.log("1. Починаю підключення...");

    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/rick-gadget');
        console.log("🟢 2. Підключення успішне!");

        console.log("3. Спроба створити тестовий запис...");
        const testNote = new Note({
            characterId: 999,
            characterName: 'Test Rick',
            text: 'Це тестовий запис з діагностичного файлу.'
        });

        const savedNote = await testNote.save();
        console.log("✅ 4. ЗАПИС УСПІШНО СТВОРЕНО:", savedNote);

        const foundNote = await Note.findOne({ characterId: 999 });
        console.log("🔍 5. Знайдено в базі:", foundNote);

    } catch (error) {
        console.error("🔴 ПОМИЛКА:", error);
    } finally {
        await mongoose.connection.close();
        console.log("6. З'єднання закрито.");
    }
}

testConnection();
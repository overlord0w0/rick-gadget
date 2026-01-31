import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true }, // Ім'я (має бути унікальним)
    password: { type: String, required: true }, // Зашифрований пароль
    role: { type: String, default: 'user' }, // Роль: 'user' або 'admin'
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
export default User;
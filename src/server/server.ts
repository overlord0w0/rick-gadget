import express from 'express';
import mongoose from 'mongoose';
import path from 'path';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Note from './note.model';
import User from './user.model';
import Favorite from './favorite.model';

console.log("SYSTEM REBOOT: ADMIN PROTOCOLS ENGAGED");

const app = express();
const PORT = 3000;
const SECRET_KEY = 'rick-sanchez-secret-wubba-lubba-dub-dub';
const ADMIN_NAME = 'Rick Number One';

const MONGO_URI = 'mongodb+srv://moko:nazarIX1@moko.hdn8ymr.mongodb.net/?appName=moko';

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Atlas connected'))
    .catch((err) => console.error('MongoDB error:', err));

app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.json());

const getAuth = (req: express.Request) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return null;

    try {
        const token = authHeader.split(' ')[1];
        const decoded: any = jwt.verify(token, SECRET_KEY);
        return decoded;
    } catch (e) {
        return null;
    }
};

app.post('/api/auth/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ error: 'User exists' });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, password: hashedPassword });
        await newUser.save();
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: 'Registration failed' });
    }
});

app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        const token = jwt.sign({ id: user._id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });
        res.json({ token, username });
    } catch (err) {
        res.status(500).json({ error: 'Login failed' });
    }
});

app.get('/api/notes/:charId', async (req, res) => {
    const user = getAuth(req);
    if (!user) return res.json({ text: '' });

    const query = user.username === ADMIN_NAME
        ? { characterId: req.params.charId }
        : { characterId: req.params.charId, userId: user.id };

    const note = await Note.findOne(query).sort({ createdAt: -1 });
    res.json(note || { text: '' });
});

app.post('/api/notes', async (req, res) => {
    const user = getAuth(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const { characterId, characterName, text } = req.body;

    const updatedNote = await Note.findOneAndUpdate(
        { characterId, userId: user.id },
        { characterName, text, userId: user.id, createdAt: new Date() },
        { new: true, upsert: true }
    );
    res.json(updatedNote);
});

app.get('/api/all-notes', async (req, res) => {
    const user = getAuth(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    let filter = {};

    if (user.username !== ADMIN_NAME) {
        filter = { userId: user.id };
    } else {
        console.log(`ADMIN ACCESS: ${ADMIN_NAME} is viewing ALL DATABASE RECORDS.`);
    }

    const notes = await Note.find(filter).sort({ createdAt: -1 });
    res.json(notes);
});

app.delete('/api/notes/:charId', async (req, res) => {
    const user = getAuth(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const query = user.username === ADMIN_NAME
        ? { characterId: req.params.charId }
        : { characterId: req.params.charId, userId: user.id };

    await Note.findOneAndDelete(query);
    res.json({ success: true });
});

app.post('/api/favorites', async (req, res) => {
    const user = getAuth(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    try {
        const fav = new Favorite({ ...req.body, userId: user.id });
        await fav.save();
        res.json({ success: true });
    } catch (e) {
        res.status(400).json({ error: 'Already favorites' });
    }
});

app.delete('/api/favorites/:charId', async (req, res) => {
    const user = getAuth(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    await Favorite.findOneAndDelete({ characterId: req.params.charId, userId: user.id });
    res.json({ success: true });
});

app.get('/api/favorites', async (req, res) => {
    const user = getAuth(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const favs = await Favorite.find({ userId: user.id }).sort({ addedAt: -1 });
    res.
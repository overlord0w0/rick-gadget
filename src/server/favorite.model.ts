import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    characterId: { type: Number, required: true },
    name: { type: String, required: true },
    image: { type: String, required: true },
    status: { type: String, required: true },
    species: { type: String },
    addedAt: { type: Date, default: Date.now }
});

favoriteSchema.index({ userId: 1, characterId: 1 }, { unique: true });

const Favorite = mongoose.model('Favorite', favoriteSchema);
export default Favorite;
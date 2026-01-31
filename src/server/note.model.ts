import mongoose, { Schema, Document } from 'mongoose';

export interface INote extends Document {
    characterId: number;
    characterName: string;
    text: string;
    createdAt: Date;
}

const NoteSchema: Schema = new Schema({
    userId: { type: String },
    characterId: { type: Number, required: true, unique: true },
    characterName: { type: String, required: true },
    text: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<INote>('Note', NoteSchema);
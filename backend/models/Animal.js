import mongoose from 'mongoose';

const animalSchema = new mongoose.Schema({

    tagNumber: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    breed: {
        type: String,
        required: true,
        trim: true
    },

    age: {
        type: Number,
        required: true,
        min: 0
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }

}, {
    timestamps: true
});

const Animal = mongoose.model('Animal', animalSchema);

export default Animal;
import express from 'express';

import { protect } from '../middleware/authMiddleware.js';

import {
    createAnimal,
    getAnimals,
    getAnimalById,
    updateAnimal,
    deleteAnimal
} from '../controllers/animalController.js';

const router = express.Router();

// All animal routes require authentication
router.use(protect);

router.post('/', createAnimal);

router.get('/', getAnimals);

router.get('/:id', getAnimalById);

router.put('/:id', updateAnimal);

router.delete('/:id', deleteAnimal);

export default router;
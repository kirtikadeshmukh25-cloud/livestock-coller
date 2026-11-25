import Animal from '../models/Animal.js';

// CREATE ANIMAL
export const createAnimal = async (req, res) => {

    try {

        const { tagNumber, breed, age } = req.body;

        if (!tagNumber || !breed || age === undefined) {
            return res.status(400).json({
                error: 'All animal fields are required'
            });
        }

        const animal = await Animal.create({
            tagNumber,
            breed,
            age,
            owner: req.user._id
        });

        res.status(201).json({
            message: 'Animal added successfully',
            animal
        });

    } catch (error) {

        if (error.code === 11000) {
            return res.status(409).json({
                error: 'Tag number already exists'
            });
        }

        res.status(400).json({
            error: error.message
        });

    }

};


// GET ALL ANIMALS
export const getAnimals = async (req, res) => {

    try {

        const animals = await Animal.find({
            owner: req.user._id
        }).sort({ createdAt: -1 });

        res.status(200).json({
            count: animals.length,
            animals
        });

    } catch (error) {

        res.status(500).json({
            error: error.message
        });

    }

};


// GET SINGLE ANIMAL
export const getAnimalById = async (req, res) => {

    try {

        const animal = await Animal.findOne({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!animal) {
            return res.status(404).json({
                error: 'Animal not found'
            });
        }

        res.status(200).json({
            animal
        });

    } catch (error) {

        res.status(400).json({
            error: 'Invalid animal ID'
        });

    }

};


// UPDATE ANIMAL
export const updateAnimal = async (req, res) => {

    try {

        const { tagNumber, breed, age } = req.body;

        const animal = await Animal.findOneAndUpdate(
            {
                _id: req.params.id,
                owner: req.user._id
            },
            {
                tagNumber,
                breed,
                age
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!animal) {
            return res.status(404).json({
                error: 'Animal not found'
            });
        }

        res.status(200).json({
            message: 'Animal updated successfully',
            animal
        });

    } catch (error) {

        if (error.code === 11000) {
            return res.status(409).json({
                error: 'Tag number already exists'
            });
        }

        res.status(400).json({
            error: error.message
        });

    }

};


// DELETE ANIMAL
export const deleteAnimal = async (req, res) => {

    try {

        const animal = await Animal.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id
        });

        if (!animal) {
            return res.status(404).json({
                error: 'Animal not found'
            });
        }

        res.status(200).json({
            message: 'Animal deleted successfully'
        });

    } catch (error) {

        res.status(400).json({
            error: 'Invalid animal ID'
        });

    }

};

import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Generate JWT token
const createToken = (id) => {

    return jwt.sign(
        { id },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
    );

};

// Cookie configuration
const cookieOptions = {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60 * 1000,
    path: '/'
};

// REGISTER USER
export const register = async (req, res) => {

    try {

        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                error: 'All fields are required'
            });
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            return res.status(400).json({
                error: 'Invalid email address'
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                error: 'Password must contain at least 6 characters'
            });
        }

        const existingUser = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (existingUser) {
            return res.status(409).json({
                error: 'Email already registered'
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        res.status(201).json({
            message: 'Registration successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email
            }
        });

    } catch (error) {

        console.error('Register Error:', error.message);

        res.status(500).json({
            error: 'Server error'
        });

    }

};


// LOGIN USER
export const login = async (req, res) => {

    try {

        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                error: 'Email and password are required'
            });
        }

        const user = await User.findOne({
            email: email.trim().toLowerCase()
        });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({
                error: 'Invalid email or password'
            });
        }

        const token = createToken(user._id);

        res.cookie('token', token, cookieOptions);

        res.status(200).json({
            message: 'Login successful',

            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {

        console.error('Login Error:', error.message);

        res.status(500).json({
            error: 'Server error'
        });

    }

};


// GET LOGGED-IN USER
export const getUser = async (req, res) => {

    try {

        const user = await User.findById(req.user._id)
            .select('-password');

        if (!user) {
            return res.status(404).json({
                error: 'User not found'
            });
        }

        res.status(200).json({
            user
        });

    } catch (error) {

        res.status(500).json({
            error: 'Server error'
        });

    }

};


// LOGOUT USER
export const logout = (req, res) => {

    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/'
    });

    res.status(200).json({
        message: 'Logged out successfully'
    });

};
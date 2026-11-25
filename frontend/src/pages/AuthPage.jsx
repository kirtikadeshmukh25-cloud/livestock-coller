import React, { useState, useRef, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';

import api from '../utils/axios';

import FormInput from '../components/FormInput';

function AuthPage() {

    const [form, setForm] = useState({
        name: '',
        email: '',
        password: ''
    });

    const [login, setLogin] = useState(true);

    const [errors, setErrors] = useState({});

    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const firstInputRef = useRef(null);


    // FOCUS FIRST INPUT
    useEffect(() => {

        firstInputRef.current?.focus();

    }, [login]);


    // INPUT CHANGE
    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };


    // VALIDATION
    const validate = () => {

        const newErrors = {};

        if (!login && !form.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
            newErrors.email = 'Enter a valid email';
        }

        if (form.password.length < 6) {
            newErrors.password = 'Minimum 6 characters required';
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;

    };


    // SUBMIT FORM
    const handleSubmit = async (e) => {

        e.preventDefault();

        if (!validate()) return;

        setLoading(true);

        try {

            const url = login
                ? '/auth/login'
                : '/auth/register';

            const response = await api.post(url, form);

            toast.success(response.data.message);

            if (login) {

                navigate('/home');

            } else {

                setLogin(true);

                setForm({
                    name: '',
                    email: '',
                    password: ''
                });

                setErrors({});

            }

        } catch (error) {

            toast.error(
                error.response?.data?.error || 'Something went wrong'
            );

        } finally {

            setLoading(false);

        }

    };


    // SWITCH LOGIN / REGISTER
    const toggleForm = () => {

        setLogin(!login);

        setErrors({});

        setForm({
            name: '',
            email: '',
            password: ''
        });

    };


    return (

        <div className="auth-page">

            <div className="auth-container">

                <div className="auth-heading">

                    <div className="brand-icon">
                        <span>LC</span>
                    </div>

                    <h1>Livestock Collar</h1>

                    <p>
                        Smart Livestock Management System
                    </p>

                </div>


                <h2>
                    {login ? 'Welcome Back' : 'Create Account'}
                </h2>

                <p className="form-subtitle">
                    {login
                        ? 'Login to manage your livestock'
                        : 'Register to get started'}
                </p>


                <form onSubmit={handleSubmit} noValidate>

                    {!login && (

                        <FormInput
                            ref={firstInputRef}
                            label="Full Name"
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            error={errors.name}
                            placeholder="Enter your name"
                        />

                    )}


                    <FormInput
                        ref={login ? firstInputRef : null}
                        label="Email Address"
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        error={errors.email}
                        placeholder="Enter your email"
                    />


                    <FormInput
                        label="Password"
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        error={errors.password}
                        placeholder="Enter your password"
                    />


                    <button
                        type="submit"
                        className="primary-btn"
                        disabled={loading}
                    >

                        {loading
                            ? 'Please wait...'
                            : login
                                ? 'Login'
                                : 'Create Account'}

                    </button>

                </form>


                <div className="toggle-text">

                    {login
                        ? "Don't have an account?"
                        : 'Already have an account?'}

                    <button
                        type="button"
                        onClick={toggleForm}
                        disabled={loading}
                    >

                        {login ? 'Register' : 'Login'}

                    </button>

                </div>

            </div>

        </div>

    );

}

export default AuthPage;
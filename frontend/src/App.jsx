import React from 'react';

import {
    BrowserRouter,
    Routes,
    Route,
    Navigate
} from 'react-router-dom';

import { ToastContainer } from 'react-toastify';

import 'react-toastify/dist/ReactToastify.css';

import AuthPage from './pages/AuthPage';

import HomePage from './pages/HomePage';

function App() {

    return (

        <BrowserRouter>

            <Routes>

                <Route
                    path="/"
                    element={<AuthPage />}
                />

                <Route
                    path="/home"
                    element={<HomePage />}
                />

                <Route
                    path="*"
                    element={<Navigate to="/" />}
                />

            </Routes>


            <ToastContainer
                position="top-right"
                autoClose={3000}
                theme="light"
            />

        </BrowserRouter>

    );

}

export default App;
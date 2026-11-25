import React, { useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { toast } from 'react-toastify';

import {
    Plus,
    Pencil,
    Trash2,
    LogOut,
    PawPrint,
    Users,
    Search,
    X
} from 'lucide-react';

import api from '../utils/axios';


function HomePage() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);

    const [animals, setAnimals] = useState([]);

    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState('');

    const [showForm, setShowForm] = useState(false);

    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        tagNumber: '',
        breed: '',
        age: ''
    });


    // FETCH USER AND ANIMALS
    const fetchData = async () => {

        try {

            const [userResponse, animalResponse] = await Promise.all([
                api.get('/auth/me'),
                api.get('/animals')
            ]);

            setUser(userResponse.data.user);

            setAnimals(animalResponse.data.animals);

        } catch (error) {

            toast.error('Please login first');

            navigate('/');

        } finally {

            setLoading(false);

        }

    };


    useEffect(() => {

        fetchData();

    }, []);


    // INPUT CHANGE
    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };


    // RESET FORM
    const resetForm = () => {

        setForm({
            tagNumber: '',
            breed: '',
            age: ''
        });

        setEditId(null);

        setShowForm(false);

    };


    // ADD OR UPDATE ANIMAL
    const handleSubmit = async (e) => {

        e.preventDefault();

        if (
            !form.tagNumber.trim() ||
            !form.breed.trim() ||
            form.age === ''
        ) {

            toast.error('Please fill all fields');

            return;

        }

        if (!Number.isFinite(Number(form.age)) || Number(form.age) < 0) {

            toast.error('Enter a valid age');

            return;

        }

        try {

            const animalData = {
                ...form,
                age: Number(form.age)
            };

            if (editId) {

                await api.put(`/animals/${editId}`, animalData);

                toast.success('Animal updated successfully');

            } else {

                await api.post('/animals', animalData);

                toast.success('Animal added successfully');

            }

            resetForm();

            await fetchAnimals();

        } catch (error) {

            toast.error(
                error.response?.data?.error || 'Operation failed'
            );

        }

    };


    // FETCH ANIMALS
    const fetchAnimals = async () => {

        try {

            const response = await api.get('/animals');

            setAnimals(response.data.animals);

        } catch (error) {

            toast.error('Unable to load animals');

        }

    };


    // EDIT ANIMAL
    const handleEdit = (animal) => {

        setEditId(animal._id);

        setForm({
            tagNumber: animal.tagNumber,
            breed: animal.breed,
            age: String(animal.age)
        });

        setShowForm(true);

    };


    // DELETE ANIMAL
    const handleDelete = async (id) => {

        const confirmDelete = window.confirm(
            'Are you sure you want to delete this animal?'
        );

        if (!confirmDelete) return;

        try {

            await api.delete(`/animals/${id}`);

            toast.success('Animal deleted successfully');

            await fetchAnimals();

        } catch (error) {

            toast.error('Unable to delete animal');

        }

    };


    // LOGOUT
    const handleLogout = async () => {

        try {

            await api.post('/auth/logout');

            toast.success('Logged out successfully');

            navigate('/');

        } catch (error) {

            toast.error('Logout failed');

        }

    };


    // SEARCH
    const filteredAnimals = animals.filter((animal) => {

        return (
            animal.tagNumber.toLowerCase().includes(search.toLowerCase()) ||
            animal.breed.toLowerCase().includes(search.toLowerCase())
        );

    });


    if (loading) {

        return (
            <div className="loading">
                Loading Dashboard...
            </div>
        );

    }


    return (

        <div className="dashboard">

            {/* NAVBAR */}

            <header className="navbar">

                <div className="nav-brand">

                    <div className="brand-icon">
                        LC
                    </div>

                    <div>
                        <h2>Livestock Collar</h2>
                        <p>Management System</p>
                    </div>

                </div>


                <div className="nav-user">

                    <span>
                        {user?.name}
                    </span>

                    <button
                        onClick={handleLogout}
                        className="logout-btn"
                    >
                        <LogOut size={17} />
                        Logout
                    </button>

                </div>

            </header>


            {/* MAIN CONTENT */}

            <main className="dashboard-content">

                <div className="welcome-section">

                    <div>

                        <h1>
                            Welcome, {user?.name}
                        </h1>

                        <p>
                            Manage and monitor your livestock records.
                        </p>

                    </div>

                    <button
                        className="add-btn"
                        onClick={() => {
                            resetForm();
                            setShowForm(true);
                        }}
                    >

                        <Plus size={18} />

                        Add Animal

                    </button>

                </div>


                {/* STATISTICS */}

                <div className="stats-grid">

                    <div className="stat-card">

                        <div className="stat-icon">
                            <PawPrint />
                        </div>

                        <div>

                            <p>Total Animals</p>

                            <h2>{animals.length}</h2>

                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon">
                            <Users />
                        </div>

                        <div>

                            <p>Account Type</p>

                            <h2>{user?.role || 'user'}</h2>

                        </div>

                    </div>

                </div>


                {/* ANIMAL TABLE */}

                <section className="animal-section">

                    <div className="section-header">

                        <div>

                            <h2>Animal Records</h2>

                            <p>
                                Manage your registered livestock.
                            </p>

                        </div>


                        <div className="search-box">

                            <Search size={18} />

                            <input
                                type="text"
                                placeholder="Search animals..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />

                        </div>

                    </div>


                    {showForm && (

                        <div className="animal-form-card">

                            <div className="form-title">

                                <h3>
                                    {editId ? 'Update Animal' : 'Add New Animal'}
                                </h3>

                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="close-btn"
                                >
                                    <X />
                                </button>

                            </div>


                            <form onSubmit={handleSubmit}>

                                <div className="animal-form-grid">

                                    <div className="form-group">

                                        <label>Tag Number</label>

                                        <input
                                            name="tagNumber"
                                            value={form.tagNumber}
                                            onChange={handleChange}
                                            placeholder="Enter tag number"
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>Breed</label>

                                        <input
                                            name="breed"
                                            value={form.breed}
                                            onChange={handleChange}
                                            placeholder="Enter breed"
                                        />

                                    </div>


                                    <div className="form-group">

                                        <label>Age</label>

                                        <input
                                            type="number"
                                            min="0"
                                            name="age"
                                            value={form.age}
                                            onChange={handleChange}
                                            placeholder="Enter age"
                                        />

                                    </div>

                                </div>


                                <button
                                    type="submit"
                                    className="add-btn"
                                >

                                    {editId ? 'Update Animal' : 'Save Animal'}

                                </button>

                            </form>

                        </div>

                    )}


                    <div className="table-wrapper">

                        <table>

                            <thead>

                                <tr>
                                    <th>Tag Number</th>
                                    <th>Breed</th>
                                    <th>Age</th>
                                    <th>Actions</th>
                                </tr>

                            </thead>


                            <tbody>

                                {filteredAnimals.length === 0 ? (

                                    <tr>

                                        <td colSpan="4" className="empty">

                                            No animals found.

                                        </td>

                                    </tr>

                                ) : (

                                    filteredAnimals.map((animal) => (

                                        <tr key={animal._id}>

                                            <td>
                                                {animal.tagNumber}
                                            </td>

                                            <td>
                                                {animal.breed}
                                            </td>

                                            <td>
                                                {animal.age}
                                            </td>

                                            <td>

                                                <div className="action-buttons">

                                                    <button
                                                        className="edit-btn"
                                                        onClick={() => handleEdit(animal)}
                                                        title="Edit"
                                                    >
                                                        <Pencil size={17} />
                                                    </button>

                                                    <button
                                                        className="delete-btn"
                                                        onClick={() => handleDelete(animal._id)}
                                                        title="Delete"
                                                    >
                                                        <Trash2 size={17} />
                                                    </button>

                                                </div>

                                            </td>

                                        </tr>

                                    ))

                                )}

                            </tbody>

                        </table>

                    </div>

                </section>

            </main>

        </div>

    );

}

export default HomePage;
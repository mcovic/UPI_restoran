import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { paths } from '../../routes/paths.ts';
import c from './index.module.css';
import axiosInstance, { endpoints } from '../../utils/axios';

// ----------------------------------------------------------------------

const Login: React.FC = () => {
    const [ credentials, setCredentials ] = useState({
        emailOrUsernameValue: '',
        password: '',
    });
    const [ error, setError ] = useState('');

    const navigate = useNavigate();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setCredentials((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const isEmailEntered = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
            credentials.emailOrUsernameValue,
        );
        try {
            const response = await axiosInstance.post(endpoints.auth.login, {
                [isEmailEntered ? 'email' : 'username']: credentials.emailOrUsernameValue,
                password: credentials.password,
            });
            localStorage.setItem('accessToken', response.data.accessToken);

            navigate(paths.home.root);
        } catch (err: any) {
            console.error('Login error:', err.response?.data || err.message);
            setError(err.response?.data?.message || 'Login failed');
        }
    };
    return (
        <div className={c.loginContainer}>
            <h1 className={c.loginHeader}>Login</h1>
            <form className={c.loginForm} onSubmit={handleSubmit}>
                <div className={c.inputGroup}>
                    <label htmlFor="emailOrUsernameValue">E-mail / Username</label>
                    <input
                        type="text"
                        id="emailOrUsernameValue"
                        name="emailOrUsernameValue"
                        placeholder="Your email or username"
                        value={credentials.emailOrUsernameValue}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                <div className={c.inputGroup}>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Password"
                        value={credentials.password}
                        onChange={handleInputChange}
                        required
                    />
                </div>
                {error && <p className={c.error}>{error}</p>}
                <button type="submit" className={c.loginButton}>
                    Login
                </button>
            </form>

            <p className={c.loginFooter}>
                Don’t have an account? <a href={paths.auth.register}> Register</a>
            </p>
            <p className={c.loginFooter}>
                <a href={paths.home.root}>Go to Home</a>
            </p>
        </div>
    );
};

export default Login;

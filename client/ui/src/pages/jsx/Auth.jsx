import React, { useState, useEffect } from 'react';
import styles from '../css/Auth.module.css';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [message, setMessage] = useState({ text: '', type: '' });
    const [isLogin, setIsLogin] = useState(true);
    const [name, setName] = useState('');
    const [id, setId] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [role, setRole] = useState('');


    let navigate = useNavigate();
    useEffect(() => {
        if (message.text) {
            const timer = setTimeout(() => {
                setMessage({ text: '', type: '' });
            }, 4000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    // useEffect(()=>{
    //     let fetch=async()=>{
    //         let response=await axios.get("http://localhost:8080/getData",{
    //             withCredentials:true
    //         })

    //         console.log(response.data.message);
    //     }
    //     fetch();
    // },[])

    const handleSubmit = async (e) => {
        e.preventDefault();

        // TODO: Complete this logic




        if (isLogin) {
            //sending to the Login Route.
            const response = await axios.post("http://localhost:8080/login", { Email: email, Password: password }, {
                withCredentials: true
            });
            if (response.data.flag==="success") {
                setEmail("");
                setPassword("");
                setRememberMe(false);
                setMessage({ text: "", type: "" });
                setName('');
                setConfirmPassword('');
                setRememberMe('');

                navigate(`/${response.data.role}DashBoard`);
            }

            setTimeout(() => {
                showMessage(response.data.message, response.data.flag);
                setTimeout(() => setIsLogin(true), 2000);
            }, 2000);
        }

        else if (!isLogin) {
            //sending to the signup route.
            if (!name || !email || !password || !confirmPassword || !role) {
                showMessage('Please fill all fields', 'error');
                return;
            }
            if (password !== confirmPassword) {
                showMessage('Passwords do not match', 'error');
                return;
            }
            const response = await axios.post("http://localhost:8080/signUp", { Name: name, Email: email, Password: password, Role: role }, {
                withCredentials: true
            });
            if (response.data.flag==="success") {
                setEmail("");
                setPassword("");
                setRememberMe(false);
                setMessage({ text: "", type: "" });
                setName('');
                setConfirmPassword('');
                setRememberMe('');

                navigate(`/${role}DashBoard`);
            }
            setTimeout(() => {
                showMessage(response.data.message, response.data.flag);
                setTimeout(() => setIsLogin(true), 2000);
            }, 2000);
        }


    };

    const showMessage = (text, type) => {
        setMessage({ text, type });
    };

    return (
        <div className={styles.loginContainer}>
            {/* Toggle for authentication */}
            <div className={styles.authToggle}>
                <button
                    className={isLogin ? styles.active : ''}
                    onClick={() => setIsLogin(true)}
                >
                    Login
                </button>
                <button
                    className={!isLogin ? styles.active : ''}
                    onClick={() => setIsLogin(false)}
                >
                    Sign Up
                </button>
            </div>

            {/* Message Notification */}
            {message.text && (
                <div className={`${styles.messageBox} ${styles[message.type]}`}>
                    <svg viewBox="0 0 20 20" fill="currentColor">
                        {message.type === 'error' ? (
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        ) : (
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        )}
                    </svg>
                    <span>{message.text}</span>
                </div>
            )}

            {/* Login Card */}
            <div className={styles.loginCard}>
                <div className={styles.loginHeader}>
                    <div className={styles.logo}>
                        <svg viewBox="0 0 60 60" fill="none">
                            <circle cx="30" cy="30" r="30" fill="url(#logo-gradient)" />
                            <path d="M30 15L40 25H35V35H40L30 45L20 35H25V25H20L30 15Z" fill="white" />
                            <defs>
                                <linearGradient id="logo-gradient" x1="0" y1="0" x2="60" y2="60">
                                    <stop stopColor="#6366F1" />
                                    <stop offset="1" stopColor="#A855F7" />
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                    <h1>Welcome to CIMP</h1>
                    <p>Sign in to access your dashboard</p>
                </div>

                {/* SignIn Page */}
                {!isLogin && (
                    <>
                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                id="id"
                                value={id}
                                onChange={(e) => setId(e.target.value)}
                                placeholder=" "
                                className="peer"
                            />
                            <label htmlFor="id">Reg No. Or User ID</label>
                        </div>

                        <div className={styles.formGroup}>
                            <input
                                type="text"
                                id="name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder=" "
                                className="peer"
                            />
                            <label htmlFor="name">Full Name</label>
                        </div>
                    </>
                )}

                <form>
                    <div className={styles.formGroup}>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder=" "
                            className="peer"
                        />
                        <label htmlFor="email">Email Address</label>
                    </div>

                    <div className={styles.formGroup}>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder=" "
                            className="peer"
                        />
                        <label htmlFor="password">Password</label>
                    </div>

                    {!isLogin && (
                        <div className={styles.formGroup}>
                            <input
                                type="password"
                                id="confirmPassword"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder=" "
                                className="peer"
                            />
                            <label htmlFor="confirmPassword">Confirm Password</label>
                        </div>
                    )}

                    {isLogin && <div className={styles.formOptions}>
                        <div className={styles.rememberMe}>
                            <input
                                type="checkbox"
                                id="remember-me"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                            />
                            <label htmlFor="remember-me">Remember me</label>
                        </div>
                        <button
                            type="button"
                            className={styles.forgotPassword}
                            onClick={() => showMessage('Password reset link will be sent to your email.', 'info')}
                        >
                            Forgot password?
                        </button>
                    </div>}

                    {!isLogin && (
                        <div className={styles.roleSelection}>
                            <label>Select Your Role</label>
                            <div className={styles.roleOptions}>
                                <button
                                    type="button"
                                    className={role === 'admin' ? styles.active : ''}
                                    onClick={() => setRole('admin')}
                                >
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" stroke="currentColor" strokeWidth="2" />
                                        <path d="M12 22V12M5 7l7 5M19 7l-7 5" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                    Admin
                                </button>
                                <button
                                    type="button"
                                    className={role === 'student' ? styles.active : ''}
                                    onClick={() => setRole('student')}
                                >
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" stroke="currentColor" strokeWidth="2" />
                                        <path d="M12 22V12M5 7l7 5M19 7l-7 5" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                    Club President
                                </button>
                                <button
                                    type="button"
                                    className={role === 'faculty' ? styles.active : ''}
                                    onClick={() => setRole('faculty')}
                                >
                                    <svg viewBox="0 0 24 24" fill="none">
                                        <path d="M12 2L4 7v10l8 5 8-5V7L12 2z" stroke="currentColor" strokeWidth="2" />
                                        <path d="M12 22V12M5 7l7 5M19 7l-7 5" stroke="currentColor" strokeWidth="2" />
                                    </svg>
                                    Faculty
                                </button>
                            </div>
                        </div>
                    )}

                    <button type="submit" className={styles.loginButton} onClick={handleSubmit}>
                        Sign {isLogin ? "In" : "Up"}
                    </button>

                    <div className={styles.signupLink}>
                        {isLogin ? (
                            <>Don't have an account? <button onClick={(e) => { e.preventDefault(); setIsLogin(false) }}>Sign up</button></>
                        ) : (
                            <>Already have an account? <button onClick={(e) => { e.preventDefault(); setIsLogin(true) }}>Login</button></>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
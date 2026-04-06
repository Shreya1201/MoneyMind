import React, { useState, useContext, useEffect } from "react";
import { useHttp } from "../api/Http";
import { useNavigate } from "react-router-dom";
import registerImg from '../assets/RegisterIllustration.png'
import '../styles/Login.css'
import { ThemeContext } from "../contexts/ThemeContext";
import { FaSun, FaMoon, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

const Register = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassword, setconfirmPassword] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const { httpPost } = useHttp();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setLoaded(true), 50);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if(password !== confirmPassword){
                toast.error('Passwords do not match.')
                return;
            }
            const response = await httpPost("http://localhost:5000/auth", {
                email, fullName, password
            }, {TranName: "Register"})
            if(response.ResponseType == 'Sucess')
                toast.success(response.ResponseMessage);
            else
                toast.error(response.ResponseMessage);
        } catch (error) {
            toast.error(error);
        }
    };
    return (
        <div className={`auth-container ${theme} ${loaded ? "loaded" : ""}`}>
            <div className="theme-switch-container">
                <button className={`theme-switch ${theme}`} onClick={toggleTheme}>
                    {theme === "light" ? <FaSun /> : <FaMoon />}
                </button>
            </div>
            <div className="auth-left">
                <img src={registerImg} alt="Register Illustration" className="register-img" />
            </div>
            <div className="auth-right">
                <h2>Create Account ✨</h2>
                <p>Start managing your finances smartly.</p>
                <form onSubmit={handleSubmit}>
                    <input type="text" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    <div className="password-field">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {/* {password && (
                            <span className="eye-icon" onClick={() => setShowPassword(prev => !prev)}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>)} */}
                    </div>

                    <div className="password-field">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setconfirmPassword(e.target.value)}
                            required
                        />
                        {confirmPassword && (
                            <span className="eye-icon" onClick={() => setShowConfirmPassword(prev => !prev)}>
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>)}
                    </div>
                    <button type="submit">Register</button>
                </form>
                <p>
                    Already have an account? <a href="/login">Login</a>
                </p>
            </div>
        </div>
    )
}

export default Register;
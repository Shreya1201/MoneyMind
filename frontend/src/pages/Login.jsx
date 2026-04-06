import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useHttp } from "../api/Http";
import loginImg from "../assets/LoginIllustration.png"
import "../styles/Login.css"
import { ThemeContext } from "../contexts/ThemeContext";
import { FaSun, FaMoon, FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";

const Login = () => {
    const { login, logout } = useContext(AuthContext);
    const { httpPost } = useHttp();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { theme, toggleTheme } = useContext(ThemeContext);
    const [showPassword, setShowPassword] = useState(false);
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setLoaded(true), 50);
        return () => clearTimeout(timer);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { email, password };
            const res = await httpPost("http://localhost:5000/auth", payload,{ TranName: "Login" });
            if (res.ResponseType === 'Success') {
                login(res.Response.Token, res.Response.Theme, res.Response.UserId);
                toast.success(res.ResponseMessage);
                navigate("/dashboard");
            } else {
                toast.error(res.ResponseMessage);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={`auth-container ${theme} ${loaded ? "loaded" : ""}`} >
            <div className="theme-switch-container">
                <button className={`theme-switch ${theme}`} onClick={toggleTheme}>
                    {theme === "light" ? <FaSun /> : <FaMoon />}
                </button>
            </div>
            <div className="auth-left">
                <img src={loginImg} alt="Login Illustration" className="login-img" />
            </div>
            <div className="auth-right">
                <h2>Welcome Back 👋</h2>
                <p className="login-caption">Please sign in to continue tracking your expenses.</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        required
                    />
                    <div className="password-field">
                        <input
                            type={showPassword ? "text" : "password"}
                            placeholder="Enter your Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        {password && (
                            <span className="eye-icon" onClick={() => setShowPassword(prev => !prev)}>
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>)}
                    </div>
                    <button type="submit">Login</button>
                </form>
                <p>
                    New user? <a href="/register">Create an account</a>
                </p>
            </div>
        </div>
    )
}

export default Login;
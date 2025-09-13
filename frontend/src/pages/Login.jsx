import React,{useState, useContext} from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { useHttp } from "../api/Http";

const Login = () =>{
    const {login, logout} = useContext(AuthContext);
    const {httpPost} = useHttp();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            const response = await httpPost("auth/login",{
                email, password
            });
            login(response.data.token);
            navigate("/dashboard");
        } catch(error){
            console.error("Authentication failed",error);
            logout();
            if(error.response && error.response.data){
                setErrorMessage(error.response.data); 
            } else{
                setErrorMessage("An unexpected error occurred. Please try again.");
            }
        }
    };
    return(
        <div>
            {errorMessage && <div style={{ color: "red" }}>{errorMessage}</div>}{" "}
            <form onSubmit={handleSubmit}>
                <input value={email} onChange={(e)=>setEmail(e.target.value)}/>
                <input type="password" value={password} onChange={(e)=> setPassword(e.target.value)} />
                <button type="submit">Login</button>
            </form>
        </div>
    )
}

export default Login;
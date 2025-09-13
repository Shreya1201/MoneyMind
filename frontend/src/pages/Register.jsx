import React, {useState, useContext} from "react";
import { useHttp } from "../api/Http";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [confirmPassowrd, setconfirmPassowrd] = useState("");
    const [passowrd, setPassowrd] = useState("");
    const [message, setMessage] = useState("");
    const {httpPost} = useHttp();
    const handleSubmit = async(e) => {
        e.preventDefault();
        try{
            const response = await httpPost("/api/auth/register",{
                email, fullName, passowrd
            })
            setMessage(response.data.message);
        } catch (error){
            console.error("Registration failed:", error.response.data.error);
            setMessage(error.response.data.error);
        }
    };
    return(
        <div>
            <form onSubmit={handleSubmit}>
                <input value={fullName} onChange={(e)=> setFullName(e.target.value)}/>
                <input value={email} onChange={(e)=> setEmail(e.target.value)}/>
                <input value={confirmPassowrd} onChange={(e)=> setconfirmPassowrd(e.target.value)}/>
                <input value={passowrd} onChange={(e)=> setPassowrd(e.target.value)}/>
                <button type="submit">Register</button>
            </form>
            {message && <p>{message}</p>}
        </div>
    )
}

export default Register;
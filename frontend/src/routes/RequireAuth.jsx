import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Navigate } from "react-router-dom";
const RequireAuth = ({children}) => {
    const {token, loading} = useContext(AuthContext);
    if(!token){
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default RequireAuth;
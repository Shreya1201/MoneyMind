import { useLocation } from "react-router-dom"
import { useEffect, useState } from "react";

const TransitionWrapper = ({children}) => {
    const location = useLocation();
    const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setLoaded(false); 
    const timer = setTimeout(() => setLoaded(true), 50); 
    return () => clearTimeout(timer);
  }, [location.pathname]); 

  return (
    <div className={`${loaded ? "loaded" : ""}`}>
      {children}
    </div>
  )
};

export default TransitionWrapper;
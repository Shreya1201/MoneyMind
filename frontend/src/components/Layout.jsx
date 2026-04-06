import React, { useState, useEffect, useContext } from "react";
import { FaMoon, FaBars, FaChartPie, FaWallet, FaUser, FaSignOutAlt, FaHome } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { ThemeContext } from "../contexts/ThemeContext";
import { IoSunnyOutline } from "react-icons/io5";
import { NavLink, useNavigate } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import "react-tooltip/dist/react-tooltip.css";
import "../styles/Layout.css";
import { AuthContext } from "../contexts/AuthContext";
import { useHttp } from "../api/Http";
import { toast } from "react-toastify";

const Layout = ({ children }) => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { httpGet } = useHttp();
  
  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);
  const [isCollapsed, setIsCollapsed] = useState(false); 
  const [isMobileHidden, setIsMobileHidden] = useState(false); 
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [user, setUser] = useState(null);
  const updateUser = (newUser) => {
    setUser(newUser);
  };

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    document.documentElement.className = theme; 
  }, [theme]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const JsonData = {};
        const headerData = {
          TranName: "GetProfileData",
          JsonData: JSON.stringify(JsonData)
        };
        const res = await httpGet("http://localhost:5000/profile", { "HeaderData": JSON.stringify(headerData) });
        if (res.ResponseType === "Success" && res.Response.length > 0) {
          const profile = res.Response[0];  
          setUser(profile);
        } else {
          toast.error(res.ResponseMessage || "No profile found");
        }       
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      }
    };
    fetchProfile();
  }, []);


  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileHidden(!isMobileHidden);
    } else {
      setIsCollapsed(!isCollapsed);
    }
  };

  return (
    <div className="layout">
      <div
        className={`sidebar
          ${isMobile ? (isMobileHidden ? "hidden" : "mobile-open") : ""}
          ${!isMobile && isCollapsed ? "collapsed" : ""}`}
      >
        <nav>
          <div className="sidebar-header">
            {/* <h2>{!isCollapsed && "User Profile"}</h2> */}
            <FaBars className="hamburger-icon" onClick={toggleSidebar}/>
            <RxCross2 className="close-icon" onClick={toggleSidebar} />
          </div>

          <div className="sidebar-profile">
            <img 
              src={user?.Photo || "https://via.placeholder.com/80"} 
              alt="Profile" 
              className="profile-dp"
            />
            {!isCollapsed && <span className="user-name">{user?.FullName || "User Name"}</span>}
          </div>

          <div className="sidebar-menu">
            <NavLink 
              to="/dashboard"
              className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
            >
              <FaChartPie 
                className="menu-icon" 
                data-tooltip-id="dashTip" 
                data-tooltip-content="Dashboard" 
              />
              {!isCollapsed && <span>Dashboard</span>}
            </NavLink>
            <Tooltip id="dashTip" place="right" />

            <NavLink 
              to="/expenses"
              className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
            >
              <FaWallet 
                className="menu-icon" 
                data-tooltip-id="expTip" 
                data-tooltip-content="Expenses" 
              />
              {!isCollapsed && <span>Expenses</span>}
            </NavLink>
            <Tooltip id="expTip" place="right" />

            <NavLink 
              to="/incomes"
              className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
            >
              <FaHome 
                className="menu-icon" 
                data-tooltip-id="incTip" 
                data-tooltip-content="Incomes" 
              />
              {!isCollapsed && <span>Incomes</span>}
            </NavLink>
            <Tooltip id="incTip" place="right" />

            <NavLink 
              to="/profile"
              className={({ isActive }) => `menu-item ${isActive ? "active" : ""}`}
            >
              <FaUser 
                className="menu-icon" 
                data-tooltip-id="profTip" 
                data-tooltip-content="Profile" 
              />
              {!isCollapsed && <span>Profile</span>}
            </NavLink>
            <Tooltip id="profTip" place="right" />

            <div className="menu-item" onClick={logout}>
              <FaSignOutAlt 
                className="menu-icon" 
                data-tooltip-id="logoutTip" 
                data-tooltip-content="Logout" 
              />
              {!isCollapsed && <span>Logout</span>}
            </div>
            <Tooltip id="logoutTip" place="right" />
          </div>
        </nav>
      </div>

      <div className={`main
        ${isMobile ? (isMobileHidden ? "hidden" : "mobile-open") : ""}
        ${!isMobile && isCollapsed ? "collapsed" : ""}`}>
        <div className="navbar">
          <div className="left">
            <FaBars className="hamburger" onClick={toggleSidebar} />
            <span className="logo">MoneyMind</span>
          </div>
          <div className="right" onClick={toggleTheme}>
            {theme === "light" ? <FaMoon /> : <IoSunnyOutline />}
          </div>
        </div>
        <div className="content">
          {React.Children.map(children, child =>
            React.isValidElement(child) 
              ? React.cloneElement(child, { user, updateUser }) 
              : child
          )}
        </div>
      </div>
    </div>
  );
};

export default Layout;

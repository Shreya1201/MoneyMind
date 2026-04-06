import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap/dist/js/bootstrap.bundle'
import Login from './pages/Login'
import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Incomes from './pages/Incomes'
import Expenses from './pages/Expenses'
import Profile from './pages/Profile'
import RequireAuth from './routes/RequireAuth'
import { Navigate } from 'react-router-dom'
import { useContext } from 'react'
import { AuthContext } from './contexts/AuthContext'
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import Layout from './components/Layout'

function App() {
  const { token } = useContext(AuthContext);

  return (
    <div className="App">
      <BrowserRouter>
          <Routes>
            <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<RequireAuth><Layout><Dashboard /></Layout></RequireAuth>} />
            <Route path="/incomes" element={<RequireAuth><Layout><Incomes /></Layout></RequireAuth>} />
            <Route path="/expenses" element={<RequireAuth><Layout><Expenses /></Layout></RequireAuth>} />
            <Route path="/profile" element={<RequireAuth><Layout><Profile /></Layout></RequireAuth>} />
          </Routes>
      </BrowserRouter>
      <ToastContainer 
        position="top-right"
        autoClose={3000} 
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        draggable
      />
    </div>
  )
}

export default App

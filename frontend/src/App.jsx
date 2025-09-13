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

function App() {
  const { token } = useContext(AuthContext);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/dashboard" element={<RequireAuth><Dashboard /></RequireAuth> } />
          <Route path="/incomes" element={<RequireAuth><Incomes /></RequireAuth>} />
          <Route path="/expenses" element={<RequireAuth><Expenses /></RequireAuth>} />
          <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

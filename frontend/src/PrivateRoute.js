import React from 'react'
import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

const PrivateRoute = ({ element: Component }) => {
  const token = useSelector((state) => state.auth.token) || localStorage.getItem('token')
  if (!token) {
    return <Navigate to="/login" replace />
  }


  return <Component />
}

export default PrivateRoute

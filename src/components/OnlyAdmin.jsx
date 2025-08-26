import React from 'react'
import { Navigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'


function OnlyAdmin({ children }) {
    const { userdata } = UserAuth()

    if (!userdata?.admin) { return <Navigate to={'/login'} /> }
    return children
}

export default OnlyAdmin
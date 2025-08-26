import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth, database } from '../firebase'
import { getDoc, doc } from 'firebase/firestore'


const Login = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)



    const handleLogin = async (e) => {
        e.preventDefault()
        setError('')

        try {
            setLoading(true)

            signInWithEmailAndPassword(auth, email, password)
                .then(async res => {
                    // check if user is admin
                    const data = (await getDoc(doc(database, `users/${res.user.uid}`))).data()
                    if (data.admin) {
                        navigate('/')
                    } else {
                        alert('Was unable to login')
                        setLoading(false)
                    }
                })
        } catch (error) {
            setLoading(false)
            setError(error.message)
        }
    }



    return (
        <div className='max-w-[700px] mx-auto my-20 p4'>
            {/* <div style="margin-top: 10"></div> */}

            <div className="flex flex-col px-20 py-10">
                <h2 className='text-6xl text-center font-bold py-3 underline'>Login</h2>
            </div>

            <h1 className='text-2xl font-bold py-2'>Login in to your account</h1>


            {/* sign up form */}
            {error !== '' && <p className='py-2 text-red-500'>{error}</p>}

            <form onSubmit={handleLogin}>
                <div className='flex flex-col py-2'>
                    <label className='py2 font-medium'>Email Address</label>
                    <input placeholder='enter email address' onChange={(e) => setEmail(e.target.value)} className='border p-3' type='email' />
                </div>
                <div className='flex flex-col py-2'>
                    <label className='py2 font-medium'>Password</label>
                    <input placeholder='enter your password' onChange={(e) => setPassword(e.target.value)} className='border p-3' type='password' />
                </div>

                <button className='border-green-500 bg-green-600 hover:bg-green-500 w-full p-4 my-2 text-center text-white shadow-lg rounded-md'>{loading ? 'Signing in...' : 'Sign In'}</button>
            </form>
        </div>
    )
}

export default Login

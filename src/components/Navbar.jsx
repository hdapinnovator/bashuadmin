import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'



function NavBar() {
    const navigate = useNavigate()
    const { user, userdata } = UserAuth()


    const handleLogout = async () => {
        try {
            signOut(auth)
            navigate('/login')
        } catch (error) {
            console.log(error.message)
        }
    }


    useEffect(() => {
        console.log(userdata)
    }, [])



    return (
        <div className="p-1 bg-white shadow md:flex md:items-center md:justify-between">
            <div className="flex justify-between items-center ">
                {/* <span class="text-2xl font-[Poppins] cursor-pointer">
                    <img class="h-10 inline"
                        src="https://tailwindcss.com/_next/static/media/social-square.b622e290e82093c36cca57092ffe494f.jpg">
                        tailwind
                </span> */}
                <h1 className='text-2xl font-bold px-4 underline'>Bashu Admin { }</h1>
                {/* <p>Your Email: {user && user.email}</p> */}
                <span className="text-3xl cursor-pointer mx-2 md:hidden block">
                    <ion-icon name="menu" onclick="Menu(this)"></ion-icon>
                </span>
            </div>

            <ul className="md:flex md:items-center z-[-1] md:z-auto md:static absolute bg-white w-full left-0 md:w-auto md:py-0 py-4 md:pl-0 pl-7 md:opacity-100 opacity-0 top-[-400px] transition-all ease-in duration-500">
                <li className="mx-4 my-6 md:my-0">
                    <Link to={'/'}>
                        <span className="text-md hover:text-blue-500 duration-500">Sticks</span>
                    </Link>
                </li>

                <li className="mx-4 my-6 md:my-0">
                    <Link to={'/in-review'}>
                        <span className="text-md hover:text-blue-500 duration-500">In-Review</span>
                    </Link>
                </li>

                <li className="mx-4 my-6 md:my-0">
                    <Link to={'/banned'}>
                        <span className="text-md hover:text-blue-500 duration-500">Banned</span>
                    </Link>
                </li>

                {!userdata?.normal && <li className="mx-4 my-6 md:my-0">
                    <Link to={'/reports'}>
                        <span className="text-md hover:text-blue-500 duration-500">Reports</span>
                    </Link>
                </li>}

                <li className="mx-4 my-6 md:my-0">
                    <Link to={'/reviews'}>
                        <span className="text-md hover:text-blue-500 duration-500">Reviews</span>
                    </Link>
                </li>

                {!userdata?.normal && <li className="mx-4 my-6 md:my-0">
                    <Link to={'/users'}>
                        <span className="text-md hover:text-blue-500 duration-500">Users</span>
                    </Link>
                </li>}

                <button onClick={handleLogout} className="bg-red-500 text-white font-[Poppins] duration-500 px-6 py-2 mx-4 hover:bg-red-400 rounded ">
                    Logout
                </button>
                <h2 className=""></h2>
            </ul>
        </div>
    )
}

export default NavBar
import { collection, onSnapshot, query, limit } from 'firebase/firestore'
import React, { useState, useEffect } from 'react'
import { UserAuth } from '../context/AuthContext'
import { database } from '../firebase'
import ConfirmModal from '../components/modals/confirm'
import NavBar from '../components/Navbar'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import { useNavigate } from 'react-router-dom'



const Users = () => {
    const [search, setSearch] = useState('')
    const [error, setError] = useState('')
    const [users, setUsers] = useState([])
    const [filtered, setFiltered] = useState([])
    const [selected, setSelected] = useState(null)
    const { banUser, userdata } = UserAuth()
    const navigate = useNavigate()

    const [isOpen, setIsOpen] = useState(false);


    // deletet user
    const handleBan = async (id) => {
        try {
            await banUser(id)
        } catch (error) {
            setError(error.message)
        }
    }


    // filter user method
    const filterUsers = (text) => {
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = filtered.filter((item) => {
                const itemData = item.username
                    ? item.username.toUpperCase()
                    : ''.toUpperCase()
                const textData = text.toUpperCase()
                return itemData.indexOf(textData) > -1
            })

            setFiltered(newData)
            setSearch(text)
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setFiltered(users)
            setSearch(text)
        }
    }

    // const user by sending a s
    const contactUser = (id) => {

    }


    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            console.log(user)
            if (user === null) return navigate('/bashuadmin/login')
        })
    }, [])


    useEffect(() => {
        const unsub = onSnapshot(query(collection(database, 'users'), limit(35)), snap => {
            const resdata = snap.docs.map(doc => {
                const id = doc.id
                const data = doc.data()
                return { id, ...data }
            })

            setUsers(resdata)
            setFiltered(resdata)
        })

        return () => { unsub() }
    }, [])





    return (
        <>
            {/* Nab bar */}
            <NavBar />

            <div className='max-w-[100%] my-auto my-16 p-4'>
                <div className="flex flex-col px-20">
                    <h1 className='text-3xl font-bold text-center underline my-20'>See users listed bellow</h1>
                    <input value={search} onChange={(e) => filterUsers(e.target.value)} className='border p-3' placeholder='Search by username' type='text' />

                    <div className="overflow-x-auto items-center">
                        <div className="p-1.5 w-full inline-block align-middle">
                            <div className="overflow-hidden border rounded-lg">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                            >
                                                Username
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                            >
                                                Date created
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                            >
                                                Email
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                                            >
                                                Ban user
                                            </th>
                                            <th
                                                scope="col"
                                                className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                                            >
                                                Contact
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {
                                            filtered.map(user => {
                                                return (
                                                    <tr key={user.id}>
                                                        <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                                                            {user.username}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                            {user.date.split(' G')[0]}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                            {user.email}
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                                            <a onClick={() => {
                                                                setSelected(user)
                                                                setIsOpen(!isOpen)
                                                            }}
                                                                className="text-red-500 hover:text-red-700"
                                                                href="#"
                                                            >
                                                                Ban user
                                                            </a>
                                                        </td>
                                                        <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                                            <a onClick={() => contactUser(user.id)}
                                                                className="text-blue-500 hover:text-red-700"
                                                                href="#"
                                                            >
                                                                Contact
                                                            </a>
                                                        </td>
                                                    </tr>
                                                )
                                            })
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {/* confirm modal */}
                {isOpen && <ConfirmModal setIsOpen={setIsOpen} user={selected} title="Ban" message="Are you sure you want to ban this user? This acction will notifiy the user that they have been banned from using their bashu account" />}
            </div>
        </>
    )
}

export default Users
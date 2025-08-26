import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'
import ViewData from '../components/modals/viewdata/viewdata'
import NavBar from '../components/Navbar'


const InReview = () => {
    const [search, setSearch] = useState('')
    const [show, setShow] = useState(false)
    const [error, setError] = useState('')
    const [sticks, setSticks] = useState([])
    const [filtered, setFiltered] = useState(sticks)

    const { user, getSticksInReview } = UserAuth()

    const navigate = useNavigate()
    const [selected, setSelected] = useState(null)


    // filter user method
    const filterUsers = (text) => {
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = sticks.filter((item) => {
                const itemData = `${item.shopname}${item?.reference}`
                    ? `${item.shopname}${item?.reference}`.toUpperCase()
                    : ''.toUpperCase()
                const textData = text.toUpperCase()
                return itemData.indexOf(textData) > -1
            })

            setFiltered(newData)
            setSearch(text)
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setFiltered(sticks)
            setSearch(text)
        }
    }



    useEffect(() => {
        getSticksInReview()
            .then(res => {
                const resdata = res.docs.map(doc => {
                    const id = doc.id
                    const data = doc.data()
                    return { id, ...data }
                })
                // filter for stick that have content
                const filtered = resdata?.filter(data => data?.content)
                // assign to the global state
                setSticks(filtered)
                setFiltered(filtered)
            })
    }, [])



    return (
        <>
            {/* nav bar */}
            <NavBar />


            <div className='max-w-[100%] my-auto my-16 p-4'>
                <div className="flex flex-col">
                    <h1 className='text-3xl font-bold text-center underline my-20'>All sticks bellow</h1>
                    {/* <div className="flex flex-row justify-end mx-20">
                    <button className='border px-6 py6 py-2 my-4 bg-green-600 rounded-md text-white'>{sticks.length} sticks in total</button>
                </div> */}
                    <div className="flex flex-col px-20">
                        <input value={search} onChange={(e) => filterUsers(e.target.value)} className='border p-3' placeholder='Search by username or stick title' type='text' />
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
                                                    Date
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                                >
                                                    Title
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                                >
                                                    username
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                                >
                                                    Stick
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-bold text-right text-gray-500 uppercase "
                                                >
                                                    View
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {
                                                filtered.map(stick => {
                                                    return (
                                                        <tr key={stick.id}>
                                                            <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                                                                {stick.date.split(' G')[0]}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                                {stick.title}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                                {stick.username}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                                {stick.content.substr(0, 52)}...
                                                            </td>
                                                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                                                <a onClick={() => {
                                                                    setSelected(stick)
                                                                    setShow(!show)
                                                                }}
                                                                    className="text-green-500 hover:text-red-700"
                                                                    href="#"
                                                                >
                                                                    View
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

                    {show && <ViewData item={selected} setShow={setShow} />}
                </div>
            </div>
        </>
    )
}

export default InReview

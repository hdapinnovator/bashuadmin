import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'
import ViewData from '../components/modals/viewdata/viewdata'
import NavBar from '../components/Navbar'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'


const Reviews = () => {
    const [search, setSearch] = useState('')
    const [show, setShow] = useState(false)
    const [reviews, setReviews] = useState([])
    const [filtered, setFiltered] = useState(reviews)

    const { user, getReviews } = UserAuth()

    const navigate = useNavigate()

    const [selected, setSelected] = useState(null)


    // filter user method
    const filterUsers = (text) => {
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = reviews.filter((item) => {
                const itemData = `${item.topic}${item.comment}`
                    ? `${item.topic}${item.comment}`.toUpperCase()
                    : ''.toUpperCase()
                const textData = text.toUpperCase()
                return itemData.indexOf(textData) > -1
            })

            setFiltered(newData)
            setSearch(text)
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setFiltered(reviews)
            setSearch(text)
        }
    }


    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user === null) return navigate('/bashuadmin/login')
        })
    }, [])


    useEffect(() => {
        getReviews()
            .then(res => {
                const resdata = res.docs.map(doc => {
                    const id = doc.id
                    const data = doc.data()
                    return { id, ...data }
                })

                // assign to the global state
                setReviews(resdata)
                setFiltered(resdata)
            })
    }, [])



    return (
        <>
            {/* nav bar */}
            <NavBar />

            <div className='max-w-[100%] my-auto my-16 p-4'>
                <div className="flex flex-col">
                    <h1 className='text-3xl font-bold text-center underline my-20'>All reviews bellow</h1>
                    <div className="flex flex-col px-20">
                        {/* <input value={search} onChange={(e) => filterUsers(e.target.value)} className='border p-3' placeholder=' stick title' type='text' /> */}
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
                                                    Topic
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                                >
                                                    Comment
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                                >
                                                    View
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {
                                                filtered.map(review => {
                                                    return (
                                                        <tr key={review.id}>
                                                            <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                                                                {review.date.split(' G')[0]}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                                {review.topic}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                                {review.comment}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                                                <a onClick={() => {
                                                                    setSelected(review)
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

                    {show && <ViewData item={selected} setShow={setShow} from="Review" />}
                </div>
            </div>
        </>
    )
}

export default Reviews

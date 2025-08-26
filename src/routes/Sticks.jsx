import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'
import ViewData from '../components/modals/viewdata/viewdata'
import Filter from '../components/modals/filter'


const Sticks = () => {
    const [search, setSearch] = useState('')
    const [showfilter, setShowFilter] = useState(false)
    const [show, setShow] = useState(false)
    const [sticks, setSticks] = useState([])
    const [titlesticks, setTitleSticks] = useState([])
    const [filtered, setFiltered] = useState(sticks)
    const [filtered1, setFiltered1] = useState(titlesticks)

    const { user, getSticks, getSticksByTitle } = UserAuth()

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


    const viewStick = (val) => {
        localStorage.setItem('data', JSON.stringify(val))
        navigate('/view-stick')
    }


    // filter sticks by title
    const byTitle = (title) => {
        getSticksByTitle(title)
            .then(res => {
                const resdata = res.docs.map(doc => {
                    const id = doc.id
                    const data = doc.data()
                    return { id, ...data }
                })
                // filter for stick that have content
                const filtered = resdata?.filter(data => data?.content)
                // assign to the global state
                setTitleSticks(filtered)
                setFiltered1(filtered)
            })
    }



    useEffect(() => {
        setTitleSticks([])
        setFiltered1([])

        // const options = {
        //     method: "POST",
        //     url: "https://api.edenai.run/v2/text/moderation",
        //     headers: {
        //         authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYTlkNTBiMGYtNjY3Ny00NDhjLWJhNWEtMTFhMjYwZjM2YmViIiwidHlwZSI6ImFwaV90b2tlbiJ9._hV20KU03Hb9hRGCC7wE5fYbCgMYxJQXiirByfqlXBQ",
        //     },
        //     data: {
        //         providers: "microsoft, openai",
        //         language: "en",
        //         text: "Let's see if this text contains some hate or violence toward others!.",
        //     },
        // };

        // axios
        //     .request(options)
        //     .then((response) => {
        //         console.log(response.data);
        //     })
        //     .catch((error) => {
        //         console.error(error);
        //     });



        getSticks()
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
        <div className='max-w-[100%] my-auto my-16 p-4'>
            <div className="flex flex-col">
                <h1 className='text-3xl font-bold text-center underline my-20'>All sticks bellow</h1>

                <div className="flex flex-row justify-end mx-20">
                    <button onClick={() => {
                        setShowFilter(!showfilter)
                    }} className='border px-6 py6 py-2 my-4 bg-green-600 rounded-md text-white'>Filter by title</button>
                    {filtered1.length > 0 && <button onClick={() => {
                       setFiltered1([])
                    }} className='border px-6 py6 py-2 my-4 bg-yellow-600 rounded-md text-white'>Clear filter</button>}
                </div>

                <div className="flex flex-col px-20">
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
                                        <>{filtered1.length > 0 ? filtered1.map(stick => {
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
                                        }) : filtered.map(stick => {
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
                                        })}</>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

                {show && <ViewData item={selected} setShow={setShow} from="Stick" />}
                {showfilter && <Filter byTitle={byTitle} setShowFilter={setShowFilter} from="sticks" />}
            </div>
        </div>
    )
}


export default Sticks

import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { UserAuth } from '../context/AuthContext'
import ConfirmModal from '../components/modals/confirm'
import ViewData from '../components/modals/viewdata/viewdata'
import NavBar from '../components/Navbar'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'



const Reports = () => {
    const [search, setSearch] = useState('')
    const [isOpen, setIsOpen] = useState(false)
    const [show, setShow] = useState(false)
    const [reports, setReports] = useState([])
    const [filtered, setFiltered] = useState(reports)

    const { user, getReports } = UserAuth()

    const navigate = useNavigate()

    const [selected, setSelected] = useState(null)


    // filter user method
    const filterUsers = (text) => {
        if (text) {
            // Inserted text is not blank
            // Filter the masterDataSource
            // Update FilteredDataSource
            const newData = reports.filter((item) => {
                const itemData = `${item.case}${item?.cause}`
                    ? `${item.case}${item?.cause}`.toUpperCase()
                    : ''.toUpperCase()
                const textData = text.toUpperCase()
                return itemData.indexOf(textData) > -1
            })

            setFiltered(newData)
            setSearch(text)
        } else {
            // Inserted text is blank
            // Update FilteredDataSource with masterDataSource
            setFiltered(reports)
            setSearch(text)
        }
    }


    useEffect(() => {
        onAuthStateChanged(auth, async (user) => {
            if (user === null) return navigate('/login')
        })
    }, [])


    useEffect(() => {
        getReports()
            .then(res => {
                const resdata = res.docs.map(doc => {
                    const id = doc.id
                    const data = doc.data()
                    return { id, ...data }
                })

                // assign to the global state
                setReports(resdata)
                setFiltered(resdata)
            })
    }, [])



    return (
        <>
            {/* Nav bar */}
            <NavBar />
            <div className='max-w-[100%] my-auto my-16 p-4'>
                <div className="flex flex-col">
                    <h1 className='text-3xl font-bold text-center underline my-20'>See reports bellow</h1>
                    <div className="flex flex-col px-20">
                        {/* <input value={search} onChange={(e) => filterUsers(e.target.value)} className='border p-3' placeholder='Search by username or stick title' type='text' /> */}
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
                                                    Reason
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                                >
                                                    Type
                                                </th>
                                                <th
                                                    scope="col"
                                                    className="px-6 py-3 text-xs font-bold text-left text-gray-500 uppercase "
                                                >
                                                    Content
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
                                                filtered.map(report => {
                                                    return (
                                                        <tr key={report.id}>
                                                            <td className="px-6 py-4 text-sm font-medium text-gray-800 whitespace-nowrap">
                                                                {report.date.split(' G')[0]}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                                {report.reason}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                                {report.type}
                                                            </td>
                                                            <td className="px-6 py-4 text-sm text-gray-800 whitespace-nowrap">
                                                                {report?.stick?.content.substr(0, 52) || `Last flow sent: ${report?.flows[report.flows.length - 1]?.content}`}...
                                                            </td>
                                                            <td className="px-6 py-4 text-sm font-medium text-right whitespace-nowrap">
                                                                <a onClick={() => {
                                                                    setSelected(report)
                                                                    setShow(!isOpen)
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

                    {isOpen && <ConfirmModal setIsOpen={setIsOpen} user={selected} title="Delete stick" message="Are you sure you want to ban this stick?, this action is ireversable!" />}
                    {show && <ViewData item={selected?.stick} setShow={setShow} from="Report" />}
                </div>
            </div>
        </>
    )
}

export default Reports

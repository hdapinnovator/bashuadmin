import React from "react";
import { UserAuth } from '../../../context/AuthContext'


export default function ViewData({ item, setShow, from }) {
    const { updateStatus } = UserAuth()



    // update status 
    const handleUpdateStatus = (action) => {
        const data = {
            data: item,
            action: action,
            date: new Date().toLocaleDateString()
        }

        updateStatus(data)
    }


    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setShow(false);
        }
    }



    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleOverlayClick}
        >
            <div className="max-w-sm bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-200">
                {/* Header / Title */}
                <div className="px-4 py-3 bg-blue-600 text-white text-lg font-semibold flex justify-between items-center">
                    View {from}
                    <button
                        onClick={() => setShow(false)}
                        className="text-white hover:text-gray-200 text-xl"
                    >
                        ×
                    </button>
                </div>


                {/* Image */}
                {item?.cont?.gif && <img
                    className="w-full h-48 object-cover"
                    src={item?.cont.gif}
                    alt="Stick picture"
                />}


                {/* Body */}
                <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{!item.comment ? (item.title + ' ' + item.username) : item.topic}</h3>
                    <p className="text-gray-600 mb-3">{item.content || item.comment}</p>
                    <p className="text-gray-600 mb-2">{item.date.split(' G')[0]}</p>
                </div>


                {/* Actions */}
                {from !== 'Stick' && from !== 'Review' && from !== 'Report' && <div className="flex justify-between px-4 py-3 bg-gray-100 border-t">
                    <button onClick={() => handleUpdateStatus('ban')} className="px-3 py-1 bg-orange-500 text-white rounded-lg hover:bg-orange-600">
                        Ban Stick
                    </button>
                    <button onClick={() => handleUpdateStatus('approve')} className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600">
                        Approve Stick
                    </button>
                </div>}
            </div>
        </div>
    )
}

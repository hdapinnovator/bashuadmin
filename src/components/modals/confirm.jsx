import { doc, updateDoc } from 'firebase/firestore';
import { database } from '../../firebase';
import axios from 'axios'


export default function ConfirmModal({ setIsOpen, title, message, user }) {


    const handleConfirm = async () => {
        // update user document
        // await updateDoc(doc(database, `users/${user.id}`), { banned: true })
        //     .then(res => {
                // set push notificaiton to the user
                sendPushNotification(user)
        //     }).catch(e => {
        //         console.log(e)
        //         alert('Could not completed this operation. Please try again later.')
        //     })
        // setIsOpen(false);
    };


    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) {
            setIsOpen(false);
        }
    }

    const handleCancel = () => {
        setIsOpen(false);
    };


    // set push notification to the user
    const sendPushNotification = async (data) => {
        // console.log(data.to)
        try {
            const message = {
                to: 'ExponentPushToken[yhiJreGk-EjtmGI3_SE3Bb]',
                sound: 'default',
                title: 'Bashu Team',
                body: 'Your account have now been banned due to...',
                data: {
                    action: 'bann account',
                    reason: ''
                }
            }

            const options = {
                method: "POST",
                url: "https://exp.host/--/api/v2/push/send",
                headers: {
                    Accept: 'application/json',
                    // 'Accept-encoding': 'gzip, deflate',
                    'Content-Type': 'application/json',
                },
                data: message
            };

            axios
                .request(options)
                .then((response) => {
                    console.log(response.data);
                })
                .catch((error) => {
                    console.error(error);
                });

        } catch (error) {
            console.log(error)
        }
    }


    return (
        <div
            className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
            onClick={handleOverlayClick}
        >
            <div className="bg-white rounded-2xl shadow-lg p-6 w-96">
                <h2 className="text-xl font-semibold text-blue-700 mb-4">
                    {title} {user?.username}
                </h2>
                <p className="text-gray-600 mb-6">
                    {message}
                </p>
                <div className="flex justify-end gap-4">
                    <button
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                        onClick={handleCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-gree-700"
                        onClick={handleConfirm}
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    )
}


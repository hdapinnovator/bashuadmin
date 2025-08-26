import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { createContext, useContext, useEffect, useState } from "react";
import {
    collection,
    deleteDoc,
    doc,
    getDoc,
    getDocs,
    updateDoc,
    query,
    limit,
    orderBy,
    addDoc,
    where
} from 'firebase/firestore';
import axios from 'axios'
import { database, auth } from '../firebase';


const UserContext = createContext()



export const AuthContextProvider = ({ children }) => {
    const [user, setUser] = useState({})
    const [userdata, setUserData] = useState({})


    useEffect(() => {
        const unsub = onAuthStateChanged(auth, async (user) => {
            console.log(user)
            if (user !== null) {  
                setUser(user)
                const data = (await getDoc(doc(database, `users/${user.uid}`))).data()
                if (data) setUserData(data)
            }
        })
    }, [])


    // get user
    const getUser = () => {
        if (user) return user
    }

    // ADD new criminal
    const banUser = (id) => {
        return updateDoc(doc(database, `users/${id}`), { banned: true })
    }


    // get sticks sticks that not either pending or banned on in review
    const getSticks = async () => {
        const sticksRef = collection(database, "sticks");
        const queryData = query(sticksRef, orderBy('timestamp', 'desc'), limit(35));
        return (await getDocs(queryData))
    }


    // get sticks sticks that not either pending or banned on in review
    const getReports = async () => {
        const reportsRef = collection(database, "reports");
        const queryData = query(reportsRef, orderBy('timestamp', 'desc'), limit(35));
        return (await getDocs(queryData))
    }


    // get sticks sticks that not either pending or banned on in review
    const getReviews = async () => {
        const reviewsRef = collection(database, "reviews");
        const queryData = query(reviewsRef, orderBy('timestamp', 'desc'), limit(35));
        return (await getDocs(queryData))
    }


    // get sticks sticks that not either pending or banned on in review
    const getSticksByTitle = async (title) => {
        const sticksRef = collection(database, "sticks");
        const queryData = query(sticksRef, where('title', '==', title), orderBy('timestamp', 'desc'), limit(35));
        return (await getDocs(queryData))
    }

    // get sticks that in review
    const getSticksInReview = async () => {
        const sticksRef = collection(database, "inreview");
        const queryData = query(sticksRef, orderBy('timestamp', 'desc'), limit(35));
        return (await getDocs(queryData))
    }


    // get sticks that banned
    const getBannedSticks = async () => {
        const sticksRef = collection(database, "banned");
        const queryData = query(sticksRef, orderBy('timestamp', 'desc'), limit(35));
        return (await getDocs(queryData))
    }


    const getUsers = async () => {
        const usersRef = collection(database, "users");
        const queryData = query(usersRef, orderBy('timestamp', 'desc'), limit(35));
        return (await getDocs(queryData))
    }


    // update stick status
    const updateStatus = async (data) => {
        switch (data.action) {
            case 'approve': {
                // remove first the stick from the inreview collection 
                // because the stick is moving into ta peding state
                deleteDoc(doc(database, `inreview/${data.stick.id}`))
                    .then(async res => {
                        await addDoc(collection(database, 'sticks'), { ...data.stick, approvedby: user.uid, dateapproved: data.date })

                        const data = (await getDoc(doc(database, `users/${data.stick.user}`))).data()

                        if (data) {
                            const message = {
                                to: data.pushToken,
                                sound: 'default',
                                title: 'Bashu Team',
                                body: `After a review, your stick with title ${data.stick.title} thrown on ${data.stick.date.split(' G')} has been approved and is live!`,
                                data: {
                                    action: 'approved',
                                    stick: data.stick
                                }
                            }
                            // call on the method
                            sendPushNotification(message)
                        }
                    })
                break
            } case 'ban': {
                // remove first the stick from the stick collection 
                // because the stick is not banned
                deleteDoc(doc(database, `inreview/${data.stick.id}`))
                    .then(async res => {
                        // now add the banned stick to banned stick collection
                        // this stick will be deleted after 7 days
                        await addDoc(collection(database, `banned`), { datebanned: data.date, stick: data.stick, user: user.uid })

                        const data = (await getDoc(doc(database, `users/${data.stick.user}`))).data()

                        if (data) {
                            const message = {
                                to: data.pushToken,
                                sound: 'default',
                                title: 'Bashu Team',
                                body: `After a review, your stick with title ${data.stick.title} thrown on ${data.stick.date.split(' G')} has been banned. Should you have questions, please contact us!`,
                                data: {
                                    action: 'banned',
                                    stick: data.stick
                                }
                            }
                            // call on the method
                            sendPushNotification(message)
                        }

                    })
                    .catch(() => { return false })
            }
        }
    }


    // send push notifications to user? maybe
    const sendPushNotification = async (data) => {
        const options = {
            method: "POST",
            url: "https://api.edenai.run/v2/text/moderation",
            headers: {
                authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiYTlkNTBiMGYtNjY3Ny00NDhjLWJhNWEtMTFhMjYwZjM2YmViIiwidHlwZSI6ImFwaV90b2tlbiJ9._hV20KU03Hb9hRGCC7wE5fYbCgMYxJQXiirByfqlXBQ",
            },
            data: {
                providers: "microsoft, openai",
                language: "en",
                text: "Let's see if this text contains some hate or violence toward others!.",
            },
        };

        axios
            .request(options)
            .then((response) => {
                console.log(response.data);
            })
            .catch((error) => {
                console.error(error);
            });
    }




    return (
        <UserContext.Provider value={{
            auth,
            database,
            userdata,
            user,
            getSticks,
            getUser,
            banUser,
            getUsers,
            getBannedSticks,
            getSticksInReview,
            updateStatus,
            getSticksByTitle,
            getReports,
            getReviews
        }}>
            {children}
        </UserContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(UserContext)
}
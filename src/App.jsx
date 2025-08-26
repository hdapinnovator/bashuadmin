import { useEffect } from "react";
import NavBar from "./components/Navbar";
import Sticks from "./routes/Sticks";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";
import { Navigate, useNavigate } from "react-router-dom";


function App() {
  const navigate = useNavigate()
  let sub 

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      console.log(user)
      // routing back to login
      if (user === null) return navigate('/bashuadmin/login')
    })
  }, [])



  return (
    <>
      <NavBar />
      <Sticks />
    </>
  );
}

export default App;

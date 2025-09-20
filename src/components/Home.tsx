import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";

const Home = () => {
  const [user,loading,error]=useAuthState(auth);
  // console.log("the user is : ",user?.displayName);
  return (
    <div style={{height:"100vh",width:"100vw",display:"flex",justifyContent:"center",alignItems:"center"}}>
     <h1> welcome {user?.displayName}</h1>
{/* This Is Home Page */}
    </div>
  )
}

export default Home
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../firebase/config";
import moment from "moment";



const JsPage = () => {
  const [user]=useAuthState(auth);

  return (
       <div style={{height:"100vh",width:"100vw",display:"flex",justifyContent:"center",alignItems:"center"}}>
 <div style={{height:"100vh",width:"100vw",display:"flex",justifyContent:"center",alignItems:"center"}}>
    
    <div>
       <h1> welcome {user?.displayName}</h1>
     <br />
     <h3> Emil is : {user?.email}</h3>
     <br />
     {/* <h5> Last Sign-in : {user?.metadata?.lastSignInTime}</h5>
     <br />
     <h5> Created At : {user?.metadata?.creationTime}</h5> */}
     {/* <br /> */}
     <h5> Last Sign-in : {moment(user?.metadata?.lastSignInTime).format('MMM Do YY')}</h5>
     <br />
     <h5> Created At : {moment(user?.metadata?.creationTime).format('MMMM Do YYYY, h:mm:ss a')}</h5>
     {/* <Moment/> */}
     <br />
     <button> delete your acount</button>
      </div>
{/* This Is Home Page */}
    </div>
    </div>
  )
}

export default JsPage
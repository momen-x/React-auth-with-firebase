import  { useState, type FormEvent } from 'react';
import {  Link } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
// Login Page Component
const LoginPage = () => {
 const navigator=useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading,setLoading] = useState(false);
  const [errorEmail,setErrorEmail] = useState("");
  const [errorPassword,setErrorPassword] = useState("");
  const [error,setError] = useState("");
  

const validation=()=>{
  if(!email.trim()){
    setErrorEmail("the email is required");
    return false;
  }
  if(!password.trim()){
    setErrorPassword("the password is required");
    return false;
  }
  if(password.length<6){
    setErrorPassword("the password is invalied");
    return false;
  }
  if(!email.includes("@")){
    setErrorEmail("the email must contains @");
    return false;
  }
  return true;
}


  const handleSubmit = (e:FormEvent) => {
    e.preventDefault();
    if(!validation()){
      return 
    }
    setErrorEmail("");
    setErrorPassword("");
    setError("");
    signInWithEmailAndPassword(auth,email,password)
    .then((userCredential) => {
      // Signed in 
      setLoading(true)
      const user = userCredential.user;
  
      navigator("/")
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      // const errorMessage = error.message;
      
      switch (errorCode) {
    case "auth/wrong-password":
      setErrorPassword("The password is incorrect");
      break;
    case "auth/user-not-found":
      setErrorEmail("No account found with this email");
      break;
    // ... other cases
    default:
      // setError("An unexpected error occurred");
      setError("invalied email or password")
  }
    }).finally(()=>{
      setLoading(false)
    });

  };

  return (
    <div className="page-container auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue your learning journey</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {error&&<p style={{fontSize:"12px",color:"red"}}>{error}</p>}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
                aria-describedby={errorEmail ? "email-error" : undefined}
            />
            {errorEmail && (
  <p id="email-error" style={{fontSize:"12px",color:"red"}}>
    {errorEmail}
  </p>
)}
          </div>
          <div className="form-group">
            <p style={{fontSize:"12px",color:"red"}}>{errorPassword}</p>

            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
            />
          </div>
          {/* <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox"  />
              <span className="checkmark"></span>
              Remember me
            </label>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div> */}
          <button type="submit" className="btn btn-primary btn-full">
            {loading?"loading":"Sign In"}
            </button>
        </form>
        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register" className="auth-link">Sign up now</Link></p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
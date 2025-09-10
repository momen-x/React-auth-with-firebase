import  { useState, type FormEvent } from 'react';
import {  Link } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';

// Login Page Component
const LoginPage = () => {
 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading,setLoading] = useState(false);

  const handleSubmit = (e:FormEvent) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth,email,password)
    .then((userCredential) => {
      // Signed in 
      setLoading(true)
      const user = userCredential.user;
      console.log(user);
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode,errorMessage);
      alert("some thing went wrong")
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
            />
          </div>
          <div className="form-group">
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
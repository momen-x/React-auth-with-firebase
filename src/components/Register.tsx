import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import "../App.css"
import { auth } from '../firebase/config';
import { updateProfile } from "firebase/auth";

const Register = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState({
    password: "",
    confirmPassword: "",
    email: "",
    username: "",
    general: "",
  });

  const validation = () => {
    let isError = false;
    const newErrors = {
      password: "",
      confirmPassword: "",
      email: "",
      username: "",
      general: "",
    };

    if (!email) {
      newErrors.email = "Email is required";
      isError = true;
    }
    if (!username.trim()) {
      newErrors.username = "Username is required";
      isError = true;
    }
    if (!password) {
      newErrors.password = "Password is required";
      isError = true;
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
      isError = true;
    }
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords don't match";
      isError = true;
    }

    setError(newErrors);
    return isError;
  };

  const clearError = () => {
    setError({
      password: "",
      confirmPassword: "",
      email: "",
      general: "",
      username: ""
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (validation()) {
      return;
    }

    clearError();

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, {
        displayName: username,
        // photoURL: "https://example.com/jane-q-user/profile.jpg"
      });
      
      navigate("/");
    } catch (error: any) {
      const errorCode = error.code;
      const newErrors = { ...error };
      
      switch (errorCode) {
        case "auth/email-already-in-use":
          setError({ ...newErrors, email: "This email is already registered" });
          break;
        case "auth/invalid-email":
          setError({ ...newErrors, email: "Please enter a valid email address" });
          break;
        case "auth/weak-password":
          setError({ ...newErrors, password: "Password should be at least 6 characters" });
          break;
        case "auth/network-request-failed":
          setError({ ...newErrors, general: "Network error. Please check your connection" });
          break;
        default:
          setError({ ...newErrors, general: "An unexpected error occurred. Please try again" });
      }
    }
  };

  return (
    <div className="page-container auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Create Account</h2>
          <p>Join us to start your coding journey</p>
        </div>
        <form className="auth-form" onSubmit={handleSubmit}>
          {error.general && <p style={{ fontSize: "12px", color: "red" }}>{error.general}</p>}
          
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
            {error.email && <p style={{ fontSize: "12px", color: "red" }}>{error.email}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
            {error.username && <p style={{ fontSize: "12px", color: "red" }}>{error.username}</p>}
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
              placeholder="Create a password"
            />
            {error.password && <p style={{ fontSize: "12px", color: "red" }}>{error.password}</p>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm your password"
            />
            {error.confirmPassword && <p style={{ fontSize: "12px", color: "red" }}>{error.confirmPassword}</p>}
          </div>
          
          <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox" required />
              <span className="checkmark"></span>
              I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </label>
          </div>
          
          <button type="submit" className="btn btn-primary btn-full">Create Account</button>
        </form>
        
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="auth-link">Sign in here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
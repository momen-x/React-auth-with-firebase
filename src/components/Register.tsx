import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import "../App.css"
import { auth } from '../firebase/config';
import { updateProfile, sendEmailVerification } from "firebase/auth";

const Register = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({
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
    if (password && password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isError = true;
    }

    setFormErrors(newErrors);
    return isError;
  };

  const clearError = () => {
    setFormErrors({
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
    setIsSubmitting(true);

    try {
    
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const newUser = userCredential.user;
      
      
      await updateProfile(newUser, {
        displayName: username,
      });

  
      try {
        await sendEmailVerification(newUser, {
          url: window.location.origin + '/login', 
          handleCodeInApp: false
        });
        
        console.log("Verification email sent to:", newUser.email);
        
        // Clear form
        setEmail('');
        setUsername('');
        setPassword('');
        setConfirmPassword('');
        
        alert(`Account created successfully! 
        
A verification email has been sent to: ${newUser.email}

Please check:
1. Your inbox
2. Spam/Junk folder
3. Promotions tab (if using Gmail)

Click the verification link in the email to activate your account.`);
        
      } catch (emailError) {
        console.error("Error sending verification email:", emailError);
        alert("Account created but there was an issue sending the verification email. You can try to resend it from the next screen.");
      }
      
 
      
    } catch (error: any) {
      const errorCode = error.code;
      const newErrors = {
        password: "",
        confirmPassword: "",
        email: "",
        username: "",
        general: "",
      };
      
      switch (errorCode) {
        case "auth/email-already-in-use":
          setFormErrors({ ...newErrors, email: "This email is already registered" });
          break;
        case "auth/invalid-email":
          setFormErrors({ ...newErrors, email: "Please enter a valid email address" });
          break;
        case "auth/weak-password":
          setFormErrors({ ...newErrors, password: "Password should be at least 6 characters" });
          break;
        case "auth/network-request-failed":
          setFormErrors({ ...newErrors, general: "Network error. Please check your connection" });
          break;
        case "auth/too-many-requests":
          setFormErrors({ ...newErrors, general: "Too many attempts. Please try again later" });
          break;
        default:
          setFormErrors({ ...newErrors, general: "An unexpected error occurred. Please try again" });
          console.error("Registration error:", error);
      }
    } finally {
      setIsSubmitting(false);
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
          {formErrors.general && (
            <div style={{ 
              backgroundColor: "#f8d7da", 
              color: "#721c24", 
              padding: "10px", 
              borderRadius: "5px", 
              fontSize: "14px",
              marginBottom: "15px"
            }}>
              {formErrors.general}
            </div>
          )}
          
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
              disabled={isSubmitting}
            />
            {formErrors.email && <p style={{ fontSize: "12px", color: "red", marginTop: "5px" }}>{formErrors.email}</p>}
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
              disabled={isSubmitting}
            />
            {formErrors.username && <p style={{ fontSize: "12px", color: "red", marginTop: "5px" }}>{formErrors.username}</p>}
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
              placeholder="Create a password (min 6 characters)"
              disabled={isSubmitting}
            />
            {formErrors.password && <p style={{ fontSize: "12px", color: "red", marginTop: "5px" }}>{formErrors.password}</p>}
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
              disabled={isSubmitting}
            />
            {formErrors.confirmPassword && <p style={{ fontSize: "12px", color: "red", marginTop: "5px" }}>{formErrors.confirmPassword}</p>}
          </div>
          
          <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox" required disabled={isSubmitting} />
              <span className="checkmark"></span>
              I agree to the <a href="#" target="_blank" rel="noopener noreferrer">Terms of Service</a> and <a href="#" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
            </label>
          </div>
          
          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={isSubmitting}
            style={{ 
              opacity: isSubmitting ? 0.7 : 1,
              cursor: isSubmitting ? "not-allowed" : "pointer"
            }}
          >
            {isSubmitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>
        
        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="auth-link">Sign in here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
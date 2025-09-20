import { useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase/config';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

// Login Page Component
const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);
  const [errorEmail, setErrorEmail] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [error, setError] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const validation = () => {
    if (!email.trim()) {
      setErrorEmail("The email is required");
      return false;
    }
    if (!password.trim()) {
      setErrorPassword("The password is required");
      return false;
    }
    if (password.length < 6) {
      setErrorPassword("The password is invalid");
      return false;
    }
    if (!email.includes("@")) {
      setErrorEmail("The email must contain @");
      return false;
    }
    return true;
  };

  const clearErrors = () => {
    setErrorEmail("");
    setErrorPassword("");
    setError("");
    setResetMessage("");
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!validation()) {
      return;
    }
    
    clearErrors();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Check if email is verified
      if (!user.emailVerified) {
        // Let the App component handle the verification prompt
        navigate("/");
        return;
      }
      
      navigate("/");
    } catch (error: any) {
      const errorCode = error.code;
      
      switch (errorCode) {
        case "auth/wrong-password":
        case "auth/invalid-credential":
          setErrorPassword("The password is incorrect");
          break;
        case "auth/user-not-found":
          setErrorEmail("No account found with this email");
          break;
        case "auth/invalid-email":
          setErrorEmail("Please enter a valid email address");
          break;
        case "auth/user-disabled":
          setError("This account has been disabled");
          break;
        case "auth/too-many-requests":
          setError("Too many failed attempts. Please try again later");
          break;
        default:
          setError("Invalid email or password");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    // Clear previous messages
    clearErrors();

    if (!email.trim()) {
      setErrorEmail("Please enter your email address first");
      return;
    }

    if (!email.includes("@")) {
      setErrorEmail("Please enter a valid email address");
      return;
    }

    setResetLoading(true);

    try {
      await sendPasswordResetEmail(auth, email, {
        url: window.location.origin + '/login', // Redirect back to login after reset
        handleCodeInApp: false
      });

      setResetMessage(`Password reset email sent to ${email}. Please check your inbox and spam folder.`);
      
      // Clear the message after 10 seconds
      setTimeout(() => {
        setResetMessage("");
      }, 10000);

    } catch (error: any) {
      const errorCode = error.code;
      
      switch (errorCode) {
        case "auth/user-not-found":
          setErrorEmail("No account found with this email address");
          break;
        case "auth/invalid-email":
          setErrorEmail("Please enter a valid email address");
          break;
        case "auth/too-many-requests":
          setError("Too many password reset requests. Please try again later");
          break;
        default:
          setError("Failed to send password reset email. Please try again");
      }
    } finally {
      setResetLoading(false);
    }
  };

  return (
    <div className="page-container auth-page">
      <div className="auth-container">
        <div className="auth-header">
          <h2>Welcome Back</h2>
          <p>Sign in to continue your learning journey</p>
        </div>
        
        <form className="auth-form" onSubmit={handleSubmit}>
          {error && <p style={{ fontSize: "12px", color: "red", marginBottom: "10px" }}>{error}</p>}
          
          {resetMessage && (
            <div style={{
              backgroundColor: "#d4edda",
              color: "#155724",
              padding: "10px",
              borderRadius: "5px",
              fontSize: "14px",
              marginBottom: "15px",
              border: "1px solid #c3e6cb"
            }}>
              ✅ {resetMessage}
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
              aria-describedby={errorEmail ? "email-error" : undefined}
              disabled={loading || resetLoading}
            />
            {errorEmail && (
              <p id="email-error" style={{ fontSize: "12px", color: "red", marginTop: "5px" }}>
                {errorEmail}
              </p>
            )}
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
              disabled={loading || resetLoading}
            />
            {errorPassword && (
              <p style={{ fontSize: "12px", color: "red", marginTop: "5px" }}>
                {errorPassword}
              </p>
            )}
          </div>

          <div className="form-options" style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            marginBottom: "20px" 
          }}>
            <label className="checkbox-container" style={{ margin: 0 }}>
              <input type="checkbox" />
              <span className="checkmark"></span>
              Remember me
            </label>
            
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={resetLoading || loading}
              style={{
                background: "none",
                border: "none",
                color: resetLoading ? "#ccc" : "#007bff",
                textDecoration: "underline",
                cursor: resetLoading ? "not-allowed" : "pointer",
                fontSize: "14px",
                padding: "0"
              }}
            >
              {resetLoading ? "Sending..." : "Forgot password?"}
            </button>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={loading || resetLoading}
            style={{
              opacity: (loading || resetLoading) ? 0.7 : 1,
              cursor: (loading || resetLoading) ? "not-allowed" : "pointer"
            }}
          >
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          <p>Don't have an account? <Link to="/register" className="auth-link">Sign up now</Link></p>
        </div>

        {/* Instructions for users */}
        {resetMessage && (
          <div style={{
            marginTop: "20px",
            padding: "15px",
            backgroundColor: "#f8f9fa",
            borderRadius: "8px",
            fontSize: "12px",
            color: "#666",
            textAlign: "center"
          }}>
            <strong>📧 Check your email:</strong>
            <ul style={{ textAlign: "left", marginTop: "10px", paddingLeft: "20px" }}>
              <li>Look in your inbox for the password reset email</li>
              <li>Check your spam/junk folder if you don't see it</li>
              <li>Click the reset link in the email</li>
              <li>Create a new password</li>
              <li>Return here to sign in with your new password</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LoginPage;
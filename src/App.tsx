import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import AboutPage from "./components/AboutPage"
import ProfilePage from "./components/ProfilePage"
import Register from "./components/Register"
import LoginPage from "./components/LoginPage"
import { useEffect, useState } from "react"
import {useAuthState} from "react-firebase-hooks/auth"
import { auth } from "./firebase/config"
import Home from "./components/Home"
import { sendEmailVerification } from "firebase/auth"

const Navigation = () => {
  const navigate = useNavigate();
  const [user, loading, error] = useAuthState(auth);
  const location = useLocation();
  const [darkMode, setDarkMode] = useState(false);

  // Load theme preference from localStorage on component mount
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      setDarkMode(savedTheme === 'dark');
      document.body.classList.toggle('dark-mode', savedTheme === 'dark');
    } else {
      // Check for system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDark);
      document.body.classList.toggle('dark-mode', prefersDark);
      localStorage.setItem('theme', prefersDark ? 'dark' : 'light');
    }
  }, []);

  // Toggle dark/light mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.body.classList.toggle('dark-mode', newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  if (error) {
    return (
      <div>{error.message}</div>
    )
  }

  if (loading) {
    return (
      <div>
        <p>loading ...</p>
      </div>
    )
  }

  return (
    <header className={`app-header ${darkMode ? 'dark' : 'light'}`}>
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">💻</span>
          CodeLearn
        </Link>
        <nav className="nav-menu">
          {user ? 
            <>
              <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>Home</Link>
              <Link to="/about" className={location.pathname === '/about' ? 'nav-link active' : 'nav-link'}>About</Link>
              <Link to="/profile" className={location.pathname === '/profile' ? 'nav-link active' : 'nav-link'}>Profile</Link>
            </> 
            : null
          }
         
          {user ? 
            <>
              <p>{user.email}</p>
              <button onClick={() => auth.signOut()
                .then(() => {
                  navigate("/login");
                })
                .catch(() => {
                  alert("Unexpected error, check your network");
                })
              }>
                Logout
              </button>
            </>
            : 
            <>
              <Link to="/login" className={location.pathname === '/login' ? 'nav-link active' : 'nav-link'}>Login</Link>
              <Link to="/register" className={location.pathname === '/register' ? 'nav-link active' : 'nav-link'}>Register</Link> 
            </>
          }
    
          {/* Dark/Light Mode Toggle */}
          <button 
            className="theme-toggle"
            onClick={toggleDarkMode}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </nav>
      </div>
    </header>
  );
};

// Email Verification Component
const EmailVerificationPrompt = ({ user }: { user: any }) => {
  const [isResending, setIsResending] = useState(false);

  const handleResendVerification = async () => {
    if (!user || isResending) return;
    
    setIsResending(true);
    try {
      await sendEmailVerification(user, {
        url: window.location.origin + '/login',
        handleCodeInApp: false
      });
      
      console.log("Verification email resent to:", user.email);
      alert(`Verification email sent to: ${user.email}

Please check:
1. Your inbox
2. Spam/Junk folder  
3. Promotions tab (if using Gmail)
4. Wait a few minutes for delivery

If you still don't receive it, there might be a Firebase configuration issue.`);
    } catch (error: any) {
      console.error("Error sending verification email:", error);
      alert("Error sending verification email: " + error.message + "\n\nThis might be a Firebase configuration issue.");
    } finally {
      setIsResending(false);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      width: "100vw  ", 
      height: "calc(100vh - 80px)", 
      justifyContent: "center", 
      alignItems: "center",
      gap: "20px",
      padding: "20px",
      textAlign: "center"
    }}>
      <div style={{
        maxWidth: "500px",
        padding: "40px",
        border: "1px solid #ddd",
        borderRadius: "10px",
        backgroundColor: "#f9f9f9"
      }}>
        <h2 style={{ color: "#d63384", marginBottom: "20px" }}>Email Verification Required</h2>
        <p style={{ marginBottom: "10px" }}>
          Please verify your email address <strong>{user?.email}</strong> before continuing.
        </p>
        <p style={{ marginBottom: "30px", color: "#666" }}>
          Check your inbox for the verification email and click the verification link.
        </p>
        
        <div style={{ display: "flex", gap: "10px", justifyContent: "center", flexWrap: "wrap" }}>
          <button 
            onClick={handleResendVerification}
            disabled={isResending}
            style={{ 
              padding: "10px 20px", 
              backgroundColor: isResending ? "#ccc" : "#007bff", 
              color: "white", 
              border: "none", 
              borderRadius: "5px",
              cursor: isResending ? "not-allowed" : "pointer"
            }}
          >
            {isResending ? "Sending..." : "Resend Verification Email"}
          </button>
          
          <button 
            onClick={handleRefresh}
            style={{ 
              padding: "10px 20px", 
              backgroundColor: "#28a745", 
              color: "white", 
              border: "none", 
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            I've Verified - Refresh
          </button>
          
          <button 
            onClick={() => auth.signOut()}
            style={{ 
              padding: "10px 20px", 
              backgroundColor: "#6c757d", 
              color: "white", 
              border: "none", 
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            Use Different Email
          </button>
        </div>
      </div>
    </div>
  );
};

function App() {
  const [user, loading] = useAuthState(auth);

  // Show loading while checking auth state
  if (loading) {
    return (
      <div style={{ 
        display: "flex", 
        justifyContent: "center", 
        alignItems: "center", 
        height: "100vh" 
      }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div>
      <header>
        <Navigation />
      </header>

      <main>
        {user ? (
          // User is logged in
          user.emailVerified ? (
            // User is verified - show all routes
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/login" element={<Home />} /> {/* Redirect to home if already logged in */}
              <Route path="/register" element={<Home />} /> {/* Redirect to home if already logged in */}
            </Routes>
          ) : (
            // User is not verified - show verification prompt for all routes
            <Routes>
              <Route path="*" element={<EmailVerificationPrompt user={user} />} />
            </Routes>
          )
        ) : (
          // User is not logged in - show auth routes only
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<LoginPage />} /> {/* Redirect all other routes to login */}
          </Routes>
        )}
      </main>
    </div>
  );
}

export default App;
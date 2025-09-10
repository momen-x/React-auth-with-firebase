import { Link, Route, Routes, useLocation } from "react-router-dom"
import Home from "./components/Home"
import HtmlPage from "./components/HtmlPage"
import JsPage from "./components/JsPage"
import Register from "./components/Register"
import LoginPage from "./components/LoginPage"
import { useEffect, useState } from "react"
import {useAuthState} from "react-firebase-hooks/auth"
import { auth } from "./firebase/config"




const Navigation = () => {
  const [user,loading,error]=useAuthState(auth);
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
// npm install firebase --legacy-peer-deps
  // Toggle dark/light mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    document.body.classList.toggle('dark-mode', newDarkMode);
    localStorage.setItem('theme', newDarkMode ? 'dark' : 'light');
  };

  return (
    <header className={`app-header ${darkMode ? 'dark' : 'light'}`}>
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon">💻</span>
          CodeLearn
        </Link>
        <nav className="nav-menu">
          <Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>Home</Link>
          <Link to="/html" className={location.pathname === '/html' ? 'nav-link active' : 'nav-link'}>HTML</Link>
          <Link to="/js" className={location.pathname === '/js' ? 'nav-link active' : 'nav-link'}>JavaScript</Link>
         {user? <>
         <p>{user.email}</p>
         <button onClick={()=>auth.signOut().then(()=>{alert("sign out successfully")}).catch(()=>{alert("unexpected error , check from network")})}>Logout</button>
         </>
         : <>
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


function App() {


  return (
<div >

<header>
  <Navigation/>
</header>
  {/* <header style={{display:"flex",position:"fixed",left:"0",top:"0",width:"100vw",justifyContent:'space-around',alignItems:"center"}}>
<Link to={"/"}>Home</Link>
<Link to={"/html"}>HTML</Link>
<Link to={"/js"}>JS</Link>
<Link to={"/login"}>Login</Link>
<Link to={"/register"}>Register</Link>
  </header> */}
<Routes>
  <Route path="/" element={<Home/>}/>
  <Route path="/html" element={<HtmlPage/>}/>
  <Route path="/js" element={<JsPage/>}/>
  <Route path="/login" element={<LoginPage/>}/>
  <Route path="/register" element={<Register/>}/>
  {/* <Route path="/js" element={<JsPage/>}/> */}
</Routes>


</div>
  )
}

export default App

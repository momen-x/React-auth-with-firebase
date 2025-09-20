import { Link, Route, Routes, useLocation, useNavigate } from "react-router-dom"
import Home from "./components/Home"
import HtmlPage from "./components/HtmlPage"
import JsPage from "./components/JsPage"
import Register from "./components/Register"
import LoginPage from "./components/LoginPage"
import { useEffect, useState } from "react"
import {useAuthState} from "react-firebase-hooks/auth"
import { auth } from "./firebase/config"



// Custom hook to block navigation
// function useNavigationBlocker(when:any) {
//   const navigate = useNavigate();
  
//   useEffect(() => {
//     if (!when) return;

//     // Handle browser back/forward buttons
//     const handlePopState = (event:any) => {
//       const message = "You have unsaved changes. Are you sure you want to leave?";
//       if (!window.confirm(message)) {
//         navigate(-1); // Go back to the current page
//         window.history.pushState(null, '', window.location.pathname);
//       }
//     };

//     window.history.pushState(null, '', window.location.pathname);
//     window.addEventListener('popstate', handlePopState);

//     return () => {
//       window.removeEventListener('popstate', handlePopState);
//     };
//   }, [when, navigate]);

//   // Handle internal link clicks
//   useEffect(() => {
//     if (!when) return;

//     const handleLinkClick = (e:any) => {
//       const link = e.target.closest('a');
//       if (link && link.getAttribute('href')?.startsWith('/')) {
//         const message = "You have unsaved changes. Are you sure you want to leave?";
//         if (!window.confirm(message)) {
//           e.preventDefault();
//           e.stopPropagation();
//         }
//       }
//     };

//     document.addEventListener('click', handleLinkClick, true);
    
//     return () => {
//       document.removeEventListener('click', handleLinkClick, true);
//     };
//   }, [when]);
// }



const Navigation = () => {
  const navigate=useNavigate();
  const [user,loading,error]=useAuthState(auth);
  console.log("the user is : ",user?.displayName);
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
          {user? <><Link to="/" className={location.pathname === '/' ? 'nav-link active' : 'nav-link'}>Home</Link>
          <Link to="/html" className={location.pathname === '/html' ? 'nav-link active' : 'nav-link'}>HTML</Link>
          <Link to="/js" className={location.pathname === '/js' ? 'nav-link active' : 'nav-link'}>JavaScript</Link></>:null}
         
         {user? <>
         <p>{user.email}</p>
         <button onClick={()=>auth.signOut().
          then(()=>{navigate("/login");
            
          }).
          catch(()=>{alert("unexpected error , check from network")})}>Logout</button>
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
  const navigate=useNavigate();
 const [user]=useAuthState(auth);


 
 useEffect(()=>{
  if(user){
    navigate("/"); 
  }
  else{
    navigate("/login");  
  }
},[user])

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
  {user?<Routes>
  <Route path="/" element={<Home/>}/>
  <Route path="/html" element={<HtmlPage/>}/>
  <Route path="/js" element={<JsPage/>}/>
 
  {/* <Route path="/js" element={<JsPage/>}/> */}
</Routes>:<Routes>
   <Route path="/login" element={<LoginPage/>}/>
  <Route path="/register" element={<Register/>}/>
  </Routes>}



</div>
  )
}

export default App

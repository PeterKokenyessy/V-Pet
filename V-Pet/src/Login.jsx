import { useState, useEffect } from "react";
import { auth } from "./firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  onAuthStateChanged,
  signOut
} from "firebase/auth";
import NavButton from './NavButton'
import "./Login.css"

function Login() {

 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser);
      setUser(currentUser);
    });

    return () => unsubscribe(); // cleanup listener on unmount
  }, []);

  useEffect(() => {
     alert("This app is under development. It's a beta");
  },[])

  async function handleSignUp() {
    setError(null);
    setMessage(null);
    try {
      const registeredUser = await createUserWithEmailAndPassword(auth, email, password);
      console.log("Sign-up successful", registeredUser);
      setMessage("✅ Sign-up successful.");
    } catch (err) {
      console.log("Sign-up failed", err);
      setError(err.message);
    }
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      console.log("Signed out")
    } catch (err) {
      console.error("Error signing out", err)
    }
  }

  async function handleSignIn() {
    setError(null);
    setMessage(null);
    try {
      const loggedInUser = await signInWithEmailAndPassword(auth, email, password);
      console.log("Sign-in successful", loggedInUser);
      setMessage("✅ Sign-in successful.");
    } catch (err) {
      console.log("Sign-in failed", err);
      setError(err.message);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Login Page</h1>

        {!user ? (
          <>
            <input
              className="login-input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              className="login-input"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="button-group">
              <button className="login-btn" onClick={handleSignUp}>Sign Up</button>
              <button className="login-btn" onClick={handleSignIn}>Sign In</button>
            </div>
          </>
        ) : (
          <div className="welcome-msg">Welcome, {user.email}</div>
        )}

        {error && <div className="error-msg">{error}</div>}
        {message && <div className="success-msg">{message}</div>}

        <button className="logout-btn" onClick={handleLogout}>Logout</button>

        <div className="back-btn">
          <NavButton name="Home" target="/Select" />
        </div>
      </div>
    </div>
  );
}

export default Login; 

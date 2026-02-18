import { useState } from "react";
import api from "../utils/api";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLogin, setIsLogin] = useState(true);
  const { login } = useAuth();
  const nav = useNavigate();

  const submit = async () => {
    setError("");
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const res = await api.post(endpoint, { email, password });
      login(res.data.token);
      nav("/");
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Task Scheduler</h1>
        <p className="subtitle">{isLogin ? "Welcome back!" : "Create your account"}</p>
        
        {error && <div className="error-message">{error}</div>}
        
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && submit()}
            className="form-input"
          />
        </div>
        
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && submit()}
            className="form-input"
          />
        </div>
        
        <button onClick={submit} className="submit-btn">
          {isLogin ? "Login" : "Register"}
        </button>
        
        <div className="toggle-mode">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => setIsLogin(!isLogin)} className="toggle-link">
            {isLogin ? "Register" : "Login"}
          </span>
        </div>
      </div>
    </div>
  );
}

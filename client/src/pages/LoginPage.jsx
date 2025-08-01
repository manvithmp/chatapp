import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = import.meta.env.VITE_API_BASE_URL;

export default function LoginPage({ setUser }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState("");
  const nav = useNavigate();

  const handleLogin = async () => {
    const res = await axios.post(`${API}/api/auth/login`, { username, password });
    setUser(res.data);
    nav("/chat");
  };

  const handleRegister = async () => {
    const res = await axios.post(`${API}/api/auth/register`, { username, password, avatar });
    setUser(res.data);
    nav("/chat");
  };

  return (
    <div className="login">
      <input placeholder="Username" onChange={e => setUsername(e.target.value)} />
      <input placeholder="Password" type="password" onChange={e => setPassword(e.target.value)} />
      <input placeholder="Avatar URL" onChange={e => setAvatar(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

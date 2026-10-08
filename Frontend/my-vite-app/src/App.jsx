import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = useState('');

  // Fetch Protected Data if Token Exists
  useEffect(() => {
    if (token) {
      axios.get('http://localhost:5000/api/auth/user', {
        headers: { 'x-auth-token': token }
      })
      .then(res => setUserData(res.data))
      .catch(() => logout());
    }
  }, [token]);

  const register = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/register', { email, password });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setMessage('Registered successfully!');
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Error registering');
    }
  };

  const login = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      setToken(res.data.token);
      localStorage.setItem('token', res.data.token);
      setMessage('Logged in successfully!');
    } catch (err) {
      setMessage(err.response?.data?.msg || 'Error logging in');
    }
  };

  const logout = () => {
    setToken('');
    setUserData(null);
    localStorage.removeItem('token');
    setMessage('Logged out');
  };

  return (
    <div style={{ padding: '50px', fontFamily: 'Arial' }}>
      <h2>MERN JWT Authentication Example</h2>
      <p style={{ color: 'red' }}>{message}</p>

      {!token ? (
        <div>
          <h3>Login / Register</h3>
          <form>
            <input 
              type="email" placeholder="Email" 
              value={email} onChange={e => setEmail(e.target.value)} 
            /><br/><br/>
            <input 
              type="password" placeholder="Password" 
              value={password} onChange={e => setPassword(e.target.value)} 
            /><br/><br/>
            <button onClick={login}>Login</button>
            <button onClick={register} style={{ marginLeft: '10px' }}>Register</button>
          </form>
        </div>
      ) : (
        <div>
          <h3>Welcome to your Dashboard!</h3>
          {userData ? <p>Logged in user email: <b>{userData.email}</b></p> : <p>Loading...</p>}
          <button onClick={logout}>Logout</button>
        </div>
      )}
    </div>
  );
}

export default App;
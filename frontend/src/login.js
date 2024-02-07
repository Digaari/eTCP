import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { BrowserRouter as Navigate} from 'react-router-dom';
import UserContext from './UserContext';
import axios from 'axios';
import {
  Container,
  TextField,
  Button,
  AppBar,
  Toolbar,
  Typography,
  Card,
  CardContent,
} from '@mui/material';

import logoLeft from './sigsLogo.png';
import logoRight from './divLogo.png';

const LoginForm = () => {
  const navigate = useNavigate();
  const { setUserData } = useContext(UserContext);
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (loginData.username.trim() === '' || loginData.password.trim() === '') {
      setErrorMessage('Please fill in all fields.');
      return;
    }

    try {
      // Send login request to the server
      const response = await axios.post('http://localhost:5000/login', loginData);

      // Check if the login was successful
      if (response.status === 200) {
        // Save the token to localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('Uname', loginData.username);

        axios.defaults.headers.common['Uname'] = loginData.username;

        // Set the username in the UserContext
        setUserData({ username: loginData.username });

        // Pass the username to the navigate function
        navigate('/home', { state: { username: loginData.username, tokens: response.data.token } });
        
      } else {
        setErrorMessage('Invalid username or password.');
      }
    } catch (error) {
      console.error('Error during login:', error.message);
      setErrorMessage('Wrong Credentials!');
    }
  };

  console.log(localStorage.getItem('token'));


  return (
    <div>
      <AppBar position="static" style={{ background: 'linear-gradient(to right, #1bb2ff, #03045e, #006f57)' }}>
        <Toolbar>
          <img src={logoLeft} alt="Left Logo" style={{ height: '50px', marginRight: 'auto' }} />
          <Typography variant="h6" style={{ textAlign: 'center', fontWeight: 'bold' }}>
            TCP AUTOMATION SOFTWARE
          </Typography>
          <img src={logoRight} alt="Right Logo" style={{ height: '50px', marginLeft: 'auto' }} />
        </Toolbar>
      </AppBar>
      <Container
        maxWidth="sm"
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}
      >
        <Card>
          <CardContent>
            <AppBar position="static" style={{ background: 'linear-gradient(to right, #1bb2ff, #03045e, #006f57)' }}>
              <Toolbar>
                <Typography variant="h6" style={{ textAlign: 'center', width: '100%', fontWeight: 'bold' }}>
                  Login to Your Account
                </Typography>
              </Toolbar>
            </AppBar>
            {formSubmitted ? (
              <div style={{ textAlign: 'center' }}>
                <Typography variant="h5" gutterBottom>
                  Login Successful!
                </Typography>
                {/* Add redirection or other logic here */}
                <Navigate to="/home" />
              </div>
            ) : (
              <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '400px', marginTop: '20px' }}>
                <TextField
                  label="Username"
                  name="username"
                  value={loginData.username}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Password"
                  name="password"
                  type="password"
                  value={loginData.password}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />
                <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px'}}>
                  {errorMessage && (
                    <Typography variant="body2" color="error" gutterBottom>
                      {errorMessage}
                    </Typography>
                  )}
                  <Button type="submit" variant="contained" color="primary">
                    Login
                  </Button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
                  <Typography variant="body2">
                  <Link to="/login" style={{ color: 'blue', textDecoration: 'none' }}>
                    Forgot Password?
                    </Link>
                  </Typography>
                  <Typography variant="body2" color="black">
                    Don't Have An Account? <br />
                    <Link to="/register" style={{ color: 'blue', textDecoration: 'none' }}>
                      Register!
                      </Link>
                      </Typography>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default LoginForm;

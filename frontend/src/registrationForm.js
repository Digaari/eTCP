import React, { useState, useEffect } from 'react';
import logoLeft from './sigsLogo.png';
import logoRight from './divLogo.png';
import {
  Container,
  TextField,
  Button,
  AppBar,
  Toolbar,
  Typography,
  Link,
  Card,
  CardContent,
} from '@mui/material';
import axios from 'axios';

const RegistrationForm = () => {
  const [userData, setUserData] = useState({
    Fmn: '',
    password: '',
    conf_password: '',
  });

  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Assuming userData.Fmn is the Fmn you want to pass to the /registerSuccess route
        const response = await axios.get(`http://localhost:5000/registerSuccess?Fmn=${userData.Fmn}`);
        setUserData(response.data);
      } catch (error) {
        console.error('Error fetching user data:', error.message);
      }
    };
  
    if (formSubmitted) {
      fetchData();
    }
  }, [formSubmitted]);

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const generateRandomPassword = (length) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*<>';
    return Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');
  };   

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    // Check if passwords match
    if (userData.password !== userData.conf_password) {
      setErrorMessage('Passwords do not match!');
      return;
    }
  
    // Check if any field is empty
    if (userData.Fmn.trim() === '' || userData.password.trim() === '') {
      // Display an error message
      setErrorMessage('Please fill in all fields.');
      return;
    }
  
    // Generate a random password
    const password = generateRandomPassword(10);
  
    // Create UID from Fmn
    const UID = `${userData.Fmn.replace(/\s/g, '')}`.toUpperCase();
  
    // Send registration data to the backend
    await axios.post('http://localhost:5000/registerUser', {
      ...userData,
      Password: password,
      UID: UID,
    });
  
    // Set formSubmitted to true to hide the form
    setFormSubmitted(true);
  };
  

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
      <Container maxWidth="sm" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
        <Card>
          <CardContent>
          {formSubmitted ? (
            <div style={{ textAlign: 'center' }}>
            <AppBar
              position="static"
              style={{ background: 'linear-gradient(to right, #1bb2ff, #03045e, #006f57)' }}
            >
              <Toolbar>
                <Typography variant="h6" style={{ textAlign: 'center', width: '100%', fontWeight: 'bold' }}>
                You Have Been Successfully Registered!
                </Typography>
              </Toolbar>
            </AppBar>          
            
              <AppBar
                position="static"
                style={{ background: 'linear-gradient(to right, #1bb2ff, #03045e, #006f57)' }}
              >
              </AppBar>
              <Typography variant="h6" style={{ textAlign: 'centre', width: '100%', fontWeight: 'bold', marginTop: '20px', marginBottom: '20px' }}>
                    Your Credentials Are As Follows:
                  </Typography>
              <div style={{ textAlign: 'left' }}>
              <Typography variant="h6" gutterBottom style={{ padding: '5px' }}>
                Username - {userData.UID}
              </Typography>
              <Typography variant="h6" gutterBottom style={{ padding: '5px' }}>
                Password - {userData.Password}
              </Typography>
            </div>
                <Link href="/login" color="primary">
                  Go To Login Page!
                </Link>
              </div>
            ) : (
        <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: '400px', marginTop: '20px' }}>
                      <AppBar
                        position="static"
                        style={{ background: 'linear-gradient(to right, #1bb2ff, #03045e, #006f57)' }}
                      >
                        <Toolbar>
                          <Typography variant="h6" style={{ textAlign: 'center', width: '100%', fontWeight: 'bold' }}>
                          Fill the Form To Register!
                          </Typography>
                        </Toolbar>
                      </AppBar>      
                <TextField
                  label="Unit/Fmn Name"
                  name="Fmn"
                  value={userData.Fmn}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />

                <TextField
                  label="Set New Password"
                  name="password"
                  type="password"
                  value={userData.password}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />

                <TextField
                  label="Confirm New Password"
                  name="conf_password"
                  type="password"
                  value={userData.conf_password}
                  onChange={handleInputChange}
                  fullWidth
                  margin="normal"
                />

                <div style={{ textAlign: 'center', marginTop: '20px' }}>
                  {errorMessage && (
                    <Typography variant="body2" color="error" gutterBottom>
                      {errorMessage}
                    </Typography>
                  )}
                  <Button type="submit" variant="contained" color="primary" onClick={handleSubmit}>
                    Register
                  </Button>
                </div>
              </form>
            )}
          </CardContent>
        </Card>
      </Container>
    </div>
  );
};

export default RegistrationForm;

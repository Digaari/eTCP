import React, { useState, useContext} from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import logoLeft from './sigsLogo.png';
import logoRight from './divLogo.png';
import bannerImage from './banner.png';
import UserContext from './UserContext';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from '@mui/material';
import SApplns from './sanctionedApplns';
import RejectedApplns from './RejectedApplns';
import PendingApplns from './underProcessApplns';
import AllApplns from './allApplns';


const LandingPage = () => {
  const navigate = useNavigate();
  // const location = useLocation();
  const { userData } = useContext(UserContext);
  const [tabValue, setTabValue] = useState(0);
  const [isGreetingOpen, setIsGreetingOpen] = useState(true);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCloseGreeting = () => {
    setIsGreetingOpen(false);
  };

 // Access username from the location state
  // const username = location.state?.username || '';
  // const tokens = location.state?.tokens || '';

//  // Log the username to the console
  // console.log('Username:', {username});

  // Use navigate to send username to /form page
  const goToFormPage = () => {
    navigate('/form');
  };

  // Use navigate to send username to /form page
  const goToInbox = () => {
    navigate('/inbox');
  };


    const handleLogout = () => {
      localStorage.removeItem('token');// Clear the authentication status in local storage
      navigate('/login');// Navigate to the login page
    };


  return (
      
    <Container maxWidth="xlg">
      <AppBar position="fixed" style={{ background: 'linear-gradient(to right, #1bb2ff, #03045e, #006f57)' }}>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginRight: 'auto' }}>
          <img src={logoRight} alt="Right Logo" style={{ height: '50px', marginRight: '20px' }} loading="lazy" />
            {/* Center the Typography element horizontally */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                TCP AUTOMATION SOFTWARE
              </Typography>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Button color="inherit" onClick={goToInbox} to="/inbox">Inbox</Button>
            <Button color="inherit" onClick={goToFormPage} to="/form">Create a TCP Appln</Button>
            <Button color="inherit" onClick={handleLogout} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span>Logout</span>
              <span style={{ fontSize: '80%', marginBottom: '5px' }}>{userData.username}</span>
          </Button>
          </div>
          <img src={logoLeft} alt="Left Logo" style={{ height: '50px', marginLeft: '20px' }} loading="lazy" />
        </Toolbar>
      </AppBar>

      <img src={bannerImage} alt="Welcome Banner" style={{ paddingTop: '60px', width: '100%', maxHeight: '400px', objectFit: 'cover', marginTop: '20px' }} loading="lazy" />

      <Tabs value={tabValue} onChange={handleChange} centered>
        <Tab label="All Applns" />
        <Tab label="Sanctioned Applns" />
        <Tab label="Rejected Applns" />
        <Tab label="Under Process Applns" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <AllApplns />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <SApplns />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <RejectedApplns />
      </TabPanel>
      <TabPanel value={tabValue} index={3}>
        <PendingApplns />
      </TabPanel>


      {/* Greeting Dialog */}
      <Dialog open={isGreetingOpen} onClose={handleCloseGreeting}>
      <DialogTitle style={{ textAlign: "center" }}>Welcome! {userData.username}</DialogTitle>
      <DialogContent style={{ textAlign: "center" }}>
      <DialogContentText>WELCOME TO TCP AUTOMATION SOFTWARE!</DialogContentText>
      </DialogContent>
      <DialogActions style={{ justifyContent: "center" }}>
      <Button onClick={handleCloseGreeting} color="primary">
      Close
      </Button>
      </DialogActions>
      </Dialog>

    </Container>
  
  );
};

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box>{children}</Box>}
  </div>
);

export default LandingPage;

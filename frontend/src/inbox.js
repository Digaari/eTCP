import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from './UserContext';

import {
  AppBar,
  Toolbar,
  Typography,
  Container as MuiContainer,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from '@mui/material';
import axios from 'axios';
import logoLeft from './sigsLogo.png';
import logoRight from './divLogo.png';
import Cookies from 'js-cookie';

const Container = ({ children }) => (
  <MuiContainer style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
    {children}
  </MuiContainer>
);

const formatDate = (dateString) => {
  const options = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  };
  return new Date(dateString).toLocaleString('en-GB', options);
};

// I NEED TO ACCESS THE ID OF THE FORM AND CALL THAT FROM THE BACKEND SERVER //UPDATE:DONE
const handleRowClick = (form, tokens) => {
  // console.log('Form object:', form);
  const { ApplnID } = form;
  // console.log('ID before making the request:', ApplnID);
  axios
    .get(`http://localhost:5000/inbox/${ApplnID}`, {
      headers: {
        Authorization: `Bearer ${tokens}`,
        'formid': ApplnID,
      },
    })
    .then((response) => {
      console.log(response.data);
    })
    .catch((error) => {
      console.error('Error fetching enlarged form:', error.message);
    });
};

const FormTable = ({ formData, tokens }) => (
  <TableContainer style={{ marginTop: '20px' }} component={Paper}>
    <Table>
    <TableHead>
      <TableRow>
        <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Appln ID</TableCell>
        <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Date, Time</TableCell>
        <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Initiated by</TableCell>
        <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Recommended by</TableCell>
        <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Stn From</TableCell>
        <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Stn To</TableCell>
        <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Nature of Duty</TableCell>
        <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Action</TableCell>
      </TableRow>
    </TableHead>
      <TableBody>
        {formData.map((form, index) => (
          <TableRow key={index}>
            <TableCell style={{ textAlign: 'center' }}>{form.ApplnID}</TableCell>
            <TableCell style={{ textAlign: 'center' }}>{formatDate(form.timeDt)} Hrs</TableCell>
            <TableCell style={{ textAlign: 'center' }}>{form.UID}</TableCell>
            <TableCell style={{ textAlign: 'center' }}>{form.rBy}</TableCell>
            <TableCell style={{ textAlign: 'center' }}>{form.dutyStnFrom}</TableCell>
            <TableCell style={{ textAlign: 'center' }}>{form.dutyStnTo}</TableCell>
            <TableCell style={{ textAlign: 'center' }}>{form.movType}</TableCell>
            <TableCell style={{ textAlign: 'center' }}>
              <Link to={`/inbox/${form.ApplnID}`}>
                <Button variant="outlined" color="primary" onClick={() => handleRowClick(form, tokens)}>
                  Open
                </Button>
              </Link>
              
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

const Inbox = () => {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);
  const [formData, setFormData] = useState([]);
  const [selectedForm, setSelectedForm] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokens = Cookies.get('accessToken');
        const response = await axios.get('http://localhost:5000/inbox', {
          headers: {
            Authorization: `Bearer ${tokens}`
          }
        });
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching form data:', error.message);
      }
    };

    fetchData();
  }, []);

  const goToMyApplns = () => {
    navigate('/home');
  };

  const handleClose = () => {
    setSelectedForm(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Clear the authentication status in local storage
    navigate('/login'); // Navigate to the login page
  };

  return (
    <div>
      <AppBar position="static" style={{ background: 'linear-gradient(to right, #1bb2ff, #03045e, #006f57)' }}>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginRight: 'auto' }}>
            <img src={logoLeft} alt="Left Logo" style={{ height: '50px', marginRight: '20px' }} />
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                TCP AUTOMATION SOFTWARE
              </Typography>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Button color="inherit" onClick={goToMyApplns} to="/home">
              My Applns
            </Button>
            <Button color="inherit" component={Link} to="/form">
              Create a TCP Appln
            </Button>
            <Button color="inherit" onClick={handleLogout} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span>Logout</span>
              <span style={{ fontSize: '80%', marginBottom: '5px' }}>{userData.username}</span>
          </Button>
          </div>
          <img src={logoRight} alt="Right Logo" style={{ height: '50px', marginLeft: '20px' }} />
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '20px' }}>
        <AppBar
          position="static"
          style={{ marginTop: '20px', background: 'linear-gradient(to right, #1bb2ff, #03045e, #006f57)' }}
        >
          <Toolbar>
            <Typography variant="h6" style={{ textAlign: 'center', width: '100%', fontWeight: 'bold' }}>
              Welcome, {userData.username}
            </Typography>
          </Toolbar>
        </AppBar>
        <FormTable formData={formData} tokens={Cookies.get('accessToken')}/>
      </Container>
    </div>
  );
};

export default Inbox;

import React, { useEffect, useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Table, TableContainer, TableHead, Button, DialogActions, DialogTitle, DialogContent, Dialog, TextField, TableBody, TableRow, TableCell, Paper, AppBar, Toolbar, Typography } from '@mui/material';
import axios from 'axios';
import logoLeft from './sigsLogo.png';
import logoRight from './divLogo.png';
import Cookies from 'js-cookie';
import UserContext from './UserContext';


const handleRowClick = (form, tokens) => {
  // console.log('Form object:', form);
  const { ApplnID } = form;
  // console.log('ID before making the request:', ApplnID);
  axios
    .get(`http://localhost:5000/home/${ApplnID}`, {
      headers: {
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

function RejApplns() {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);
  const [formData, setFormData] = useState([]);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [selectedRejectedData, setSelectedRejectedData] = useState(null);
  const [containerDimensions, setContainerDimensions] = useState({ width: window.innerWidth, height: window.innerHeight });
  useEffect(() => {
    const fetchData = async () => {
      try {
        const tokens = Cookies.get('accessToken'); // Extract token from cookie
        const response = await axios.get('http://localhost:5000/myapplns', {
          headers: {
            Authorization: `Bearer ${tokens}`  // Replace with your actual token
          }
        });
        
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching forms data:', error.message);
      }
    };

    const handleResize = () => {
      setContainerDimensions({ width: window.innerWidth, height: window.innerHeight });
    };

    fetchData();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  
  const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Intl.DateTimeFormat('en-GB', options).format(new Date(dateString));
  };

  return (
    <Container maxWidth="xlg" style={{ paddingBottom: '500px' }}>
      <AppBar position="static" style={{ background: 'linear-gradient(to right, #1bb2ff, #03045e, #006f57)' }}>
        <Toolbar>
          <img src={logoLeft} alt="Left Logo" style={{ height: '50px', marginRight: 'auto' }} />
          <Typography variant="h6" style={{ textAlign: 'center', fontWeight: 'bold' }}>
            REJECTED APPLNS
          </Typography>
          <img src={logoRight} alt="Right Logo" style={{ height: '50px', marginLeft: 'auto' }} />
        </Toolbar>
      </AppBar>
      <TableContainer component={Paper} style={{ marginTop: '20px' }}>
        <Table>
          <TableHead>
          <TableRow>
              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Appln ID</TableCell>
              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Date Of Appln</TableCell>
              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Type Of Mov</TableCell>
              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Stn From</TableCell>
              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Stn To</TableCell>
              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Date From</TableCell>
              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Date To</TableCell>
              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Appln Status</TableCell>
              <TableCell style={{ textAlign: 'center', fontWeight: 'bold' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {formData
              .filter((data) => data.applnStatus === 3) // Filter based on applnStatus === 2 ie SANCTIONED
              .map((data, index) => (
              <TableRow key={index}>
                <TableCell style={{ textAlign: 'center' }} >{data.ApplnID}</TableCell>
                <TableCell style={{ textAlign: 'center' }} >{formatDate(data.timeDt)}</TableCell>
                <TableCell style={{ textAlign: 'center' }} >{data.movType}</TableCell>
                <TableCell style={{ textAlign: 'center' }} >{data.dutyStnFrom}</TableCell>
                <TableCell style={{ textAlign: 'center' }} >{data.dutyStnTo}</TableCell>
                <TableCell style={{ textAlign: 'center' }} >{formatDate(data.dtFrom)}</TableCell>
                <TableCell style={{ textAlign: 'center' }} >{formatDate(data.dtTo)}</TableCell>
                <TableCell style={{ textAlign: 'center' }}>
                  {/* {data.applnStatus === 0 && <span style={{ color: 'black' }}>Initiated by {data.UID}</span>} */}
                  {/* {data.applnStatus === 1 && <span style={{ color: 'green' }}>Recommended by {data.rBy}</span>} */}
                  {/* {data.applnStatus === 2 && <span style={{ color: 'blue' }}>Sanctioned by {data.sBy}</span>} */}
                  {data.applnStatus === 3 && <span style={{ color: 'red' }}>Rejected by {data.rejBy}</span>}
                </TableCell>

                <TableCell style={{ textAlign: 'center' }}>
                  {data.applnStatus === 3 ? (
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => {
                        setSelectedRejectedData(data);
                        setShowRejectDialog(true);
                      }}
                    >
                      VIEW OBSN
                    </Button>
                  ) : (
                    <Link to={`/home/${data.ApplnID}`}>
                      <Button variant="outlined" color="primary" onClick={() => handleRowClick(data)}>
                        Open
                      </Button>
                    </Link>
                  )}
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onClose={() => setShowRejectDialog(false)}>
        <DialogTitle>The TCP Requisition was Rejected Due To:</DialogTitle>
        <DialogContent>
          <TextField multiline fullWidth rows={4} variant="outlined" value={selectedRejectedData?.rejReason} />
        </DialogContent>
        <DialogTitle>Rejected By: {`${selectedRejectedData?.rejOffrRk} ${selectedRejectedData?.rejOffrName}, ${selectedRejectedData?.rejOffrAppt}, ${selectedRejectedData?.rejBy}`}</DialogTitle>
        <DialogActions>
          <Button onClick={() => setShowRejectDialog(false)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

    </Container>
  );
}

export default RejApplns;
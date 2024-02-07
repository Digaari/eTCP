import React, { useContext, useEffect, useState } from 'react';
import {Container, AppBar, Toolbar, Typography, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Paper, Button, Dialog, DialogTitle, DialogContent, TextField, MenuItem, DialogActions} from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import UserContext from './UserContext';
import { useNavigate } from 'react-router-dom';

const InboxDetails = () => {
  const { userData } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState([]);
  const [rejectReason, setRejectReason] = useState('');
  const [showFwdDialog, setShowFwdDialog] = useState(false);
  const [showSanctionDialog, setShowSanctionDialog] = useState(false);
  const [selectedFormation, setSelectedFormation] = useState('');
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [recomOffr, setRecomOffr] = useState({ recomOffrRk: '', recomOffrName: '', recomOffrAppt: '',});
  const [rejOffr, setRejOffr] = useState({ rejOffrRk: '', rejOffrName: '', rejOffrAppt: '',});
  const [sancOffr, setSancOffr] = useState({ sancOffrRk: '', sancOffrName: '', sancOffrAppt: '',});
  
  
  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/inbox/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching form data:', error.message);
      }
    };

    fetchFormData();
  }, [id]);


  const handleDownloadPDF = async (filename) => {
    try {
      const response = await axios.get(`http://localhost:5000/downloadpdf?filename=${filename}`, {
        responseType: 'blob', // Set the response type to blob for binary data
      });

      // Create a Blob from the response data
      const blob = new Blob([response.data], { type: 'application/pdf' });

      // Create a link element and trigger a download
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename;
      link.click();
    } catch (error) {
      console.error('Error downloading PDF:', error.message);
    }
  };


  const handleRecomOffrChange = (e, fieldName) => {
    setRecomOffr({ ...recomOffr, [fieldName]: e.target.value });
  };

  const handleRejOffrChange = (e, fieldName) => {
    setRejOffr({ ...rejOffr, [fieldName]: e.target.value });
  };

  const handleSancOffrChange = (e, fieldName) => {
    setSancOffr({ ...sancOffr, [fieldName]: e.target.value });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toISOString().slice(0, 10); // Format: 'YYYY-MM-DD'
    return formattedDate;
  };

  const handleShowRecommendDialog = (data) => {
    setShowFwdDialog(true);
  };

  const handleShowSanctionDialog = () => {
    setShowSanctionDialog(true);
  };

  const handleShowRejectDialog = () => {
    setShowRejectDialog(true);
  };

  const handleR_and_Fwd = async () => {
    if (!selectedFormation) {
      alert('Please select a formation.');
      return;
    }

    const payload = {
      ...formData[0],
      rBy: userData.username,
      newFwdTo: selectedFormation,
      applnStatus: 1,
      ...recomOffr,
    };

    console.log(payload)

    // Send the data to the server
    await axios.post('http://localhost:5000/recommendForm', payload);

    // Perform any other actions if needed
    console.log('Recommended successfully!');

    // Close the dialog
    setShowFwdDialog(false);
    setShowSuccessMessage(true);
  };

  const handleSanction = async (data) => {
    const confirmed = window.confirm('Are you sure?');
    if (confirmed) {
      const payload = {
        ...data,
        sBy: userData.username,
        applnStatus: 2,
        ...sancOffr,
      };
      // Send the data to the server
      await axios.post('http://localhost:5000/sanctionForm', payload);

      // Perform any other actions if needed
      console.log('Sanctioned successfully');
      setShowSuccessMessage(true);
    }
  };

  const handleReject = async (data) => {
    try {
      if (!rejectReason) {
        alert('Please provide a rejection reason.');
        return;
      }

      const payload = {
        ...data,
        rejBy: userData.username,
        rejReason: rejectReason,
        applnStatus: 3,
        ...rejOffr,
      };

      // Send the data to the server
      await axios.post('http://localhost:5000/rejectedForm', payload);

      // Perform any other actions if needed
      console.log('Rejection sent successfully;', rejectReason);
      setShowRejectDialog(false);
      setShowSuccessMessage(true);
    } catch (error) {
      console.error('Error sending Rejection:', error.message);
    }
  };

  const handleNotSanctioned = () => {
    setShowRejectDialog(true);
  };

  const handleCloseRejectDialog = () => {
    setShowRejectDialog(false);
  };

  const handleSuccessMessageClose = () => {
    setShowSuccessMessage(false);
    navigate('/inbox');
  };

  return (
    <div>
      {!showSuccessMessage ? (
        <Container style={{ marginTop: '20px' , paddingBottom: '500px' }}>
        <AppBar
            position="static"
            style={{ background: 'linear-gradient(to right, #1bb2ff, #03045e, #006f57)', margin: '0', boxShadow: 'none'}}
        >
            <Toolbar>
            <Typography variant="h6" style={{ textAlign: 'center', width: '100%', fontWeight: 'bold', textDecoration: 'underline' }}>
                APPLN FOR RD MOV/TCP SANCTION FOR GOVT TPT BETN PLACES NOT CONNECTED BY RAIL/RIVER
            </Typography>
            </Toolbar>
        </AppBar>

          {formData.map((data, index) => (
            <div key={index}>
             <TableContainer component={Paper} style={{ marginTop: '20px' }}>
              <Table sx={{ fontSize: '30px', textAlign: 'center' }}>
                <TableHead>
                  <TableRow>
                    {/* <TableCell>Name</TableCell>
                    <TableCell>Rohan Kumar</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>

                  <TableRow>
                    <TableCell>1.</TableCell>
                    <TableCell>Name of Unit/Sub-Unit</TableCell>
                    <TableCell>{data.UID}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>2.</TableCell>
                    <TableCell>Type Of Mov</TableCell>
                    <TableCell>{data.movType}</TableCell>
                  </TableRow>

                  <TableRow>
                  <TableCell>3.</TableCell>
                    <TableCell>Vehicle Details</TableCell>
                    <TableCell>
                      {data.vehCL.split(',').map((vehCL, subIndex) => {
                        const vehTypeParts = data.vehType.split(',');
                        const vehBAParts = data.vehBA.split(',');
                        return (
                          <React.Fragment key={subIndex}>
                            {subIndex > 0 && <br />}
                            {`${vehCL} - ${vehTypeParts[subIndex]} - ${vehBAParts[subIndex]}`}
                          </React.Fragment>
                        );
                      })}
                    </TableCell>
                  </TableRow>

                  <TableRow>
                  <TableCell>4.</TableCell>
                    <TableCell>Date of Mov (Onward Journey)</TableCell>
                    <TableCell>{formatDate(data.dtFrom)}</TableCell>
                  </TableRow>

                  <TableRow>
                  <TableCell>5.</TableCell>
                    <TableCell>Date of Return</TableCell>
                    <TableCell>{formatDate(data.dtTo)}</TableCell>
                  </TableRow>

                  <TableRow>
                  <TableCell>6.</TableCell>
                    <TableCell>From Station/NRS</TableCell>
                    <TableCell>{data.dutyStnFrom}</TableCell>
                  </TableRow>

                  <TableRow>
                  <TableCell>7.</TableCell>
                    <TableCell>To Station/NRS</TableCell>
                    <TableCell>{data.dutyStnTo}</TableCell>
                  </TableRow>

                  <TableRow>
                  <TableCell>8.</TableCell>
                    <TableCell>One Way Distance (kms)</TableCell>
                    <TableCell>{data.oneWayDist}</TableCell>
                  </TableRow>

                  <TableRow>
                  <TableCell>9.</TableCell>
                    <TableCell>Number of Trips</TableCell>
                    <TableCell>{data.numTrips}</TableCell>
                  </TableRow>

                  <TableRow>
                  <TableCell>10.</TableCell>
                    <TableCell>Exact Nature of Duty</TableCell>
                    <TableCell>{data.movType}</TableCell>
                  </TableRow>

                  <TableRow>
                    <TableCell>11.</TableCell>
                    <TableCell>Auth of Mov</TableCell>
                    <TableCell>{data.movRef} &nbsp;&nbsp;&nbsp;&nbsp;
                    <Button variant="outlined" color="primary" onClick={() => handleDownloadPDF(formData[0].authLetter)}>Auth Letter </Button>
                    </TableCell>
                  </TableRow>

                  <TableRow>
                  <TableCell>12.</TableCell>
                    <TableCell>Reason Why Rail/Air/CHT cannot be used (Detailed Reason to be given)</TableCell>
                    <TableCell>{data.yNoRail}</TableCell>
                  </TableRow>

                  <TableRow>
                  <TableCell>13.</TableCell>
                    <TableCell>Whether the Store Constitute a Full Veh Load?</TableCell>
                    <TableCell>{data.fullVehLd === 1 ? 'YES' : 'NO'}</TableCell>
                  </TableRow>

                  <TableRow>
                  <TableCell>14.</TableCell>
                    <TableCell colSpan={2}>
                        Certified that the veh(s) will not exceed the mileage auth for the year after performing of above duty/journey.
                    </TableCell>
                  </TableRow>

                  {/* Initiating Auth */}
                  <TableRow style={{ pageBreakInside: 'avoid' }}>
                    <TableCell></TableCell>
                    <TableCell>
                    <div style={{ fontWeight: 'bold', color: 'black', display: 'flex', flexDirection: 'column-reverse' }}>
                    Station: c/o 99 APO <br />
                    Dated: {formatDate(data.timeDt)}
                    </div>
                    </TableCell>
                    <TableCell>
                    <div style={{ pageBreakInside: 'avoid' }}>
                    <div style={{ color: 'blue' }}>sd/-xxx</div>
                    <div style={{ color: 'blue' }}>({data.inOffrName})</div>
                    {/* <hr style={{ border: '1px solid black', width: '100%' }} /> */}
                    <div style={{ fontWeight: 'bold', color: 'purple' }}>{data.inOffrRk}</div>
                    <div style={{ fontWeight: 'bold', color: 'purple' }}>{data.inOffrAppt}</div>
                    <div style={{ fontWeight: 'bold', color: 'purple' }}>{data.UID}</div>
                    </div>
                    </TableCell>
                  </TableRow>

                {/* Recommending Auth */}
                {data.rBy && (
                  <TableRow>
                  <TableCell colSpan={3} style={{ textAlign: 'center' }}>
                  <div style={{ fontWeight: 'bold', textDecoration: 'underline', color: 'black' }}>
                      VERIFIED
                  </div>
                  </TableCell>
              </TableRow>
              )}

              {data.rBy && (
              <TableRow>
              <TableCell></TableCell>
                  <TableCell>
                  <div style={{ fontWeight: 'bold', color: 'black' }}>Station: c/o 99 APO</div>
                  <div style={{ fontWeight: 'bold', color: 'black' }}>Dated: {formatDate(data.timeDt)}</div>
                  </TableCell>
                  <TableCell style={{ pageBreakInside: 'avoid' }}>
                  <br />
                  <div style={{ color: 'blue' }}>sd/-xxx</div>
                  <div style={{ color: 'blue' }}>({data.recomOffrName})</div>
                  {/* <hr style={{ border: '1px solid black', width: '100%' }} /> */}
                  <div style={{ fontWeight: 'bold', color: 'purple' }}>{data.recomOffrRk}</div>
                  <div style={{ fontWeight: 'bold', color: 'purple' }}>{data.recomOffrAppt}</div>
                  <div style={{ fontWeight: 'bold', color: 'purple' }}>{data.rBy}</div>
                  </TableCell>
              </TableRow>
                )}

                </TableBody>
              </Table>
            </TableContainer>

              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                {userData.username === data.SAuth ? (
                  <>
                    <Button variant="outlined" style={{ marginRight: '10px' }} color="primary" onClick={() => handleShowSanctionDialog(data)}>
                      Sanction
                    </Button>
                    <Button variant="outlined" color="error" onClick={handleShowRejectDialog}>
                      Not Sanctioned
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outlined" style={{ marginRight: '10px' }} color="success" onClick={() => handleShowRecommendDialog(data)}>
                      Recommend & Fwd
                    </Button>
                    <Button variant="outlined" color="error" onClick={handleShowRejectDialog}>
                      Not Recommended
                    </Button>
                  </>
                )}
              </div>
            </div>
          ))}
        </Container>
      ) : (
        <Typography variant="h5" style={{ textAlign: 'center', marginTop: '50px' }}>
          THANK YOU!
        </Typography>
      )}

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onClose={handleCloseRejectDialog}>
        <DialogTitle>Kindly provide a reason for rejecting the requisition</DialogTitle>
        <DialogContent>
          <TextField
            multiline
            fullWidth
            rows={4}
            label="Rejection Reason"
            variant="outlined"
            value={rejectReason}
            onChange={(e) => setRejectReason(e.target.value)}
          />
          <TextField
            fullWidth
            label="Rank"
            variant="outlined"
            value={rejOffr.rejOffrRk}
            onChange={(e) => handleRejOffrChange(e, 'rejOffrRk')}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            value={rejOffr.rejOffrName}
            onChange={(e) => handleRejOffrChange(e, 'rejOffrName')}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Appt"
            variant="outlined"
            value={rejOffr.rejOffrAppt}
            onChange={(e) => handleRejOffrChange(e, 'rejOffrAppt')}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseRejectDialog} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleReject(formData[0])} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Forward Dialog  ---------------------------------------------------------------------- */}
      <Dialog open={showFwdDialog} onClose={() => setShowFwdDialog(false)}>
        <DialogTitle>Kindly Provide The Following Details</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Rank"
            variant="outlined"
            value={recomOffr.recomOffrRk}
            onChange={(e) => handleRecomOffrChange(e, 'recomOffrRk')}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            value={recomOffr.recomOffrName}
            onChange={(e) => handleRecomOffrChange(e, 'recomOffrName')}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Appt"
            variant="outlined"
            value={recomOffr.recomOffrAppt}
            onChange={(e) => handleRecomOffrChange(e, 'recomOffrAppt')}
            margin="normal"
          />
          <TextField
            select
            fullWidth
            label="'R' & Fwd the Appln To?"
            variant="outlined"
            value={selectedFormation}
            onChange={(e) => setSelectedFormation(e.target.value)}
            margin="normal"
          >
            <MenuItem value="59INFDIV">59INFDIV</MenuItem>
            <MenuItem value="17CORPS">17CORPS</MenuItem>
            <MenuItem value="122INFBDE">122INFBDE</MenuItem>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowFwdDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleR_and_Fwd} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Sanction Dialog ---------------------------------------------------------------------- */}
      <Dialog open={showSanctionDialog} onClose={() => setShowSanctionDialog(false)}>
        <DialogTitle>Kindly Provide The Following Details:</DialogTitle>
        <DialogContent>
          {/* ... (previous JSX) */}
          <TextField
            fullWidth
            label="Rank"
            variant="outlined"
            value={sancOffr.sancOffrRk}
            onChange={(e) => handleSancOffrChange(e, 'sancOffrRk')}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            value={sancOffr.sancOffrName}
            onChange={(e) => handleSancOffrChange(e, 'sancOffrName')}
            margin="normal"
          />
          <TextField
            fullWidth
            label="Appt"
            variant="outlined"
            value={sancOffr.sancOffrAppt}
            onChange={(e) => handleSancOffrChange(e, 'sancOffrAppt')}
            margin="normal"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSanctionDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleSanction(formData[0])} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Message Dialog */}
      <Dialog open={showSuccessMessage} onClose={handleSuccessMessageClose}>
        {/* <DialogTitle>Success!</DialogTitle> */}
        <DialogContent>
          <Typography variant="h6" style={{ textAlign: 'center' }}>
            Success!
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleSuccessMessageClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default InboxDetails;


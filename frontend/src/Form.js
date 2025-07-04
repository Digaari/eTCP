import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from './UserContext';
import { Container, TextField, Button, Select, MenuItem, InputLabel, FormControl, FormControlLabel, AppBar, Checkbox, Grid, Toolbar, Typography, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import axios from 'axios';
import logoLeft from './sigsLogo.png';
import logoRight from './divLogo.png';

function Forms() {
  const navigate = useNavigate();
  const { userData } = useContext(UserContext);
  const initialFormState = {
    UID: userData.username,
    sanctionAuth: '59 INF DIV',
    movType: 'MISC',
    vehBA: '12CD918001M',
    vehCL: 'CL I',
    vehType: 'ALS',
    dutyStnFrom: 'BARACKPORE',
    dutyStnTo: 'PANAGARH',
    dtFrom: '',
    dtTo: '',
    oneWayDist: 60,
    numTrips: 1,
    PUTO: '',
    yNoRail: 'Not Avail',
    fullVehLd: false,
    movRef: 'GBR/23/12/2023/AMN',
    vehDetailsList: [],
    vehTypeList: [],
    vehClassList: [],
  };

  let sanctionAuthOptions = [
    "59 ARTY BDE",
    "122 INF BDE",
    "124 INF BDE",
    "131 INF BDE",
    "23 INF DIV",
    "59 INF DIV",
    "17 CORPS",
    // Add more options as needed
  ];

  // Additional conditions for Sanctioning Authority options based on userdata.username
  if (["59IDSR", "659 EMEBN", "17ENGR", "559ASCBN", "59DOU", "359FDHOSP", "459FDHOSP", "59PROUNIT", "HQ59CAMP", "59ARTYBDE", "131INFBDE", "122INFBDE", "124INFBDE"].includes(userData.username)) {
    sanctionAuthOptions = ["59 INF DIV", "17 CORPS"];
  } else if (["17PROUNIT", "17CSR", "7017EMEBN", "17CISU", "HQ17CAMP", "59INFDIV", "23INFDIV"].includes(userData.username)) {
    sanctionAuthOptions = ["17 CORPS"];
  } else if (["90FD", "262FD", "281FD", "290MED", "59ABSC"].includes(userData.username)) {
    sanctionAuthOptions = ["59 ARTY BDE", "59 INF DIV", "17 CORPS"];
  } else if (["4/8GR", "21GNDR", "13SIKH", "131IBSC"].includes(userData.username)) {
    sanctionAuthOptions = ["131 INF BDE", "59 INF DIV", "17 CORPS"];
  } else if (["11RAJRIF", "1BIHAR", "2/5GR", "124IBSC"].includes(userData.username)) {
    sanctionAuthOptions = ["124 INF BDE", "59 INF DIV", "17 CORPS"];
  } else if (["16ASSAM", "2RAJRIF", "15BIHAR", "2SIKH", "122IBSC"].includes(userData.username)) {
    sanctionAuthOptions = ["122 INF BDE", "59 INF DIV", "17 CORPS"];
  }

  const vehicleOptions = ["2.5 Ton", "5/7.5 Ton ALS", "ALS", "AMB", "Army Bus", "AV-15", "CIAZ", "FAT", "Jeep", "JEEP COMPASS", "JCB", "Kraz", "LRV", "Maruti Gypsy", "Motorcycle", "MPV", "OTHERS", "Safari Storme", "SCORPIO", "Staff Car", "SX4", "Swift Dzire", "Tank Tptr", "TATRA", "Tata Sumo", "Water Bowser"];

  const [form, setFormData] = useState(initialFormState);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [shortAnswers, setShortAnswers] = useState({
    inOffrRk: '',
    inOffrName: '',
    inOffrAppt: '',
  });

  const handleInputChange = (e) => {
    setFormData({ ...form, [e.target.name]: e.target.value });
  };

  const handleCheckboxChange = (e) => {
    setFormData({ ...form, [e.target.name]: e.target.checked });
  };

  const handleAddEntry = () => {
    if (
      form.vehBA.trim() !== '' &&
      form.vehType.trim() !== '' &&
      form.vehCL.trim() !== ''
    ) {
      setFormData({
        ...form,
        vehDetailsList: [...form.vehDetailsList, form.vehBA],
        vehTypeList: [...form.vehTypeList, form.vehType],
        vehClassList: [...form.vehClassList, form.vehCL],
        vehBA: '',
        vehType: '',
        vehCL: '',
      });
    }
  };

  const handleDeleteEntry = (index) => {
    const updatedVehDetailsList = [...form.vehDetailsList];
    const updatedVehTypeList = [...form.vehTypeList];
    const updatedVehClassList = [...form.vehClassList];
  
    updatedVehDetailsList.splice(index, 1);
    updatedVehTypeList.splice(index, 1);
    updatedVehClassList.splice(index, 1);
  
    setFormData({
      ...form,
      vehDetailsList: updatedVehDetailsList,
      vehTypeList: updatedVehTypeList,
      vehClassList: updatedVehClassList,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if any field is empty
    for (const key in form) {
      if (
        form[key] === '' &&
        key !== 'vehDetailsList' &&
        key !== 'vehTypeList' &&
        key !== 'vehClassList' &&
        key !== 'vehBA' &&
        key !== 'vehType' &&
        key !== 'vehCL'
      ) {
        // Display an error message
        setErrorMessage('Please fill in all fields.');
        return;
      }
    }



    // Open the dialog for short answers
    setDialogOpen(true);

  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
  
    // Generate the filename based on the provided format
    const timestamp = new Date().getTime();
    const generatedFilename = `${userData.username}_${timestamp}`;
    setFilename(generatedFilename);
  };
  
  const handleUpload = async () => {
    if (file) {
      const formData = new FormData();
      formData.append('pdf', file, filename);
      console.log('FILENAME:',filename)
  
      try {
        // Send a POST request to the server endpoint /uploadedImage
        await axios.post('http://localhost:5000/uploadedPDF', formData);
        console.log('HIII:',formData)
  
        // Optionally, you can update the state or show a success message
        console.log('PDF uploaded successfully!');
      } catch (error) {
        // Handle errors if any
        console.error('Error uploading pdf:', error);
      }
    } else {
      // Handle the case when no file is selected
      console.error('No file selected for upload.');
    }
  };
  

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleShortAnswerChange = (e) => {
    setShortAnswers({ ...shortAnswers, [e.target.name]: e.target.value });
  };

  const handleShortAnswerSubmit = async () => {
    // Check if any short answer field is empty
    for (const key in shortAnswers) {
      if (shortAnswers[key].trim() === '') {
        // Display an error message
        setErrorMessage('Please fill in all short answer fields.');
        return;
      }
    }

    // Close the dialog
    setDialogOpen(false);

    // Append short answers to the form data
    const payload = {
      ...form,
      ...shortAnswers,
      filename: filename,
    };

    console.log('Hey Payload!',payload)

    // Send form data to the backend
    await axios.post('http://localhost:5000/submitForm', payload);

    await handleUpload();

    // Set formSubmitted to true to hide the form
    setFormSubmitted(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');// Clear the authentication status in local storage
    navigate('/login');// Navigate to the login page
  };

  return (
      <div>
      <AppBar position="static" style={{ background: 'linear-gradient(to right, #1bb2ff, #03045e, #006f57)' }}>
        <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginRight: 'auto' }}>
            <img src={logoLeft} alt="Left Logo" style={{ height: '50px', marginRight: '20px' }} />
            {/* Center the Typography element horizontally */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                TCP AUTOMATION SOFTWARE
              </Typography>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Button color="inherit" component={Link} to="/home">Home</Button>
            <Button color="inherit" onClick={handleLogout} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span>Logout</span>
              <span style={{ fontSize: '80%', marginBottom: '5px' }}>{userData.username}</span>
          </Button>
          </div>
          <img src={logoRight} alt="Right Logo" style={{ height: '50px', marginLeft: '20px' }} />
        </Toolbar>
      </AppBar>

      <Container maxWidth="md" style={{ marginTop: '20px' }}>


    {formSubmitted ? (
        <div style={{ textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            TCP Requisition has been Successfuly Submitted!
          </Typography>
        </div>
      ) : (


      <form onSubmit={handleSubmit}>

        <AppBar position="static" style={{ background: 'linear-gradient(to right, #1bb2ff, #03045e, #006f57)', margin: '20px 0' }}>
          <Toolbar>
            <Typography variant="h6" style={{ textAlign: 'center', width: '100%', fontWeight: 'bold' }}>
            Create a New TCP Appln
            </Typography>
          </Toolbar>
        </AppBar>

        {/* Sanctioning Authority */}
        <FormControl fullWidth margin="normal">
        <InputLabel htmlFor="sanctioning-authority">Sanctioning Authority</InputLabel>
        <Select
          id="sanctioning-authority"
          name="sanctionAuth"
          value={form.sanctionAuth}
          onChange={handleInputChange}
          fullWidth
        >
          {sanctionAuthOptions.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>


        {/* Type Of Move */}
        <FormControl fullWidth margin="normal">
          <InputLabel htmlFor="type-of-move">Type Of Move</InputLabel>
          <Select
            id="type-of-move"
            name="movType"
            value={form.movType}
            onChange={handleInputChange}
            fullWidth
          >
            <MenuItem value="TRG">TRG</MenuItem>
            <MenuItem value="OPS">OPS</MenuItem>
            <MenuItem value="ADM">ADM</MenuItem>
            <MenuItem value="MISC">MISC</MenuItem>
            <MenuItem value="SI COMN">SI COMN</MenuItem>
            {/* Add more options as needed */}
          </Select>
        </FormControl>


          <Grid container spacing={2}>
            <Grid item xs={4}>
              <TextField
                label="Vehicle BA Num"
                name="vehBA"
                value={form.vehBA}
                onChange={handleInputChange}
                fullWidth
                margin="normal"
              />
            </Grid>
            <Grid item xs={4}>

              {/* Veh Type */}
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="veh-type">Veh Type</InputLabel>
                <Select
                  id="veh-type"
                  name="vehType"
                  value={form.vehType}
                  onChange={handleInputChange}
                  fullWidth
                >
                  {vehicleOptions.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

            </Grid>
            <Grid item xs={4}>
              {/* Veh Class */}
              <FormControl fullWidth margin="normal">
                <InputLabel htmlFor="veh-class">Veh Class</InputLabel>
                <Select
                  id="veh-class"
                  name="vehCL"
                  value={form.vehCL}
                  onChange={handleInputChange}
                  fullWidth
                >
                  <MenuItem value="CL I">CL I</MenuItem>
                  <MenuItem value="CL II">CL II</MenuItem>
                  <MenuItem value="CL III">CL III</MenuItem>
                  <MenuItem value="CL IV">CL IV</MenuItem>
                  <MenuItem value="CL V">CL V</MenuItem>
                  <MenuItem value="CL V">CL VI</MenuItem>
                  {/* Add more options as needed */}
                </Select>
              </FormControl>
            </Grid>
          </Grid>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
            <Button onClick={handleAddEntry} variant="outlined" color="error">
              Add Veh
            </Button>
          </div>

          <ul>
            {form.vehDetailsList.map((details, index) => (
              <li key={index}>
                {details} - {form.vehTypeList[index]} - {form.vehClassList[index]}
                <Button
                  color="error"
                  style={{ marginLeft: '10px' }}
                  onClick={() => handleDeleteEntry(index)}
                >
                  &#10006;
                </Button>
              </li>
            ))}
          </ul>




        <TextField
          label="Duty Station From"
          name="dutyStnFrom"
          value={form.dutyStnFrom}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Duty Station To"
          name="dutyStnTo"
          value={form.dutyStnTo}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Date From"
              name="dtFrom"
              type="date"
              value={form.dtFrom}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Date To"
              name="dtTo"
              type="date"
              value={form.dtTo}
              onChange={handleInputChange}
              fullWidth
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Grid>
        </Grid>


        <Grid item xs={6}>
            <TextField
            label="Distance One Way in kms"
            name="oneWayDist"
            type="number"
            value={form.oneWayDist}
            onChange={handleInputChange}
            fullWidth
            margin="normal"
            />
        </Grid>


        <TextField
          label="Number of Trips"
          name="numTrips"
          type="number"
          value={form.numTrips}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />

        <TextField
          label="Reason why Rail not Used"
          name="yNoRail"
          value={form.yNoRail}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />
        <TextField
          label="Auth for Mov Letter Ref"
          name="movRef"
          value={form.movRef}
          onChange={handleInputChange}
          fullWidth
          margin="normal"
        />

        <input type="file" onChange={handleFileChange} />
        <button type="button" onClick={handleUpload}>Upload PDF</button>



        <FormControl fullWidth margin="normal">
          <FormControlLabel
            control={
              <Checkbox
                checked={form.fullVehLd}
                onChange={handleCheckboxChange}
                name="fullVehLd"
                color="primary"
              />
            }
            label="Whether The Stores Constitute a Full Veh Load?"
          />
        </FormControl>

        <Grid item xs={4}>
              {/*Put Up To */}
              <FormControl fullWidth margin="normal">
    <InputLabel htmlFor="fwd-to">Put Up Appln To</InputLabel>
    <Select
      id="fwd-to"
      name="PUTO"
      value={form.PUTO}
      onChange={handleInputChange}
      fullWidth
    >
      {(() => {
        const specificUsernames = [
          "59IDSR",
          "659EMEBN",
          "17ENGR",
          "559ASCBN",
          "59DOU",
          "359FDHOSP",
          "459FDHOSP",
          "59PROUNIT",
          "HQ59CAMP",
          "59ARTYBDE",
          "131INFBDE",
          "122INFBDE",
          "124INFBDE",
        ];

        if (specificUsernames.includes(userData.username)) {
          return (
            <MenuItem value="59INFDIV">59 INFDIV</MenuItem>
          );
        } else if (
          [
            "17PROUNIT",
            "17CSR",
            "7017EMEBN",
            "17CISU",
            "HQ17CAMP",
            "59INFDIV",
            "23INFDIV",
          ].includes(userData.username)
        ) {
          return (
            <MenuItem value="17CORPS">17 CORPS</MenuItem>
          );
        } else if (
          ["90FD", "262FD", "281FD", "290MED", "59ABSC"].includes(userData.username)
        ) {
          return (
            <MenuItem value="59ARTYBDE">59 ARTY BDE</MenuItem>
          );
        } else if (
          ["4/8GR", "21GNDR", "13SIKH", "131IBSC"].includes(userData.username)
        ) {
          return (
            <MenuItem value="131INFBDE">131 INF BDE</MenuItem>
          );
        } else if (
          ["11RAJRIF", "1BIHAR", "2/5GR", "124IBSC"].includes(userData.username)
        ) {
          return (
            <MenuItem value="124INFBDE">124 INF BDE</MenuItem>
          );
        } else if (
          ["16ASSAM", "2RAJRIF", "15BIHAR", "2SIKH", "122IBSC"].includes(userData.username)
        ) {
          return (
            <MenuItem value="122INFBDE">122 INF BDE</MenuItem>
          );
        } else {
          return (
            <>
              <MenuItem value="59ARTYBDE">59 ARTY BDE</MenuItem>
              <MenuItem value="122INFBDE">122 INF BDE</MenuItem>
              <MenuItem value="124INFBDE">124 INF BDE</MenuItem>
              <MenuItem value="131INFBDE">131 INF BDE</MenuItem>
              <MenuItem value="59INFDIV">59 INF DIV</MenuItem>
              <MenuItem value="17CORPS">17 CORPS</MenuItem>
            </>
          );
        }
      })()}
    </Select>
  </FormControl>
        </Grid>   


        <div style={{ textAlign: 'center', marginTop: '20px'  }}>
        {errorMessage && (
              <Typography variant="body2" color="error" gutterBottom>
                {errorMessage}
              </Typography>
            )}
        <Button type="submit" variant="contained" color="error" style={{ marginBottom: '100px' }}>
            INITIATE TCP APPLN
        </Button>
        </div>

      {/* Short Answer Dialog */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose}>
              <DialogTitle>Kindly Provide The Fwg Details:</DialogTitle>
              <DialogContent>
                <TextField
                  label="Your Rank"
                  name="inOffrRk"
                  value={shortAnswers.inOffrRk}
                  onChange={handleShortAnswerChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Your Name"
                  name="inOffrName"
                  value={shortAnswers.inOffrName}
                  onChange={handleShortAnswerChange}
                  fullWidth
                  margin="normal"
                />
                <TextField
                  label="Your Appt"
                  name="inOffrAppt"
                  value={shortAnswers.inOffrAppt}
                  onChange={handleShortAnswerChange}
                  fullWidth
                  margin="normal"
                />
              </DialogContent>
              <DialogActions>
                <Button onClick={handleDialogClose} color="primary">
                  Cancel
                </Button>
                <Button onClick={handleShortAnswerSubmit} color="primary">
                  Submit
                </Button>
              </DialogActions>
            </Dialog>
          </form>
        )}
      </Container>
    </div>
  );
}

export default Forms;



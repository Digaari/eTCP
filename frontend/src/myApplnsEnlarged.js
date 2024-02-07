import React, { useContext, useEffect, useState } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Table,
  TableContainer,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper,
  Button,
} from '@mui/material';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import UserContext from './UserContext';
import { useNavigate } from 'react-router-dom';

const ApplnEnlarged = () => {
  const { userData } = useContext(UserContext);
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState([]);

  const printStyles = `
  @media print {
    body {
      background: linear-gradient(45deg, rgba(255, 255, 255, 0.1) 25%, transparent 25%, transparent 50%, rgba(255, 255, 255, 0.1) 50%, rgba(255, 255, 255, 0.1) 75%, transparent 75%, transparent);
      background-size: 8px 8px;
      color: rgba(0, 0, 0, 0.2); /* Change the color and opacity of the watermark text */
      font-size: 100px; /* Adjust the font size of the watermark */
      font-weight: bold; /* Make the watermark text bolder */
      position: relative;
    }

    .watermark:before {
      content: "e-TCP";
      position: fixed;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%) rotate(-45deg);
      transform-origin: left bottom;
      white-space: nowrap;
      z-index: 1000; /* Ensure it's above other elements */
    }

    /* Ensure the watermark is not applied to the AppBar and other elements */
    ${Container.styledComponent} {
      position: relative;
    }
  }
`;


  useEffect(() => {
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = printStyles;
    document.head.appendChild(styleSheet);

    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/home/${id}`);
        setFormData(response.data);
      } catch (error) {
        console.error('Error fetching form data:', error.message);
      }
    };

    fetchFormData();
  }, [id]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
  
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are zero-based
    const year = date.getFullYear();
  
    const formattedDate = `${day}-${month}-${year}`;
    return formattedDate;
  };
  

  const handlePrint = () => {
    const printButton = document.getElementById('printButton');
    printButton.style.display = 'none'; // Hide the button before printing
    window.print();
    printButton.style.display = 'block'; // Restore the button after printing
  };

  return (
    <div>
      <Container className="watermark" style={{ marginTop: '0', padding: '0', paddingBottom: '500px' }}>
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
             <TableContainer component={Paper}>
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
                    <TableCell>{userData.username}</TableCell>
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
                    <TableCell>{data.movRef}</TableCell>
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

                {/* Sanctioning Auth */}
                <TableRow>
                    <TableCell colSpan={3} style={{ textAlign: 'center' }}>
                    <div style={{ fontWeight: 'bold', textDecoration: 'underline', color: 'black' }}>
                        APPROVED
                    </div>
                    </TableCell>
                </TableRow>

                <TableRow>
                <TableCell></TableCell>
                    <TableCell>
                    <div style={{ fontWeight: 'bold', color: 'black' }}>Station: c/o 99 APO</div>
                    <div style={{ fontWeight: 'bold', color: 'black' }}>Dated: {formatDate(data.timeDt)}</div>
                    </TableCell>
                    <TableCell style={{ pageBreakInside: 'avoid' }}>
                    <br />
                    <div style={{ color: 'blue' }}>sd/-xxx</div>
                    <div style={{ color: 'blue' }}>({data.sancOffrName})</div>
                    {/* <hr style={{ border: '1px solid black', width: '100%' }} /> */}
                    <div style={{ fontWeight: 'bold', color: 'purple' }}>{data.sancOffrRk}</div>
                    <div style={{ fontWeight: 'bold', color: 'purple' }}>{data.sancOffrAppt}</div>
                    <div style={{ fontWeight: 'bold', color: 'purple' }}>{data.sBy}</div>
                    </TableCell>
                </TableRow>



                </TableBody>
              </Table>
            </TableContainer>
          </div>
        ))}

        <Button
            variant="contained"
            color="primary"
            onClick={handlePrint}
            id="printButton"
            style={{ marginLeft: 'auto', marginRight: 'auto', display: 'block', marginTop: '20px', textAlign: 'center' }}
          >
            Print
          </Button>
      </Container>
    </div>
  );
};

export default ApplnEnlarged;


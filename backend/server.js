const express = require('express');
const cors = require('cors');
const mysql = require('mysql2/promise');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');


const app = express();
const port = 5000;
const jwt = require('jsonwebtoken');
const secretKey = '#$den#!@jief#@de@#';

app.use('/backend/authletter', express.static(path.join(__dirname, 'backend/authletter')));
app.use(cors());
app.use(express.json());
app.use(cookieParser());

const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '12345678',
  database: 'etcp_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});



//   NEW USER REGISTRATION ---------------------------------------------------------------------------------------------------------------
app.post('/registerUser', async (req, res) => {
    try {
      const {
        UID,
        Fmn,
        password,
      } = req.body;
  
    //   // Get the current date and time in the required format
    //   const now = new Date();
    //   const timeDate = now.toISOString().slice(0, 19).replace('T', ' ');
  
      // Insert data into the Users table
      await pool.execute(
        'INSERT IGNORE INTO Users (UID, Fmn, password) VALUES ( ?, ?, ?)',
        [UID, Fmn, password]
      );
  
      res.status(200).json({ success: 'User registered successfully.' });
    } catch (error) {
      if (error.code === 'ER_DUP_ENTRY') {
        // Handle the case where a duplicate entry exists
        res.status(400).json({ error: 'User already registered.', status: 400 });
      } else {
        console.error('Error registering user:', error.message);
        res.status(500).json({ error: 'Failed to register user.', status: 500 });
      }
    }
  });
  
// ---------------------------------------------------------------------------------------------------------------

app.get('/registerSuccess', async (req, res) => {
  try {
    const { Fmn } = req.query;

    // Find the user with the provided Fmn in the Users table
    const [userData] = await pool.execute('SELECT UID, Password FROM Users WHERE Fmn = ?', [Fmn]);

    if (!userData.length) {
      return res.status(404).json({ error: 'User not found' });
    }

    const user = userData[0];

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user data:', error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// ---------------------------------------------------------------------------------------------------------------

// LOGIN ----------------------------------------------------------------------------------------------------
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const [results] = await pool.execute('SELECT * FROM Users WHERE UID = ? AND Password = ?', [username, password]);

    // console.log(results);
    // console.log(req.body.username);

    if (results.length > 0) {
      const { UID, ...others } = results[0];
      const token = jwt.sign({ username: UID }, secretKey);
      res.cookie("Uname", username);    
      res.send({ token });
    } else {
      res.status(401).json({ error: 'Invalid username or password.', status: 401 });
    }
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ error: 'Failed to authenticate user.', status: 500 });
  }
});
// ---------------------------------------------------------------------------------------------------------------



// NEW APPLN ---------------------------------------------------------------------------------------------------------------
app.post('/submitForm', async (req, res) => {
  try {
      const {
          UID, movType, dutyStnFrom, dutyStnTo, dtFrom, dtTo, oneWayDist, numTrips, yNoRail, fullVehLd, movRef, PUTO, sanctionAuth, vehDetailsList, vehClassList, vehTypeList, inOffrRk, inOffrName, inOffrAppt, filename,
      } = req.body;

      // Convert lists to strings
      const vehBA = vehDetailsList.join(',');
      const vehCL = vehClassList.join(',');
      const vehType = vehTypeList.join(',');

      const fwdTo = `${PUTO.replace(/\s/g, '')}`.toUpperCase();
      const SAuth = `${sanctionAuth.replace(/\s/g, '')}`.toUpperCase();

      // Combine the location and filename to get the full path
      const authLetter = `${filename}`;

      console.log('Executing database query');

      // Step 1: Insert data into the appln table
      const [applnsTableUpdate] = await pool.execute(
          'INSERT INTO appln (UID, movType, vehBA, vehType, vehCL, dutyStnFrom, dutyStnTo, dtFrom, dtTo, oneWayDist, numTrips, yNoRail, fullVehLd, movRef, fwdTo, SAuth, inOffrRk, inOffrName, inOffrAppt, authLetter) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
              UID, movType, vehBA, vehType, vehCL, dutyStnFrom, dutyStnTo, dtFrom, dtTo, oneWayDist, numTrips, yNoRail, fullVehLd, movRef, fwdTo, SAuth, inOffrRk, inOffrName, inOffrAppt, authLetter
          ]
      );

      // Step 2: Retrieve the ApplnID generated during the insertion
      const applnId = applnsTableUpdate.insertId;

      // Step 3: Insert data into the reviewForms table using the retrieved ApplnID
      const [reviewFormUpdate] = await pool.execute(
          'INSERT INTO reviewForms (ApplnID, UID, movType, vehBA, vehType, vehCL, dutyStnFrom, dutyStnTo, dtFrom, dtTo, oneWayDist, numTrips, yNoRail, fullVehLd, movRef, fwdTo, SAuth, applnStatus, inOffrRk, inOffrName, inOffrAppt, authLetter) VALUES ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
          [
              applnId, UID, movType, vehBA, vehType, vehCL, dutyStnFrom, dutyStnTo, dtFrom, dtTo, oneWayDist, numTrips, yNoRail, fullVehLd, movRef, fwdTo, SAuth, 0, inOffrRk, inOffrName, inOffrAppt, authLetter
          ]
      );

      console.log('Query executed successfully', applnsTableUpdate, reviewFormUpdate);
      res.status(200).json({ success: 'Form submitted successfully.' });
  } catch (error) {
      console.error('Error submitting form:', error.message);
      res.status(500).json({ error: 'Failed to submit form.' });
  }
});
// ---------------------------------------------------------------------------------------------------------------

// SAVE IMAGE ON DISK---------------------------------------------------------------------------------------------------------------

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Specify the destination folder where the uploaded images will be stored
    cb(null, 'D:/Projects/eTCP/backend/authletter');
  },
  filename: function (req, file, cb) {
    // Use the original filename provided by the client
    // console.log(file.filename)
    const fileName = `${file.originalname.split('.')[0]}.pdf`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

app.post('/uploadedPDF', upload.single('pdf'), (req, res) => {
  // Multer middleware handles the file upload, and req.file contains the file details

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  // You can perform additional logic here, such as saving the file path to a database

  res.status(200).json({ message: 'PDF uploaded successfully' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// --------------------------------------------------------------------------------------------------------------


app.get('/downloadpdf', (req, res) => {
  const { filename } = req.query;
  // console.log(filename)

  if (!filename) {
    return res.status(400).json({ error: 'Missing filename parameter.' });
  }

  const filePath = path.join(__dirname, '/authletter', filename + '.pdf');
  // console.log(filePath)

  res.sendFile(filePath, (err) => {
    if (err) {
      console.error('Error sending file:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
});

// sanctioned ---------------------------------------------------------------------------------------------------------------
app.get('/myapplns', async (req, res) => {
  try {
    // Extract the username from the request headers
    const Uname = req.headers.uname;
    const [rows] = await pool.execute('SELECT * FROM reviewForms WHERE UID = ? ORDER BY timeDt DESC', [Uname]);

    // Send the fetched data as a JSON response
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching data from the database:', error.message);
    res.status(500).json({ error: 'Failed to fetch data from the database.' });
  }
});
// ---------------------------------------------------------------------------------------------------------------

//  enlarged View ---------------------------------------------------------------------------------------------------------------
app.get('/home/:id', async (req, res) => {
  try {
  // const xFormIdHeader = req.headers.formid;
  const idFromParams = req.params.id;
  // console.log('Form ID from Header:', xFormIdHeader);
  // console.log('Form ID from Params:', idFromParams);

  const [rows] = await pool.execute('SELECT * FROM reviewForms WHERE ApplnID = ?', [idFromParams]);
  // console.log(rows)
  // const [rows] = await pool.execute('SELECT * FROM appln');
  res.status(200).json(rows);
  // const emailDetails = rows[0]; // Assuming the query returns a single email
  // res.json(emailDetails);
} catch (error) {
  console.error('Error fetching email details:', error.message);
  res.status(500).json({ error: 'Failed to fetch email details.' });
}
});
// ---------------------------------------------------------------------------------------------------------------




// approver's List of Cards as INBOX ---------------------------------------------------------------------------------------------------------------
app.get('/inbox', async (req, res) => {
  try {
    const Uname = req.headers.uname;
    const [rows] = await pool.execute(`SELECT * FROM reviewForms WHERE fwdTo = ? AND (applnStatus = 0 OR applnStatus = 1) ORDER BY timeDt DESC`, [Uname]);

    res.status(200).json(rows);
  } catch (error) {
    console.error('Error fetching form data:', error.message);
    res.status(500).json({ error: 'Failed to fetch form data.' });
  }
});


// ---------------------------------------------------------------------------------------------------------------


// inbox enlarged ---------------------------------------------------------------------------------------------------------------
app.get('/inbox/:id', async (req, res) => {
    try {
    // const xFormIdHeader = req.headers.formid;
    const idFromParams = req.params.id;
    // console.log('Form ID from Header:', xFormIdHeader);
    // console.log('Form ID from Params:', idFromParams);

    const [rows] = await pool.execute('SELECT * FROM reviewForms WHERE ApplnID = ?', [idFromParams]);
    // console.log(rows)
    // const [rows] = await pool.execute('SELECT * FROM appln');
    res.status(200).json(rows);
    // const emailDetails = rows[0]; // Assuming the query returns a single email
    // res.json(emailDetails);
  } catch (error) {
    console.error('Error fetching email details:', error.message);
    res.status(500).json({ error: 'Failed to fetch email details.' });
  }
});
// ---------------------------------------------------------------------------------------------------------------






// Endpoint to insert data into the reviewForms and update Recommended ------------------------------------------------------------------------------------------------------------------------
app.post('/recommendForm', async (req, res) => {
  try {
    const { ApplnID, newFwdTo, rBy, applnStatus, recomOffrRk, recomOffrName, recomOffrAppt } = req.body;

    // Update the reviewForms table with newFwdTo and rBy values based on ApplnID
    const [updateRows] = await pool.execute(
      'UPDATE reviewForms SET fwdTo = ?, rBy = ?, applnStatus = ?, recomOffrRk = ?, recomOffrName = ?, recomOffrAppt = ?, rTimeDt = CURRENT_TIMESTAMP WHERE ApplnID = ?',
      [newFwdTo, rBy, applnStatus, recomOffrRk, recomOffrName, recomOffrAppt, ApplnID,]
    );

    res.status(200).json({ success: true, message: 'Data inserted into reviewForm and Updated Recommended.' });
  } catch (error) {
    console.error('Error inserting data into reviewForm table:', error.message);
    res.status(500).json({ error: 'Failed to insert data into reviewForm table.' });
  }
});


// Endpoint to insert data into the reviewForms and update Sanction ------------------------------------------------------------------------------------------------------------------------
app.post('/sanctionForm', async (req, res) => {
  try {
    const { ApplnID, sBy, applnStatus, sancOffrRk, sancOffrName, sancOffrAppt } = req.body;

    // Update the reviewForms table with newFwdTo and rBy values based on ApplnID
    const [updateRows] = await pool.execute(
      'UPDATE reviewForms SET sBy = ?, applnStatus = ?, sancOffrRk = ?, sancOffrName = ?, sancOffrAppt = ?, sTimeDt = CURRENT_TIMESTAMP WHERE ApplnID = ?',
      [sBy, applnStatus, sancOffrRk, sancOffrName, sancOffrAppt, ApplnID]
    );

    res.status(200).json({ success: true, message: 'Data inserted into reviewForm and Updated Sanction.' });
  } catch (error) {
    console.error('Error inserting data into reviewForm table:', error.message);
    res.status(500).json({ error: 'Failed to insert data into reviewForm table.' });
  }
});

// Endpoint to insert data into the reviewForms and update Reject ------------------------------------------------------------------------------------------------------------------------
app.post('/rejectedForm', async (req, res) => {
  try {
    const { ApplnID, rejBy, rejReason, applnStatus, rejOffrRk, rejOffrName, rejOffrAppt } = req.body;

    // Update the reviewForms table with rejBy, rejTimeDt, and rejReason values based on ApplnID
    const [updateRows] = await pool.execute(
      'UPDATE reviewForms SET rejBy = ?, applnStatus = ?, rejOffrRk = ?, rejOffrName = ?, rejOffrAppt = ?, rejTimeDt = CURRENT_TIMESTAMP, rejReason = ? WHERE ApplnID = ?',
      [rejBy, applnStatus, rejOffrRk, rejOffrName, rejOffrAppt, rejReason, ApplnID]
    );

    res.status(200).json({ success: true, message: 'Data updated in reviewForms table for Rejected.' });
  } catch (error) {
    console.error('Error updating data in reviewForms table:', error.message);
    res.status(500).json({ error: 'Failed to update data in reviewForms table.' });
  }
});


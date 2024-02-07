import React, { useState, useEffect } from 'react';
import {
  Container,
  AppBar,
  Toolbar,
  Typography,
  Tabs,
  Tab,
  Box,
} from '@mui/material';
import SApplns from './sanctionedApplns';
import RejectedApplns from './RejectedApplns';
import PendingApplns from './underProcessApplns';

const TabPanel = ({ children, value, index }) => (
  <div hidden={value !== index}>
    {value === index && <Box>{children}</Box>}
  </div>
);

const Dashboard = () => {
  const [tabValue, setTabValue] = useState(0);

  const handleChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    // Fetch initial data or perform any other initialization
  }, []);

  return (
    <Container maxWidth="xlg">
      <Tabs value={tabValue} onChange={handleChange} centered>
        <Tab label="Sanctioned Applns" />
        <Tab label="Rejected Applns" />
        <Tab label="Pending Applns" />
      </Tabs>

      <TabPanel value={tabValue} index={0}>
        <SApplns />
      </TabPanel>
      <TabPanel value={tabValue} index={1}>
        <RejectedApplns />
      </TabPanel>
      <TabPanel value={tabValue} index={2}>
        <PendingApplns />
      </TabPanel>
    </Container>
  );
};

export default Dashboard;
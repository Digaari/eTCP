// src/App.js
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Forms from './Form';
import SApplns from './sanctionedApplns';
import UnderProcessApplns from './underProcessApplns';
import AllApplns from './allApplns';
import ImageDisplay from './TempHome';
import RegistrationForm from './registrationForm';
import RejectedApplns from './RejectedApplns';
import LandingPage from './landingPage';
import Dashboard from './dashboard';
import LoginForm from './login';
import Inbox from './inbox';
import InboxDetails from './inboxDtls';
import ApplnEnlarged from './myApplnsEnlarged';
import UserContext from './UserContext';

function App() {
  // Initialize state for user data
  const [userData, setUserData] = useState({ username: '' });

  return (
    <Router>
      <UserContext.Provider value={{ userData, setUserData }}>
        <Routes>
          <Route path="/form" element={<Forms />} />
          <Route path="/sanctioned" element={<SApplns />} />
          <Route path="/rejected" element={<RejectedApplns />} />
          <Route path="/underprocess" element={<UnderProcessApplns />} />
          <Route path="/myapplns" element={<AllApplns />} />
          <Route path="/register" element={<RegistrationForm />} />
          <Route path="/home" element={<LandingPage />} />
          <Route path="/dash" element={<Dashboard />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/inbox" element={<Inbox />} />
          <Route path="/inbox/:id" element={<InboxDetails />} />
          <Route path="/home/:id" element={<ApplnEnlarged />} />

          {/* Default route (if none of the above matches) */}
          <Route path="/login" element={<ImageDisplay />} />
        </Routes>
      </UserContext.Provider>
    </Router>
  );
}

export default App;

import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import ProfilesPage from './pages/ProfilesPage';
import { getProfileId } from './services/utils';
import JobsPage from './pages/JobsPage';
import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import NavBar from './components/NavBar';
import { Box } from '@mui/material';

function App() {
  const location = useLocation();
  const isLoggedIn = !!getProfileId();
  const profileId = getProfileId();

  const navigate = useNavigate();

  useEffect(() => {
    if (!profileId) navigate('/');
  }, [profileId]);

  return (
    <>
      {isLoggedIn && location.pathname !== '/' && <NavBar />}

      <Box sx={{ placeItems: 'center' }}>
        <Routes>
          <Route path="/" element={<ProfilesPage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/jobs/:contractorId" element={<JobsPage />} />
        </Routes>
      </Box>
    </>
  );
}

export default App;

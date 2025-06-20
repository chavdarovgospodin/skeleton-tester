import { useState, useEffect } from 'react';
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
  Box,
  Typography,
} from '@mui/material';
import {
  deleteProfileBalance,
  deleteProfileId,
  setProfileBalance,
  setProfileId,
} from '../services/utils';
import Loading from '../components/Loading';
import { useSnackbar } from '../contexts/SnackBar';
import { useNavigate } from 'react-router-dom';
import { useProfileData } from '../hooks/useProfileData';

const ProfilesPage = () => {
  const { clientProfiles, isLoading } = useProfileData();
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(
    null
  );
  const navigate = useNavigate();

  const { showSuccess } = useSnackbar();

  useEffect(() => {
    deleteProfileId();
    deleteProfileBalance();
  }, []);

  const handleSelect = (event: any) => {
    setSelectedProfileId(Number(event.target.value));
  };

  const handleLogin = () => {
    if (selectedProfileId) {
      const profile = clientProfiles.find(
        (profile) => profile.id === selectedProfileId
      );

      setProfileId(selectedProfileId.toString());
      setProfileBalance(profile?.balance?.toString() || '0');
      showSuccess(
        `Logged in as Profile ID: ${profile?.firstName} ${profile?.lastName}`
      );
      navigate('/home');
    }
  };

  return (
    <Box p={3} mt={8}>
      <Typography gutterBottom variant="h3">
        Select Profile
      </Typography>
      {clientProfiles.length === 0 && !isLoading ? (
        <p>No profiles available</p>
      ) : !isLoading ? (
        <FormControl fullWidth>
          <InputLabel>Select Profile</InputLabel>
          <Select
            value={selectedProfileId || ''}
            onChange={handleSelect}
            label="Select Profile"
          >
            {clientProfiles
              .filter((profile) => profile.type === 'client')
              .map((profile) => (
                <MenuItem key={profile.id} value={profile.id}>
                  {`${profile.firstName} ${profile.lastName} (${profile.profession})`}
                </MenuItem>
              ))}
          </Select>
          <Button
            variant="contained"
            color="primary"
            onClick={handleLogin}
            disabled={!selectedProfileId}
            sx={{ marginTop: '20px' }}
          >
            Login
          </Button>
        </FormControl>
      ) : (
        <Loading />
      )}
    </Box>
  );
};

export default ProfilesPage;

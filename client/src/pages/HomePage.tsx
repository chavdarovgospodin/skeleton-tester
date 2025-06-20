import React, { useState } from 'react';
import {
  Autocomplete,
  TextField,
  Button,
  Typography,
  Paper,
  Box,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useProfileData } from '../hooks/useProfileData';
import Loading from '../components/Loading';
import type { Profile } from '../interfaces/ProfileInterface';

const HomePage: React.FC = () => {
  const { contractorProfiles, isLoading, error } = useProfileData();
  const [selectedContractor, setSelectedContractor] = useState<Profile | null>(
    null
  );

  const navigate = useNavigate();

  if (isLoading) return <Loading />;

  return (
    <Box pt={3} mt={8} minWidth={400}>
      <Typography gutterBottom variant="h4">
        Pay Jobs
      </Typography>
      <Paper style={{ padding: '20px' }}>
        <Typography variant="h6" gutterBottom>
          Pay Jobs for…
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <Autocomplete
          options={contractorProfiles}
          getOptionLabel={(option) =>
            `${option.firstName} ${option.lastName} (${option.profession})`
          }
          value={selectedContractor}
          onChange={(e, newValue) => setSelectedContractor(newValue)}
          renderInput={(params) => (
            <TextField {...params} label="Select Contractor" margin="normal" />
          )}
          fullWidth
          disabled={isLoading}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
          onClick={() => navigate(`/jobs/${selectedContractor?.id}`)}
          disabled={!selectedContractor || isLoading}
        >
          Continue
        </Button>
      </Paper>
    </Box>
  );
};

export default HomePage;

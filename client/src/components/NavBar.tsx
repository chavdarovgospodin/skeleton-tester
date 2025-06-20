import { AppBar, Box, Toolbar, Button, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useSnackbar } from '../contexts/SnackBar';
import {
  deleteProfileBalance,
  deleteProfileId,
  getProfileBalance,
} from '../services/utils';
import { useState } from 'react';
import DepositFundsModal from './DepositFundsModal';

const NavBar = () => {
  const [isFundsDialogOpen, setIsFundsDialogOpen] = useState(false);

  const navigate = useNavigate();
  const { showSuccess } = useSnackbar();
  const balance = getProfileBalance();

  const handleLogout = () => {
    deleteProfileId();
    deleteProfileBalance();
    showSuccess('Logged out successfully');
    navigate('/');
  };

  const handleFundsOpen = () => {
    setIsFundsDialogOpen(!isFundsDialogOpen);
  };

  return (
    <>
      <DepositFundsModal
        isOpen={isFundsDialogOpen}
        handleClose={handleFundsOpen}
      />
      <AppBar position="static" color="transparent" elevation={2}>
        <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Chip
              label={`Balance: $${Number(balance).toFixed(2)}`}
              color="info"
            />
            <Button
              variant="contained"
              color="warning"
              onClick={handleFundsOpen}
            >
              Deposit Funds
            </Button>
          </Box>
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>
    </>
  );
};

export default NavBar;

import React, { useState } from 'react';
import { Button, Typography, Box, ButtonGroup, Modal } from '@mui/material';
import { depositBalance } from '../services/api';
import { useSnackbar } from '../contexts/SnackBar';
import { getProfileId, setProfileBalance } from '../services/utils';

const amounts = [1, 5, 10, 50, 100, 500];

const DepositFundsModal: React.FC<{
  isOpen: boolean;
  handleClose: () => void;
}> = ({ isOpen, handleClose }) => {
  const [selected, setSelected] = useState<number | null>(null);
  const { showSuccess, showError } = useSnackbar();
  const profileId = getProfileId();

  const handleDeposit = async (amount: number) => {
    if (!profileId) return showError('No profile selected');

    try {
      const data = await depositBalance(parseInt(profileId), amount);

      setProfileBalance(data.newBalance);
      showSuccess(data.message || 'Deposit successful!');
      onHandleClose();
    } catch (err: any) {
      showError(err.response?.data?.error || 'Deposit failed');
      console.error(err);
    }
  };

  const onHandleClose = () => {
    handleClose();
    setSelected(null);
  };

  return (
    <Modal open={isOpen} onClose={onHandleClose}>
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 400,
          bgcolor: 'background.paper',
          border: '2px solid #000',
          boxShadow: 24,
          p: 4,
        }}
      >
        <Typography color="black" variant="h4" gutterBottom>
          Deposit Funds
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <Typography color="black" variant="h6">
            Please select a deposit amount
          </Typography>
          <ButtonGroup variant="outlined" color="primary">
            {amounts.map((amount) => (
              <Button
                key={amount}
                variant={selected === amount ? 'contained' : 'outlined'}
                onClick={() => setSelected(amount)}
              >
                {amount}
              </Button>
            ))}
          </ButtonGroup>

          <Button
            variant="contained"
            color="success"
            disabled={selected === null}
            onClick={() => selected !== null && handleDeposit(selected)}
          >
            Confirm
          </Button>

          <Button variant="contained" onClick={handleClose}>
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default DepositFundsModal;

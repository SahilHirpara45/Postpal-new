import React from 'react';
import { Button, Box, Modal, Typography, CircularProgress } from '@mui/material';

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '1px solid #000',
  borderRadius: '10px',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
};

const ConfirmationModal = ({ showModal, cancelHandler, submitHandler, cancelText, submitText, headerText, bodyText, loading }) => {
  return (
    <Modal
      open={showModal}
      onClose={cancelHandler}
      aria-labelledby="confirmation-modal-title"
      aria-describedby="confirmation-modal-description"
    >
      <Box sx={modalStyle}>
        <Typography id="confirmation-modal-title" variant="h5" component="h2">
          {headerText}
        </Typography>
        <Typography id="confirmation-modal-description" sx={{ mt: 2 }}>
          {bodyText}
        </Typography>
        <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-around', width: '100%' }}>
          <Button
            variant="contained"
            color="success"
            onClick={submitHandler}
            disabled={loading}
            sx={{ mr: 1 }}
          >
            {loading ? <CircularProgress size={24} /> : submitText}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={cancelHandler}
          >
            {cancelText}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default ConfirmationModal;

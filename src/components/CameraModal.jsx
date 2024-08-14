import React from "react";
import { Box, Button, IconButton, Modal, Typography } from "@mui/material";
import Webcam from "react-webcam";
import { CloseRounded } from "@mui/icons-material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  // border: "2px solid #000",
  borderRadius: "10px",
  // boxShadow: 24,
  px: 2,
};

const videoConstraints = {
  //   width: 600,
  //   height: 300,
  facingMode: "environment",
};

const CameraModal = ({ open, handleClose, webcamRef, handleCapture }) => {
  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
          <IconButton onClick={handleClose}>
            <CloseRounded />
          </IconButton>
        </Box>
        <Webcam
          ref={webcamRef}
          // audio={true}
          screenshotFormat="image/jpeg"
          screenshotQuality={1}
          videoConstraints={videoConstraints}
          // onUserMedia={onUserMedia}
        />
        <Box display="flex" alignItems="center" mt={1} mb={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleCapture}
            // disabled={formik.values.photos.length >= 4}
          >
            Capture photo
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default CameraModal;

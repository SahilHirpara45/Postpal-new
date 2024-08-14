import React, { Fragment, useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { useDropzone } from "react-dropzone";
import { FaUpload } from "react-icons/fa";
import { MdAddAPhoto } from "react-icons/md";

const MAX_FILE_SIZE = 6 * 1024 * 1024;

const buttonStyle = {
  background: "none",
  border: "none",
  color: "#481AA3",
  textDecoration: "none",
  cursor: "pointer",
  padding: 0,
  fontSize: "16px",
  fontWeight: "bold",
  height: "20px",
};

const FileUploaderMultiple = ({
  label = "",
  name,
  value,
  onChange,
  imgWidth = 200,
  imgHeight = 200,
  maxFileNum = 1,
  errors,
  disabled = false,
}) => {
  const [files, setFiles] = useState(Array.isArray(value) ? value : []);
  const [errorsMes, setErrorsMes] = useState("");
  const [rejectedFiles, setRejectedFiles] = useState([]);

  useEffect(() => {
    if (value && JSON.stringify(value) !== JSON.stringify(files)) {
      setFiles(Array.isArray(value) ? value : [value]);
    }
  }, [value]);

  const renderFilePreview = (file) => {
    // console.log("File for preview:", file);

    if (typeof file === "string") {
      if (file.includes("http")) {
        // if (/\.(jpg|jpeg|png|gif|svg)$/i.test(file)) {
        return (
          <img
            src={file}
            alt="preview"
            style={{ width: imgWidth, height: imgHeight }}
          />
        );
        // }
        // else if (/\.(mp4|webm)$/i.test(file)) {
        //   return (
        //     <video style={{ width: imgWidth, height: imgHeight }} controls>
        //       <source src={file} type="video/mp4" />
        //       Your browser does not support the video tag.
        //     </video>
        //   );
        // }
        //  else {
        //   return <span>Not supported</span>;
        // }
      } else {
        return <span>Invalid URL</span>;
      }
    } else if (file && file.type) {
      if (file.type.startsWith("image")) {
        return (
          <img
            src={URL.createObjectURL(file)}
            width={imgWidth}
            height={imgHeight}
            alt={file.name}
          />
        );
      } else if (file.type.startsWith("video")) {
        return (
          <video style={{ width: imgWidth, height: imgHeight }} controls>
            <source src={URL.createObjectURL(file)} type={file.type} />
            Your browser does not support the video tag.
          </video>
        );
      } else {
        return <span>Not supported</span>;
      }
    } else {
      return <span>No file selected</span>;
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: (acceptedFiles, fileRejections) => {
      if (disabled) return; // Prevent file selection when disabled

      const filteredFiles = acceptedFiles.filter((file) => {
        const fileType = file.type.split("/")[0];
        return fileType === "image" || fileType === "video";
      });

      const newFiles = [...files, ...filteredFiles].slice(0, maxFileNum);

      setRejectedFiles(fileRejections);

      const errorMsgs = fileRejections.map((fileRejection) => {
        return fileRejection.errors.map((err) => err.message).join(", ");
      });

      setErrorsMes(errorMsgs.join(", "));

      setFiles(newFiles);
      onChange(newFiles);
    },
    maxSize: MAX_FILE_SIZE,
    accept: {
      "image/*": [],
      "video/*": [],
    },
    disabled: disabled, // Disable dropzone when disabled is true
  });

  const handleRemoveFile = (index) => {
    if (disabled) return; // Prevent file removal when disabled

    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
    onChange(newFiles);
  };

  const fileList = files.map((file, index) => (
    <div key={index} style={{ display: "flex", gap: "2rem" }}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <div className="file-preview">{renderFilePreview(file)}</div>
        {!disabled && (
          <Button
            variant="outlined"
            color="error"
            onClick={() => handleRemoveFile(index)}
            sx={{ width: "100%" }}
          >
            Remove file
          </Button>
        )}
      </div>
    </div>
  ));

  return (
    <Fragment>
      <Box
        sx={{
          border: "2px dashed #481AA3",
          borderRadius: "15px",
          width: "100%",
          minHeight: "12.5rem",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#EBE4FA",
          position: "relative",
        }}
      >
        {files.length ? (
          <Fragment>
            <Box sx={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
              {fileList}
            </Box>
          </Fragment>
        ) : null}
        {files.length < maxFileNum && (
          <div
            {...getRootProps({ className: "dropzone" })}
            style={{
              alignItems: "center",
              display: "flex",
              flexDirection: "column",
              cursor: "pointer",
              width: "100%",
              height: "100%",
              justifyContent: "center",
            }}
          >
            <input {...getInputProps()} />
            {!files.length && (
              <Box
                sx={{
                  display: "flex",
                  textAlign: "center",
                  alignItems: "center",
                  flexDirection: "column",
                }}
              >
                <FaUpload
                  style={{ color: "#481AA3", width: "30px", height: "28px" }}
                />
                <div>
                  <span className="dz-message-text">
                    Drag & drop images here
                  </span>
                  <div
                    className="dz-message-btn"
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <span>or</span>
                    <button
                      style={buttonStyle}
                      size="sm"
                      variant="primary"
                      type="button"
                    >
                      Browse Files
                    </button>
                  </div>
                </div>
              </Box>
            )}
            <Box sx={{ p: files.length && "1rem" }}>
              <MdAddAPhoto
                style={{
                  fontSize: "30px",
                  color: "#481AA3",
                  cursor: "pointer",
                  visibility:
                    files.length !== maxFileNum ? "visible" : "hidden",
                }}
              />
            </Box>
          </div>
        )}
      </Box>

      {(rejectedFiles.length > 0 || errorsMes) && (
        <Typography variant="caption" color="error">
          File is larger than 6MB
        </Typography>
      )}

      {errors && errors[name] && (
        <Typography variant="caption" color="error">
          {errors[name].message}
        </Typography>
      )}
    </Fragment>
  );
};

export default FileUploaderMultiple;

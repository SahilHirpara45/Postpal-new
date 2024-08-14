import { Box, InputBase, Paper, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import SimpleBar from "simplebar-react";
import specker from "../../assets/svg/speaker.svg";
import volume_on from "../../assets/svg/volume_on.svg";
import volume_off from "../../assets/svg/volume_off.svg";
import send from "../../assets/svg/send.svg";
import chat_sender from "../../assets/svg/chat_sender.svg";
import chat_receiver from "../../assets/svg/chat_receiver.svg";
import volumn from "../../assets/svg/volume.svg";

export default function Guider() {
  const [message, setMessage] = useState("");

  return (
    <Box
      sx={{
        overflowY: "auto",
        minHeight: "95vh",
        backgroundColor: "#fff",
      }}
    >
      <Box
        sx={{
          paddingLeft: "20px",
          paddingRight: "20px",
          paddingTop: "15px",
          paddingBottom: "15px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #E5E5E8",
        }}
      >
        <Typography variant="h5" component="h5">
          Receving Guider
        </Typography>
        <Box
          sx={{
            paddingX: "12px",
            paddingY: "4px",
            border: "1px solid #5E17EB",
            borderRadius: "8px",
            backgroundColor: "#F3EDFF",
          }}
        >
          <img src={specker} alt="specker" />
        </Box>
      </Box>
      <SimpleBar
        forceVisible="y"
        autoHide={true}
        style={{
          overflowY: "auto",
          maxHeight: "calc(100vh - 190px)",
          marginBottom: "10px",
        }}
        className="custom-scrollbar"
      >
        <Box
          sx={{
            marginTop: "20px",
            marginX: "20px",
          }}
        >
          <Box
          // sx={{
          //   height: "83vh",
          //   overflowY: "auto",
          // }}
          >
            {!message && (
              <Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    //   backgroundColor: "#FAFAFA",
                    paddingX: "10px",
                    paddingY: "10px",
                    border: "1px solid #E5E5E8",
                    marginTop: "10px",
                    borderRadius: "4px",
                  }}
                >
                  <label>How to receive oversize package?</label>
                  <img src={volume_on} alt="volumn_on" />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    //   backgroundColor: "#FAFAFA",
                    paddingX: "10px",
                    border: "1px solid #E5E5E8",
                    marginTop: "10px",
                    paddingY: "10px",
                    borderRadius: "4px",
                  }}
                >
                  <label>How to generate receiving slip?</label>
                  <img src={volume_off} alt="volumn_on" />
                </Box>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    //   backgroundColor: "#FAFAFA",
                    paddingX: "10px",
                    border: "1px solid #E5E5E8",
                    marginTop: "10px",
                    paddingY: "10px",
                    borderRadius: "4px",
                  }}
                >
                  <label>How to process no suite package?</label>
                  <img src={volume_off} alt="volumn_on" />
                </Box>
              </Box>
            )}
            {message && (
              <>
                <Box>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <img src={chat_sender} alt="send" />
                    <label style={{ marginLeft: "10px", fontWeight: "bold" }}>
                      You
                    </label>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#FAFAFA",
                      height: "36px",
                    }}
                  >
                    <label style={{ marginLeft: "37px", fontSize: "14px" }}>
                      How you receive oversize package?
                    </label>
                  </Box>
                </Box>
                <Box sx={{ marginTop: "20px" }}>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <img src={chat_receiver} alt="send" />
                    <label style={{ marginLeft: "10px", fontWeight: "bold" }}>
                      CustomsID
                    </label>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      backgroundColor: "#481AA3",
                      // height: "36px",
                      color: "white",
                      marginLeft: "37px",
                      borderRadius: "8px",
                      marginTop: "5px",
                    }}
                  >
                    <ol
                      style={{
                        marginLeft: "37px",
                        fontSize: "14px",
                        listStyleType: "decimal",
                        marginRight: "20px",
                        marginBottom: "10px",
                        width: "100%",
                      }}
                    >
                      <li style={{ marginTop: "10px" }}>
                        Prepare the Receiving Area: Make sure the receiving area
                        is clear and spacious enough to accommodate the oversize
                        package.
                      </li>
                      <li style={{ marginTop: "10px" }}>
                        Verify Documentation: Check that you have all the
                        necessary documentation for the package, including
                        shipping labels, invoices, and any special handling
                        instructions.{" "}
                      </li>
                      <li style={{ marginTop: "10px" }}>
                        Inspect the Package: Before accepting the package,
                        inspect it for any signs of damage or tampering. Note
                        any discrepancies on the delivery receipt.
                      </li>
                      <li style={{ marginTop: "10px" }}>
                        {" "}
                        Use Proper Equipment: If necessary, use equipment such
                        as forklifts, pallet jacks, or dollies to safely handle
                        and transport the oversize package.
                      </li>
                      <li style={{ marginTop: "10px" }}>
                        {" "}
                        Coordinate with Team Members: If the package is too
                        large to handle alone, coordinate with other staff
                        members to ensure it is safely received and moved to the
                        appropriate storage area.
                      </li>
                      <li style={{ marginTop: "10px" }}>
                        {" "}
                        Record Receipt: Once the package is received, make sure
                        to record the receipt in your inventory management
                        system and update any relevant records.
                      </li>
                      <li style={{ marginTop: "10px" }}>
                        {" "}
                        Notify Recipient: If the package is not for internal use
                        but for a specific recipient, notify them promptly of
                        its arrival and coordinate delivery or pickup
                        arrangements.
                      </li>
                      <li style={{ marginTop: "10px" }}>
                        {" "}
                        Secure Storage: Store the oversize package in a
                        designated area that is secure and easily accessible,
                        taking care to avoid blocking walkways or creating
                        safety hazards.
                      </li>
                    </ol>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      marginLeft: "35px",
                      marginTop: "10px",
                    }}
                  >
                    <img src={volumn} alt="send" />
                  </Box>
                </Box>
              </>
            )}
          </Box>
        </Box>
      </SimpleBar>
      <Box
        sx={{
          position: "absolute",
          bottom: 80,
          width: "98%",
          left: "2%",
          //   right: "5%",
          backgroundColor: "#fff",
        }}
      >
        <Box
          sx={{
            // marginX: "20px",
            position: "absolute",
            bottom: "5%",
            width: "98%",
          }}
        >
          <Paper
            component="form"
            sx={{
              p: "2px 4px",
              display: "flex",
              alignItems: "center",
              border: "1px solid #E5E5E8",
              width: "100%",
              height: 40,
              marginTop: "10px",
            }}
          >
            <InputBase
              sx={{ ml: 1, flex: 1 }}
              placeholder="Ask me a question"
              inputProps={{ "aria-label": "Ask me a question" }}
              size="small"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
            <img src={send} alt="send" />
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

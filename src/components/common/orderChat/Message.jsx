import * as React from "react";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { ListItemIcon, Typography } from "@mui/material";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";

const ITEM_HEIGHT = 48;

export default function MessageActions({
  editMessage,
  deleteMessage,
  messageId,
  media,
  ...props
}) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        aria-label="more"
        id="long-button"
        aria-controls={open ? "long-menu" : undefined}
        aria-expanded={open ? "true" : undefined}
        aria-haspopup="true"
        onClick={handleClick}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="long-menu"
        MenuListProps={{
          "aria-labelledby": "long-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 4.5,
            // width: '20ch',
          },
        }}
        // sx={{color: "#fff"}}
      >
        {!media && (
          <MenuItem
            onClick={() => {
              editMessage();
              handleClose();
            }}
            sx={{ color: "#000", "&:hover": { color: "#fff" } }}
          >
            <ListItemIcon >
              <MdEdit size={20} />
            </ListItemIcon>
            <Typography variant="inherit">Edit</Typography>
          </MenuItem>
        )}
        <MenuItem
          onClick={() => {
            deleteMessage();
            handleClose();
          }}
          sx={{ color: "#000", "&:hover": { color: "#fff" } }}
        >
          <ListItemIcon>
            <MdDelete size={20} />
          </ListItemIcon>
          <Typography variant="inherit">Delete</Typography>
        </MenuItem>
      </Menu>
    </div>
  );
}

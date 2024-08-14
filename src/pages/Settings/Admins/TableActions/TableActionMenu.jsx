import React, { useState } from "react";
import {
  Button,
  Menu,
  MenuItem,
  Typography,
  alpha,
  styled,
} from "@mui/material";
import actionIcon from "../../../../assets/svg/action_more.svg";
import { Icon } from "@iconify/react/dist/iconify.js";

const StyledMenu = styled((props) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: 6,
    marginTop: theme.spacing(1),
    minWidth: 160,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow: "0px 4px 12px 0px #00000014",
    "& .MuiMenu-list": {
      padding: "6px 3px",
    },
    "& .MuiMenuItem-root": {
      minHeight: "38px",
      "& .MuiSvgIcon-root": {
        fontSize: 18,
        color: theme.palette.text.secondary,
        marginRight: theme.spacing(1.5),
      },
      "&:hover": {
        // backgroundColor: alpha(
        //   theme.palette.primary.main,
        //   theme.palette.action.hoverOpacity
        // ),
        backgroundColor: "#e7dcfc",
        color: theme.palette.primary.main,
        borderRadius: "4px",
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
      "&.disabled": {
        opacity: 0.5,
        pointerEvents: "none",
      },
    },
  },
}));

const TableActionMenu = ({ row, updatedActionList }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleActionClick = (event, rowData) => {
    setAnchorEl(event.currentTarget);
    console.log(rowData, "rowData>>>");
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="demo-customized-button"
        aria-controls={open ? "demo-customized-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        disableElevation
        onClick={(event) => handleActionClick(event, row)}
        sx={{
          backgroundColor: "#fff",
          "&:hover": {
            outline: "none",
            color: "#fff",
            backgroundColor: "#fff",
          },
        }}
      >
        <img src={actionIcon} alt="action" />
      </Button>

      <StyledMenu
        id="demo-customized-menu"
        MenuListProps={{
          "aria-labelledby": "demo-customized-button",
        }}
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
      >
        {updatedActionList &&
          updatedActionList.map((act) => (
            <MenuItem
              key={act.id}
              // onClickHandler={() => act.onClickHandle(row.id)}
              onClick={() => {
                handleClose();
                if (!act.isDisable) {
                  act.onClickHandle(row);
                }
              }}
              // disabled={act.isDisable ? true : !act.isDisable}
              // className={act.isDisable}
            >
              <Icon
                icon={act.iconName}
                width={24}
                height={24}
                style={{
                  paddingRight: "8px",
                  opacity: act.isDisable ? 0.5 : 1,
                  ":hover": {
                    color: "#8770DE",
                  },
                }}
              />
              <Typography
                variant="subtitle1"
                className={
                  !act.isDisable ? !act.isDisable : "disabled opacity-50"
                }
              >
                {act.actionName}
              </Typography>
            </MenuItem>
          ))}
      </StyledMenu>
    </div>
  );
};

export default TableActionMenu;

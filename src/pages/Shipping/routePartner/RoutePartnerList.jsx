import {
  Box,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TablePagination,
  TableRow,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import actionIcon from "../../../assets/svg/action_more.svg";
import editicon from "../../../assets/svg/action_edit.svg";
import viewicon from "../../../assets/svg/view.svg";
import addressicon from "../../../assets/svg/location.svg";
import museicon from "../../../assets/svg/muse.svg";
import deleteicon from "../../../assets/svg/delete.svg";
import { generateRoutePartnersColumns } from "./helper";
import DataTableComponent from "../../../components/common/DataTable/DataTable";
import ConfirmationModal from "../../../components/common/ConfirmationModal/ConfirmationModal";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../../firebaseConfig";
import { toast } from "react-toastify";

export default function RoutePartnerList({ tableData }) {
  const [currentRow, setCurrentRow] = useState(null);
  const [confirmatioModalState, setConfirmationModalState] = useState({
    showModal: false,
    routePartnerId: "",
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const deleteHandler = async () => {
    setLoading(true);
    try {
      await updateDoc(
        doc(db, "routePartners", confirmatioModalState.routePartnerId),
        {
          isDeleted: true,
        }
      ).then(() => {
        setConfirmationModalState({ showModal: false, routePartnerId: "" });
        toast.success("Route Partner Deleted Successfully");
        setLoading(false);
      });
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const cancelHandler = () => {
    setConfirmationModalState({ showModal: false, routePartnerId: "" });
  };

  const menuOptions = useMemo(
    () => [
      {
        id: "edit",
        iconName: "mdi:square-edit-outline",
        actionName: "Edit",
        // redirectUrl:'/systems/route-partner/addNew',
        onClickHandle: (row) => {
          console.log("id in edit", row?.id);
          navigate("/shipping/route-partner/addNew", { state: { id: row?.id } });
        },
      },
      {
        id: "delete",
        iconName: "material-symbols:delete-rounded",
        // actionName: "Delete",
        actionName: "Request For Delete",
        isDisable: true,
        onClickHandle: (row) => {
          // const docRef=doc(db,'routePartners',id)
          // deleteDoc(docRef)
          setConfirmationModalState((prev) => ({
            showModal: true,
            routePartnerId: row?.id,
          }));
        },
      },
      {
        id: "view-details",
        iconName: "ic:baseline-remove-red-eye",
        actionName: "View Details",
        onClickHandle: (row) => {
          navigate(`/shipping/route-partner/view/${row?.id}`);
        },
      },
      {
        id: "add-main-address",
        iconName: "mdi:add-location",
        actionName: "Add Main Address",
        onClickHandle: (row) => {
          navigate(`/shipping/route-partner/addNewMainAddress`, {
            state: { routerId: row?.id },
          });
        },
      },
      {
        id: "add-a-muse",
        iconName: "ic:twotone-alt-route",
        actionName: "Add A Muse",
        onClickHandle: (row) => {
          navigate(`/shipping/route-partner/addMuse`, {
            state: { routerId: row?.id },
          });
        },
      },
    ],
    []
  );
  const RoutePartnersColumns = generateRoutePartnersColumns(menuOptions);

  return (
    <>
      <Box sx={{ display: "contents" }}>
        <Paper
          sx={{
            width: "100%",
            // height: "75vh",
            border: "1px solid #E5E5E8",
            borderRadius: "4px",
          }}
        >
          {tableData && tableData.length > 0 && (
            <DataTableComponent
              data={tableData || []}
              columns={RoutePartnersColumns}
              // searchHandler={searchHandler}
              // paginationHandler={paginationHandler}
              // pagination={pagination}
            />
          )}
        </Paper>
      </Box>
      <ConfirmationModal
        showModal={confirmatioModalState.showModal}
        submitHandler={() => deleteHandler()}
        submitText={"Delete"}
        cancelText={"Cancel"}
        cancelHandler={cancelHandler}
        headerText={"Are you sure?"}
        bodyText={"You want to delete this Route Partner"}
        loading={loading}
      />
    </>
  );
}

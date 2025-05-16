import React, { useState } from "react";
import {
  Box,
  Button,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Typography,
  Checkbox,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { useData } from "../hooks/useData";
import Edit from "./Edit";

const DataList = () => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selected, setSelected] = useState([]);
  const [editRecord, setEditRecord] = useState(null);
  const [isBulkEdit, setIsBulkEdit] = useState(false);

  const { data, isLoading, error, deleteRecords, updateRecords } = useData(
    page + 1,
    rowsPerPage
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = data.items.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }

    setSelected(newSelected);
  };

  const handleDelete = () => {
    if (selected.length > 0) {
      deleteRecords(selected);
      setSelected([]);
    }
  };

  const handleEdit = (record) => {
    setEditRecord(record);
    setIsBulkEdit(false);
  };

  const handleBulkEdit = () => {
    if (selected.length > 0) {
      setEditRecord({ id: selected[0] }); // Pass first selected record as template
      setIsBulkEdit(true);
    }
  };

  const handleCloseEdit = () => {
    setEditRecord(null);
    setIsBulkEdit(false);
  };

  const handleUpdate = async (updatedData) => {
    if (isBulkEdit) {
      // Update all selected records with the same data
      const recordsToUpdate = selected.map((id) => ({
        id,
        ...updatedData,
      }));
      await updateRecords(recordsToUpdate);
    } else {
      // Update single record
      await updateRecords([{ id: editRecord.id, ...updatedData }]);
    }
    handleCloseEdit();
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography color="error">Error: {error.message}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
        <Typography variant="h5" component="h2">
          Data List
        </Typography>
        {selected.length > 0 && (
          <Box>
            <Button
              variant="contained"
              color="primary"
              startIcon={<EditIcon />}
              onClick={handleBulkEdit}
              sx={{ mr: 1 }}
            >
              Edit Selected ({selected.length})
            </Button>
            <Button
              variant="contained"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={handleDelete}
            >
              Delete Selected ({selected.length})
            </Button>
          </Box>
        )}
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell padding="checkbox">
                <Checkbox
                  indeterminate={
                    selected.length > 0 && selected.length < data.items.length
                  }
                  checked={
                    data.items.length > 0 &&
                    selected.length === data.items.length
                  }
                  onChange={handleSelectAllClick}
                />
              </TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Value</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.items.map((row) => (
              <TableRow
                key={row.id}
                hover
                onClick={() => handleClick(row.id)}
                selected={selected.indexOf(row.id) !== -1}
              >
                <TableCell padding="checkbox">
                  <Checkbox checked={selected.indexOf(row.id) !== -1} />
                </TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>{row.value}</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEdit(row);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteRecords([row.id]);
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {data.items.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">
                  <Typography>No records found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        component="div"
        count={data.total}
        page={page}
        onPageChange={handleChangePage}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Edit
        open={!!editRecord}
        onClose={handleCloseEdit}
        record={editRecord}
        isBulkEdit={isBulkEdit}
        onUpdate={handleUpdate}
      />
    </Box>
  );
};

export default DataList;

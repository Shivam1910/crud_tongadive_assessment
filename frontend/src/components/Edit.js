import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert,
  Typography,
} from "@mui/material";
import { useData } from "../hooks/useData";

const Edit = ({ open, onClose, record, isBulkEdit, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    value: "",
    status: "active",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (record && !isBulkEdit) {
      setFormData({
        name: record.name || "",
        description: record.description || "",
        value: record.value || "",
        status: record.status || "active",
      });
    } else {
      // Reset form for bulk edit
      setFormData({
        name: "",
        description: "",
        value: "",
        status: "active",
      });
    }
  }, [record, isBulkEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      // Validate form
      if (!formData.name.trim()) {
        throw new Error("Name is required");
      }
      if (!formData.value || isNaN(formData.value)) {
        throw new Error("Value must be a number");
      }

      const updatedData = {
        ...formData,
        value: parseFloat(formData.value),
      };

      await onUpdate(updatedData);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {isBulkEdit ? "Bulk Edit Records" : "Edit Record"}
      </DialogTitle>
      <DialogContent>
        {isBulkEdit && (
          <Typography variant="subtitle2" color="textSecondary" sx={{ mb: 2 }}>
            Changes will be applied to all selected records
          </Typography>
        )}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            margin="normal"
            required
            placeholder={isBulkEdit ? "Leave empty to keep existing names" : ""}
          />
          <TextField
            fullWidth
            label="Description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            margin="normal"
            multiline
            rows={3}
            placeholder={
              isBulkEdit ? "Leave empty to keep existing descriptions" : ""
            }
          />
          <TextField
            fullWidth
            label="Value"
            name="value"
            type="number"
            value={formData.value}
            onChange={handleChange}
            margin="normal"
            required
            placeholder={
              isBulkEdit ? "Leave empty to keep existing values" : ""
            }
          />
          <TextField
            fullWidth
            select
            label="Status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            margin="normal"
          >
            <MenuItem value="active">Active</MenuItem>
            <MenuItem value="inactive">Inactive</MenuItem>
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {isBulkEdit ? "Update All Selected" : "Save Changes"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default Edit;

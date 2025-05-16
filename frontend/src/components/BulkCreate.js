import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  IconButton,
  Grid,
  MenuItem,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import { useData } from "../hooks/useData";

const initialRecord = {
  name: "",
  description: "",
  value: "",
  status: "active",
};

const BulkCreate = () => {
  const navigate = useNavigate();
  const [records, setRecords] = useState([{ ...initialRecord }]);
  const [errors, setErrors] = useState({});
  const { createRecords, isCreating } = useData();

  const validateRecord = (record) => {
    const recordErrors = {};
    if (!record.name.trim()) {
      recordErrors.name = "Name is required";
    }
    if (!record.value) {
      recordErrors.value = "Value is required";
    } else if (isNaN(record.value) || parseFloat(record.value) <= 0) {
      recordErrors.value = "Value must be a positive number";
    }
    return recordErrors;
  };

  const handleAddRecord = () => {
    setRecords([...records, { ...initialRecord }]);
    setErrors({});
  };

  const handleRemoveRecord = (index) => {
    setRecords(records.filter((_, i) => i !== index));
    const newErrors = { ...errors };
    delete newErrors[index];
    setErrors(newErrors);
  };

  const handleChange = (index, field, value) => {
    const newRecords = [...records];
    newRecords[index] = {
      ...newRecords[index],
      [field]: value,
    };
    setRecords(newRecords);

    // Clear error for this field
    if (errors[index]?.[field]) {
      const newErrors = { ...errors };
      delete newErrors[index][field];
      if (Object.keys(newErrors[index]).length === 0) {
        delete newErrors[index];
      }
      setErrors(newErrors);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate all records
    const newErrors = {};
    let hasErrors = false;

    records.forEach((record, index) => {
      const recordErrors = validateRecord(record);
      if (Object.keys(recordErrors).length > 0) {
        newErrors[index] = recordErrors;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    // Convert values to numbers and prepare data
    const formattedRecords = records.map((record) => ({
      ...record,
      value: parseFloat(record.value),
    }));

    try {
      await createRecords(formattedRecords);
      navigate("/");
    } catch (error) {
      console.error("Error creating records:", error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Typography variant="h5" component="h2" gutterBottom>
        Bulk Create Records
      </Typography>

      {records.map((record, index) => (
        <Paper
          key={index}
          sx={{
            p: 2,
            mb: 2,
            position: "relative",
            border: errors[index] ? "1px solid #f44336" : "none",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={3}>
              <TextField
                fullWidth
                required
                label="Name"
                value={record.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
                error={!!errors[index]?.name}
                helperText={errors[index]?.name}
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField
                fullWidth
                label="Description"
                value={record.description}
                onChange={(e) =>
                  handleChange(index, "description", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                required
                label="Value"
                type="number"
                value={record.value}
                onChange={(e) => handleChange(index, "value", e.target.value)}
                error={!!errors[index]?.value}
                helperText={errors[index]?.value}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <TextField
                fullWidth
                select
                label="Status"
                value={record.status}
                onChange={(e) => handleChange(index, "status", e.target.value)}
              >
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
                <MenuItem value="pending">Pending</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={1}>
              <IconButton
                color="error"
                onClick={() => handleRemoveRecord(index)}
                disabled={records.length === 1}
                sx={{ mt: 1 }}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={handleAddRecord}
        >
          Add Record
        </Button>
        <Button type="submit" variant="contained" disabled={isCreating}>
          {isCreating ? "Creating..." : "Create Records"}
        </Button>
      </Box>
    </Box>
  );
};

export default BulkCreate;

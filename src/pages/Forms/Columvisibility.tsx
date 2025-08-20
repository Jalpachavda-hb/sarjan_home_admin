import React from 'react';
import {
  MenuItem,
  Select,
  Checkbox,
  ListItemText,
  InputLabel,
  FormControl,
} from '@mui/material';
import { styled } from '@mui/system';

const columns = ['Name', 'Email', 'Phone', 'Address', 'Company'];

const StyledSelect = styled(Select)({
  fontFamily: 'Poppins, sans-serif',
  fontWeight: 500,
});

const StyledInputLabel = styled(InputLabel)({
  fontFamily: 'Poppins, sans-serif',
  fontSize: '0.875rem',
});

export default function ColumnSelector({ selectedColumns, setSelectedColumns }) {
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;
    setSelectedColumns(typeof value === 'string' ? value.split(',') : value);
  };

  return (
    <FormControl sx={{ minWidth: 200 }}>
      <StyledInputLabel id="column-select-label">Select Columns</StyledInputLabel>
      <StyledSelect
        labelId="column-select-label"
        multiple
        value={selectedColumns}
        onChange={handleChange}
        renderValue={() => 'Select Columns'} // Always show this
        MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
        className="text-sm bg-white text-gray-800"
      >
        {columns.map((col) => (
          <MenuItem
            key={col}
            value={col}
            className={`font-poppins ${
              selectedColumns.includes(col)
                ? 'bg-blue-100 text-blue-700'
                : 'text-gray-700'
            }`}
          >
            <Checkbox checked={selectedColumns.includes(col)} />
            <ListItemText primary={col} />
          </MenuItem>
        ))}
      </StyledSelect>
    </FormControl>
  );
}

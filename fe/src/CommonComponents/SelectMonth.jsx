import React, { useState, useEffect } from "react";
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';

const SelectMonth = ({ setMonthSelected }) => {
    const [defaultMonth, setDefaultMonth] = useState('');

    useEffect(() => {
        const currentDate = new Date();
        const month = String(currentDate.getMonth() + 1).padStart(2, '0');
        const year = currentDate.getFullYear();
        const formattedDate = `${year}-${month}`;
        setMonthSelected(`${month}-${year}`)
        setDefaultMonth(formattedDate);
    }, []);

    const handleMonthChange = (event) => {
        const selectedDate = new Date(event.target.value);
        const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
        const year = selectedDate.getFullYear();
        const formattedDate = `${month}-${year}`;
        setDefaultMonth(event.target.value)
        setMonthSelected(formattedDate);
    };

    return (
        <Box sx={{ minWidth: 200 }}>
            <TextField
                id="month-picker"
                label="Month"
                type="month"
                value={defaultMonth}
                onChange={handleMonthChange}
                InputLabelProps={{
                    shrink: true,
                }}
            />
        </Box>
    );
}

export default SelectMonth;

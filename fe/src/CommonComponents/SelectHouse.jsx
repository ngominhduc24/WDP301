import React, { useEffect, useState } from "react";
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { GetHouseService } from "../services/houses";
import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

const SelectHouse = ({ onSelect }) => {
    const [houses, setHouses] = useState([]);
    const [houseSelected, setHouseSelected] = useState('');

    useEffect(() => {
        GetHouseService().then(data => {
            const fetchedHouses = data.data.data.houses;
            setHouses(fetchedHouses);
            setHouseSelected(fetchedHouses.length > 0 ? fetchedHouses[0]._id : '');
            onSelect(fetchedHouses.length > 0 ? fetchedHouses[0]._id : '');
        });
    }, []);

    const handleChange = (event) => {
        const selectedHouseId = event.target.value;
        setHouseSelected(selectedHouseId);
        onSelect(selectedHouseId); // Pass the selected house ID to the parent component
    };

    return (
        <Box sx={{ minWidth: 200 , maxWidth:300}}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Houses</InputLabel>
                <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={houseSelected}
                    label="House"
                    onChange={handleChange}
                >
                    {houses.map((house, index) => (
                        <MenuItem key={index} value={house._id}>{house.name}</MenuItem>
                    ))}
                </Select>
            </FormControl>
        </Box>
    );
}

export default SelectHouse;

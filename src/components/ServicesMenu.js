import * as React from 'react';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import ListItemText from '@mui/material/ListItemText';
import Select from '@mui/material/Select';
import Checkbox from '@mui/material/Checkbox';
import { Box } from '@mui/material';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250,
        },
    },
};

const names = [
    'Cleaning',
    'Service',
    'Cooking'
];

export default function ServicesMenu({
    user,
    handleUpdateUser
}) {
    const [sltdServices, setSltdServices] = React.useState(user?.services || []);

    React.useEffect(() => {
        console.log(user)
    }, [user])

    const handleChange = (event) => {
        const {
            target: { value },
        } = event;
        setSltdServices(
            // On autofill we get a stringified value.
            typeof value === 'string' ? value.split(',') : value,
        );
        // handleUpdateUser?.({ ...user, services: value })
    };

    return (
        <div>
            <Box sx={{ m: 1 }}>
                {/* <InputLabel id={`demo-multiple-checkbox-label-${user?.id}`}>T</InputLabel> */}
                <Select
                    id={`demo-multiple-checkbox-${user?.id}`}
                    multiple
                    value={sltdServices}
                    size="small"
                    variant='standard'
                    onChange={handleChange}
                    //   input={<OutlinedInput label="Tag" />}
                    renderValue={(selected) => {
                        // console.log(selected, "0000")
                        if (selected?.length) return selected.join(', ');

                        return " Select Services"
                    }}
                    MenuProps={MenuProps}
                >
                    {names.map((name) => (
                        <MenuItem key={name} value={name}>
                            <Checkbox checked={sltdServices.indexOf(name) > -1} />
                            <ListItemText primary={name} />
                        </MenuItem>
                    ))}
                </Select>
            </Box>
        </div>
    );
}

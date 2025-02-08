// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack, Button, Checkbox, Autocomplete, TextField, Popper, Chip, IconButton, Box } from '@mui/material';
import * as Yup from 'yup';
import PeopleIcon from '@mui/icons-material/People';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';

// assets
import { useCallback, useEffect, useMemo, useState } from 'react';
import httpSer from 'src/utils/httpSer';
import useAuth from 'src/hooks/useAuth';
import { DatePicker } from '@mui/lab';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { servicesOptions, timingsList } from 'src/pages/users/constants';
import moment from 'moment';
import ServicesMenu from '../ServicesMenu';
import { TimeRangePicker } from 'rsuite';
import 'rsuite/TimeRangePicker/styles/index.css';
import "./SchedleUser.css";


//----------------------------------------------------------------------

export default function ScheduleUser({
    user, date, data, handleUpdate, index
}) {
    const [value, setValue] = useState([
        new Date(data?.from || date),
        new Date(data?.to || date)
    ]);


    const handleGapTime = (gapTime) => {
        handleUpdate?.({
            ...data, gap_time: gapTime
        })
    }
    const handleTimeChange = (args) => {
        setValue([args[0], args[1]])
        handleUpdate?.({
            ...data, from: args[0], to: args[1]
        })
    }

    return (

        <Grid container key={index} spacing={1} sx={{
            m: 1, p: 2,
            backgroundColor: 'rgb(99 115 129 / 6%)'
        }} >
            <Grid item xs={2} sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
            }}>
                <PersonOutlineOutlinedIcon fontSize="large" /> <h3> {user?.first_name} {user?.last_name}</h3>
            </Grid>
            <Grid item xs={10}>
                <Stack direction="row" spacing={2}>
                    <Box sx={{ minWidth: '250px', display: 'flex', alignItems: 'end' }}>
                        <TimeRangePicker block size="lg" value={[
                            value[0] || date, value[1] || date
                        ]} onChange={handleTimeChange} format='hh:mm aa' showMeridiem hideMinutes={minute => minute % 30 !== 0} />
                    </Box>

                    <Autocomplete
                        multiple
                        fullWidth
                        disablePortal
                        id="services"
                        options={servicesOptions}
                        value={data?.services || []}
                        onChange={(event, newValue) => {
                            handleUpdate({
                                ...data, services: newValue
                            })
                        }}
                        renderInput={(params) => <TextField {...params} variant='standard' label="Services" />}
                    />
                    <TextField id={`${user?.id}-gap-time-key` + index} defaultValue={data?.gap_time} onChange={(event) => {
                        handleGapTime(event?.target?.value)
                    }} label="Gap Time" variant="standard" />
                </Stack>
            </Grid>
        </Grid>
    );
}

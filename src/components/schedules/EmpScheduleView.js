// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack, Button, Checkbox, Autocomplete, Typography, TextField, Popper, Chip, IconButton, Box } from '@mui/material';
import * as Yup from 'yup';
import PeopleIcon from '@mui/icons-material/People';
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import Clock from '@mui/icons-material/WatchLaterOutlined';

// assets
import { useCallback, useEffect, useMemo, useState } from 'react';
import httpSer from 'src/utils/httpSer';
import useAuth from 'src/hooks/useAuth';
import { DatePicker } from '@mui/lab';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { servicesOptions, timingsList } from 'src/pages/users/constants';
import moment from 'moment';
import { TimeRangePicker } from 'rsuite';
import 'rsuite/TimeRangePicker/styles/index.css';
import { useSnackbar } from 'notistack';


//----------------------------------------------------------------------

export default function EmpScheduleView({
    user, date, data, handleSuccess
}) {
    const [gapTime, setGapTime] = useState(data?.gap_time);
    const [loader, setLoader] = useState(false);
    const { enqueueSnackbar } = useSnackbar();


    const handleGapTime = (newVal) => {
        setGapTime(newVal)
    }

    const saveChanges = () => {
        try {
            setLoader(true)
            httpSer.post(`schedules/save-changes/${data?.id}`, {
                gap_time: gapTime
            }).then((d) => {
                enqueueSnackbar('User Saved Successfully', { variant: 'success' });
                handleSuccess?.();
                setLoader(false);
            })
                .catch((err) => {
                    setLoader(false)
                    enqueueSnackbar(errorTrans(err), { variant: 'error' });
                });
        } catch {
            enqueueSnackbar('Error Occured!', { variant: 'error' });
        }
    }


    return (

        <Grid container spacing={1} sx={{
            m: 1, p: 1,
            backgroundColor: 'rgb(99 115 129 / 6%)'
        }} >
            <Grid item xs={12} s>

            </Grid>
            <Grid item xs={12}>
                <Stack spacing={2}>
                    <Box sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                        <PersonOutlineOutlinedIcon fontSize="large" sx={{
                            marginRight: 2
                        }} /> <Typography variant="h4" > {user?.first_name} {user?.last_name}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

                        <Clock fontSize="large" sx={{ marginRight: 2 }} /> <Typography variant="h4" > {moment(data.from).format('hh:mm A')} - {moment(data.to).format('hh:mm A')} </Typography>

                    </Box>
                    <Box  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                        {data?.services?.map((service, index) => {
                            return <Typography sx={{ textDecoration: "underline",}} variant="h4" > {service} </Typography>
                        })}
                    </Box>
                        <Box  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}> 
                    <TextField id={`${user?.id}-gap-time-key`} defaultValue={data?.gap_time} onChange={(event) => {
                        handleGapTime(event?.target?.value)
                    }} label="Gap Time" variant="standard" />
                    </Box>
                    <Box  sx={{ display: 'flex',alignItems: 'center', justifyContent: 'center' }}>
                        <Button onClick={() => {
                            saveChanges()

                        }} variant="contained" sx={{
                            mr: 2
                        }} >Save</Button>
                    </Box>
                </Stack>
            </Grid>
        </Grid>
    );
}

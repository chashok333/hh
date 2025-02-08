// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack, Button, Checkbox, Autocomplete, TextField, Popper, Chip, IconButton, Box } from '@mui/material';
import * as Yup from 'yup';

// assets
import { useCallback, useEffect, useMemo, useState } from 'react';
import httpSer from 'src/utils/httpSer';
import useAuth from 'src/hooks/useAuth';
import { DatePicker } from '@mui/lab';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { timingsList } from 'src/pages/users/constants';
import BBAutocomplete from './BBAutocomplete';
import ServicesMenu from './ServicesMenu';
import moment from 'moment';

//----------------------------------------------------------------------

export default function ScheduleUserForm({
    currentSchedule, usersList
}) {
    const Schema = Yup.object().shape({
        date: Yup.string().required('Name is required'),
        from: Yup.string().required('Email is required'),
        to: Yup.string().required('Phone is required'),
        users: Yup.array()
    });

    const defaultValues = useMemo(
        () => ({
            id: currentSchedule?.id || 0,
            date: currentSchedule?.date || '',
            from: currentSchedule?.from || '',
            to: currentSchedule?.to || '',
            users: currentSchedule?.users?.map((a) => {
                return { ...a.user, services: a.services }
            }) || []
        }),
        [currentSchedule]
    );

    const methods = useForm({
        resolver: yupResolver(Schema),
        defaultValues,
    });


    const {
        reset,
        watch,
        control,
        setValue,
        errors,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    const CustomPopper = (props: any) => {
        return (
            <Popper
                {...props}
                placement="top-start" // Display dropdown above the input
                style={{ zIndex: 1300 }}
            />
        );
    };

    const handleUpdateUser = (updatedU) => {
        setValue("users", values?.users?.map((u) => {
            if (u?.id == updatedU?.id)
                return updatedU;
            return u
        }))
    }

    const saveSchedule = () => {
        httpSer.post("/schedules", {
            ...values,
            date: moment(values?.date).format("MM-DD-yyyy")
        }).then((ree) => {
            console.log(rr)
        })
    }


    return (
        <Grid container spacing={3}>
            <Grid container spacing={2} p={3} px={5} >
                <Grid item xs={4}>
                    <DatePicker
                        inputFormat="MM/dd/yyyy"
                        value={values?.date || null}
                        name={"scheduleDate"}
                        label={"Schedule Date"}
                        onChange={(val) => {
                            setValue("date", val)
                        }}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Autocomplete
                        disablePortal
                        id="from"
                        options={timingsList}
                        value={values?.from || ""}
                        onChange={(event, newValue) => {
                            console.log(newValue);
                            setValue("from", newValue)
                        }}
                        renderInput={(params) => <TextField {...params} variant='standard' label="From" />}
                    />
                </Grid>
                <Grid item xs={4}>
                    <Autocomplete
                        disablePortal
                        id="to"
                        options={timingsList}
                        value={values?.to || ""}
                        onChange={(event, newValue) => {
                            setValue("to", newValue)
                        }}
                        renderInput={(params) => <TextField {...params} variant='standard' label="To" />}
                    />
                </Grid>
                <Grid item xs={12}>
                    <BBAutocomplete multiple fullWidth
                        id="users"
                        name="users"
                        value={values?.users}
                        getOptionDisabled={(option) => {
                            // console.log()
                            let day = moment(values?.date).format("dddd");
                            return Boolean(option?.slots?.find((s) => {
                                return s.day == 'day' && s.working
                            }))
                        }
                        }
                        onChange={(evnt, selected) => {
                            console.log(selected)
                            setValue('users', selected)
                        }}
                        renderTags={(value, getTagProps) =>
                            value.map((option, index) => (
                                <Box key={option?.id} sx={{ p: 1, m: 1, borderRadius: 1, background: 'lightgray' }}>
                                    <Grid>
                                        <h3>{option?.label} </h3>
                                    </Grid>
                                    <Grid>
                                        <ServicesMenu user={option} handleUpdateUser={handleUpdateUser} />
                                    </Grid>
                                </Box>
                            ))
                        }
                        // PopperComponent={CustomPopper} 
                        defaultValue={values?.users || []} label={"Users"}
                        options={usersList || []} />
                </Grid>

                <Grid item xs={12} sx={{
                    display: 'flex',
                    justifyContent: 'end',
                    alignItems: 'end'
                }}>
                    <Button onClick={() => {
                        saveSchedule()

                    }} variant="contained" sx={{
                        mr: 3
                    }} >Save Shift</Button>
                </Grid>
            </Grid>
        </Grid>
    );
}

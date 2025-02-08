import PropTypes from 'prop-types';
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore } from 'date-fns';
import { useSnackbar } from 'notistack';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Stack, Button, Tooltip, TextField, IconButton, DialogActions, Grid } from '@mui/material';
import { LoadingButton, MobileTimePicker } from '@mui/lab';
// redux
import { useDispatch } from 'src/redux/store';
import { createEvent, updateEvent, deleteEvent } from 'src/redux/slices/tsessions';
// components
import Iconify from 'src/components/Iconify';
import { ColorSinglePicker } from 'src/components/color-utils';
import { FormProvider, RHFTextField, RHFSwitch } from 'src/components/hook-form';
import RHFAutocomplete from 'src/components/hook-form/RHFAutoComplete';
import moment from 'moment';
import httpSer from 'src/utils/httpSer';
import RHFMultiSelect from 'src/components/hook-form/RHFMultiSelect';
import { useEffect, useState } from 'react';
import { dayOptions, Roles } from './constants';
import BBAutocomplete from 'src/components/BBAutocomplete';
import { userLabel } from 'src/common/commonMethods';

// ----------------------------------------------------------------------

const COLOR_OPTIONS = [
    '#00AB55', // theme.palette.primary.main,
    '#1890FF', // theme.palette.info.main,
    '#54D62C', // theme.palette.success.main,
    '#FFC107', // theme.palette.warning.main,
    '#FF4842', // theme.palette.error.main
    '#04297A', // theme.palette.info.darker
    '#7A0C2E', // theme.palette.error.darker
];


// ----------------------------------------------------------------------

AddMockSessionForm.propTypes = {
    event: PropTypes.object,
    range: PropTypes.object,
    onCancel: PropTypes.func,
};

export default function AddMockSessionForm({ event, range, onCancel,
    teacher, currentItem, getInitialValues, handleSuccess,
    inputFormat, hanleSubmitForm, branches, onDelete }) {
    const { enqueueSnackbar } = useSnackbar();
    const [inProgress, setProgress] = useState(false)
    const dispatch = useDispatch();

    const isCreating = Object.keys(event).length === 0;

    const EventSchema = Yup.object().shape({
        title: Yup.string().max(255).required('Title is required'),
        description: Yup.string(),
        branch_id: Yup.object().required("Please Select Branch"),
        week_day: Yup.object().required("Please select day"),
        start: Yup.string().required("Please Set Start Time"),
        end: Yup.string().required("Please Set End Time")
    });
    const methods = useForm({
        resolver: yupResolver(EventSchema),
        defaultValues: getInitialValues(event, range, { ...currentItem }),
    });

    const {
        reset,
        watch,
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const onSubmit = async (data) => {
        setProgress(true)
        if (hanleSubmitForm)
            await hanleSubmitForm(data)
        setProgress(false)
    };

    const handleDelete = async () => {
        if (!currentItem.id) return;
        try {
            if (confirm("Do you want to delete slot?")) {
                onDelete && onDelete(currentItem)
                enqueueSnackbar('Delete success!');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const values = watch();
    // console.log(values)
    const isDateError = isBefore(new Date(values.end), new Date(values.start));

    let existingStudents = currentItem?.students?.map((st) => ({ ...st.user }));
    // console.log(existingStudents)
    const filterStudentsByBranch = (s) => {
        if (values?.students?.length >= 4) return false
        return s?.branches?.find((sb) => sb.branch_id == values?.branch_id?.id)
    }
    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={3} sx={{ p: 3 }}>
                <RHFTextField name="title" label="Title" />
                <RHFTextField name="description" label="Description" multiline rows={2} />
                <RHFAutocomplete options={dayOptions} label="Day" name="week_day" />
                <RHFAutocomplete options={branches || []} label="Branch" name="branch_id" />
                <BBAutocomplete multiple fullWidth customLabel={userLabel}
                    serverConfig={{
                        url: 'users/search',
                        params: {
                            role_id: Roles.Student,
                            status: 1, branch_id: values?.branch_id?.id
                        }
                    }}
                    getOptionDisabled={() => { return values?.students?.length >= 4 }}
                    onChange={(evnt, selected) => {
                        setValue('students', selected)
                    }}
                    defaultValue={existingStudents || []} label={"Student"} options={existingStudents || []} />
                <Grid container >
                    <Grid item xs={6} sx={{ pr: 1 }}>
                        <Controller
                            name="start"
                            control={control}
                            render={({ field }) => (
                                <MobileTimePicker
                                    {...field}
                                    label="Start Time"
                                    inputFormat={inputFormat || "hh:mm a"}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            )}
                        />
                    </Grid>
                    <Grid item xs={6}>
                        <Controller
                            name="end"
                            control={control}
                            render={({ field }) => (
                                <MobileTimePicker
                                    {...field}
                                    label="End date"
                                    inputFormat={inputFormat || "hh:mm a"}
                                    renderInput={(params) => (
                                        <TextField
                                            {...params}
                                            fullWidth
                                            error={!!isDateError}
                                            helperText={isDateError && 'End date must be later than start date'}
                                        />
                                    )}
                                />
                            )}
                        />
                    </Grid>
                </Grid>
            </Stack>

            <DialogActions>
                {currentItem?.id &&
                    <Tooltip title="Delete Event">
                        <IconButton onClick={handleDelete}>
                            <Iconify icon="eva:trash-2-outline" width={20} height={20} />
                        </IconButton>
                    </Tooltip>
                }
                <Box sx={{ flexGrow: 1 }} />
                <Button variant="outlined" color="inherit" onClick={onCancel}>
                    Cancel
                </Button>

                <LoadingButton type="submit" variant="contained" loading={isSubmitting || inProgress}>
                    Add
                </LoadingButton>
            </DialogActions>
        </FormProvider>
    );
}

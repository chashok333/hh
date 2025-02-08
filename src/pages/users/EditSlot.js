import PropTypes from 'prop-types';
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore } from 'date-fns';
import { useSnackbar } from 'notistack';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { Box, Stack, Button, Tooltip, TextField, IconButton, DialogActions, Grid, Card, Dialog, DialogContent, DialogTitle, Autocomplete } from '@mui/material';
import { DatePicker, LoadingButton, MobileTimePicker, DateTimePicker } from '@mui/lab';
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
import { useFormik } from 'formik';
import AttendeeReview from './AttendeeReview';
import BBAutocomplete from 'src/components/BBAutocomplete';
import { userLabel } from 'src/common/commonMethods';
import useBbgUsers from 'src/hooks/bbgUsers';

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

EditSlot.propTypes = {
    event: PropTypes.object,
    range: PropTypes.object,
    onCancel: PropTypes.func,
};

export default function EditSlot({ event, range, onCancel,
    teacher, currentItem, handleSuccess,
    students, hanleSubmitForm, branches }) {
    const { enqueueSnackbar } = useSnackbar();
    const [saving, setSaving] = useState(false);

    const [addStudent, setAddStudent] = useState(null)
    const { levels, weeks, subjects, topics } = useBbgUsers();
    const dispatch = useDispatch();
    const isCreating = Object.keys(event).length === 0;

    const formik = useFormik({
        initialValues: {
            start: new Date(currentItem?.start) || new Date(),
            end: new Date(currentItem?.end) || new Date(),
            title: currentItem?.title,
            description: currentItem?.description,
            students: currentItem?.students?.map((s) => {
                return { ...s, comment: s?.comment || '' }
            })
        },
        validationSchema: Yup.object().shape({
            start: '',
            end: '',
            title: '',
            description: ''
        }),
        onSubmit: async (values, { setErrors, setStatus, setSubmitting }) => {
            setSaving(true)
            httpSer?.post('sessions/', {
                from_time: values?.start,
                uid: currentItem?.uid,
                to_time: values?.end,
                teacher_id: currentItem?.teacher_id || 0,
                title: values?.title || '',
                description: values?.description || '',
                branch_id: currentItem?.branch_id,
                students: values?.students || [],
            }).then(() => {
                handleSuccess && handleSuccess()
                setSaving(false)
            }).catch(() => {
                setSaving(false)
            })
        },
    });

    const { handleBlur, handleChange, handleSubmit, setFieldValue, values, isSubmitting, touched, errors, setSubmitting, setValues } = formik;

    const defaultProps = {
        color: "primary",
        variant: "outlined",
        onBlur: handleBlur,
        onChange: handleChange,
        type: "text",
        inputProps: {}
    }

    const handleAttendeeChange = (student) => {
        let updatedStudents = values?.students?.map((s) => {
            if (s?.user?.id == student?.user?.id)
                return student
            return s
        });
        setFieldValue("students", updatedStudents)
    }

    const handleCloseAddStudent = () => {
        setAddStudent(null)
    }

    const handleAddStudent = () => {
        setFieldValue("students", [...values.students, { isNewRow: true, student_id: addStudent?.student?.id, user: addStudent?.student }]);
        handleCloseAddStudent()
    }

    return (
        <> <form onSubmit={handleSubmit} >
            <Grid container spacing={3} sx={{
                mt: 0, px: 3
            }}>
                <Grid item xs={12} md={12}>
                    <Card sx={{ p: 3, textAlign: 'center' }} >
                        <Grid container spacing={3}>
                            <Grid item xs={3}>
                                {<TextField
                                    {...defaultProps}
                                    id="outlined-adornment-title"
                                    error={Boolean(touched.title && errors.title)}
                                    fullWidth
                                    value={values.title}
                                    name="title"
                                    label="Title"
                                />}
                            </Grid>
                            <Grid item xs={5}>
                                {<TextField
                                    {...defaultProps}
                                    id="outlined-adornment-desc"
                                    error={Boolean(touched.description && errors.description)}
                                    fullWidth
                                    multiline
                                    value={values.description}
                                    name="description"
                                    label="Description"
                                    rows={1}
                                />}
                            </Grid>
                            <Grid item xs={2} >
                                <DateTimePicker
                                    label="Start Date"
                                    inputFormat="dd/MM/yyyy hh:mm a"
                                    value={values?.start}
                                    name="start"
                                    onChange={(val) => {
                                        setFieldValue("start", val)
                                    }}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Grid>
                            <Grid item xs={2} >
                                <DateTimePicker
                                    label="End Date"
                                    inputFormat="dd/MM/yyyy hh:mm a"
                                    value={values?.end}
                                    name="end"
                                    onChange={(val) => {
                                        setFieldValue("end", val)
                                    }}
                                    renderInput={(params) => <TextField {...params} fullWidth />}
                                />
                            </Grid>
                        </Grid>
                    </Card>
                </Grid>

                <Grid item xs={12} md={12}>
                    <Card sx={{ p: 3 }}>
                        <Grid container spacing={2}>
                            {values?.students?.map((s) => {
                                return <AttendeeReview levels={levels} weeks={weeks} subjects={subjects} student={s}
                                    topics={topics}
                                    handleAttendeeChange={handleAttendeeChange}
                                    defaultProp={defaultProps} />;
                            })}
                        </Grid>
                        <Grid item xs={12}>
                            <LoadingButton type="button" size='small' variant="outlined" sx={{ float: 'right', mt: 3 }} onClick={() => {
                                setAddStudent({ open: true })
                            }} loading={isSubmitting}>
                                Add Student
                            </LoadingButton>
                        </Grid>
                    </Card>

                </Grid>
                <Grid item xs={12} md={12}>
                    <Card sx={{ p: 3, textAlign: 'right' }}>
                        <Button onClick={handleCloseAddStudent} variant="contained" sx={{
                            mr: 3
                        }} onClick={() => { onCancel() }}>Close</Button>
                        <LoadingButton type="submit" size='medium' variant="contained" loading={saving}>
                            Submit
                        </LoadingButton>
                    </Card>
                </Grid>
                <Dialog size={"xl"} sx={{
                }} open={addStudent?.open} onClose={handleCloseAddStudent}>
                    <DialogTitle>Select Student</DialogTitle>
                    <DialogContent sx={{
                    }}>
                        <Grid sx={{
                            m: 3,
                            width: 400
                        }}>
                            <BBAutocomplete fullWidth serverConfig={{
                                url: 'users/search',
                                params: {
                                    role_id: Roles.Student,
                                    status: 1
                                }
                            }} customLabel={userLabel} onChange={(evnt, selected) => {
                                setAddStudent({
                                    open: true,
                                    student: selected
                                })
                            }}
                                defaultValue={null} label={"Student"} options={[]} />
                        </Grid>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseAddStudent} variant='contained'>Cancel</Button>
                        <Button onClick={() => {
                            handleAddStudent()
                        }} variant='contained'>Add</Button>
                    </DialogActions>
                </Dialog>
            </Grid></form></>
    );
}

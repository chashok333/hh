import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSnackbar } from 'notistack';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel, LinearProgress } from '@mui/material';
import { FormProvider, RHFRadioGroup, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../components/hook-form';
import useBbgUsers from '../../hooks/bbgUsers';
import httpSer from "src/utils/httpSer";
import BBAutocomplete from 'src/components/BBAutocomplete';
import { servicesList } from './constants';
import { errorTrans } from 'src/common/commonMethods';
// ----------------------------------------------------------------------

UserForm.propTypes = {
    isEdit: PropTypes.bool,
    currentUser: PropTypes.object,
};

export default function UserForm({ isEdit, role: currentUser, closeModel, handleSuccess }) {
    const { roles } = useBbgUsers();
    const { enqueueSnackbar } = useSnackbar();
    const [loader, setLoader] = useState(false);

    const UserSchema = Yup.object().shape({
        first_name: Yup.string().required('Name is required'),
        email: Yup.string().required('Email is required'),
        phone: Yup.string().required('Phone is required'),
        last_name: Yup.string().required('last name is required'),
        // services: Yup.object().required('Services  is required'),
    });

    const defaultValues = useMemo(
        () => ({
            id: currentUser?.id || undefined,
            first_name: currentUser?.first_name || '',
            email: currentUser?.email || '',
            last_name: currentUser?.last_name || '',
            phone: currentUser?.phone || '',
            address: currentUser?.address || "",
            status: currentUser?.status ?? 1,
        }),
        [currentUser]
    );

    const methods = useForm({
        resolver: yupResolver(UserSchema),
        defaultValues,
    });


    const {
        reset,
        watch,
        control,
        setValue,
        // values,
        errors,
        // setFieldValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    useEffect(() => {
        if (isEdit && currentUser) {
            reset(defaultValues);
        }
        if (!isEdit) {
            reset(defaultValues);
        }
    }, [isEdit, currentUser]);

    const onSubmit = async (values) => {
        try {
            setLoader(true)
            httpSer.post(currentUser?.id ? `users/${currentUser.id}` : "users", {
                ...values
            }).then((d) => {
                enqueueSnackbar('User Saved Successfully', { variant: 'success' });
                handleSuccess?.();
                setLoader(false)
            })
                .catch((err) => {
                    // console.log(err, errorTrans(err))
                    setLoader(false)
                    enqueueSnackbar(errorTrans(err), { variant: 'error' });
                });
        } catch {
            enqueueSnackbar('Error Occured!', { variant: 'error' });
        }

    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
            <Box sx={{ width: '100%', p: 1 }}>
                {loader && <LinearProgress />}
            </Box>
            <Grid container spacing={3}>
                <Grid item xs={12} md={12}>
                    <Card sx={{ p: 4 }}>
                        <Box
                            sx={{
                                columnGap: 3,
                                rowGap: 3,
                                spacing: 3,
                                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
                            }}
                        >
                            <RHFTextField name="first_name" label="Name" sx={{ mb: 2 }} />
                            <RHFTextField name="last_name" label="last Name" sx={{ mb: 2 }} />
                            <RHFTextField name="email" label="Email" sx={{ mb: 2 }} />
                            <RHFTextField name="phone" label="Phone" sx={{ mb: 2 }} />
                            <RHFRadioGroup name="status" label="Status" options={[{
                                value: 1, label: "Active"
                            }, {
                                value: 0, label: "Inactive"
                            }]} sx={{ mb: 2 }} />
                            <RHFTextField name="address" label="Address" multiline sx={{ mb: 2 }} />
                            {/*                       
                            <BBAutocomplete multiple fullWidth onChange={(evnt, selected) => {
                                setValue('services', selected)
                            }}
                                defaultValue={values?.branches || []}
                                // "service", 'cleaning'
                                defaultValue={values?.services || []}
                                label={"Services"}
                                // error={errors['services']}
                                options={servicesList || []} /> */}
                        </Box>
                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                Save
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    );
}

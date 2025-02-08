import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel } from '@mui/material';
import { FormProvider, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../components/hook-form';
import useBbgUsers from '../../hooks/bbgUsers';
import httpSer from "src/utils/httpSer";
// ----------------------------------------------------------------------

RoleForm.propTypes = {
    isEdit: PropTypes.bool,
    currentRole: PropTypes.object,
};

export default function RoleForm({ isEdit, role: currentRole, closeModel, handleSuccess }) {
    const { roles } = useBbgUsers();
    const { enqueueSnackbar } = useSnackbar();

    const RoleSchema = Yup.object().shape({
        role_name: Yup.string().required('Name is required'),
        role_description: Yup.string().required('Code is required')
    });

    const defaultValues = useMemo(
        () => ({
            role_name: currentRole?.role_name || '',
            role_description: currentRole?.role_description || ''
        }),
        [currentRole]
    );

    const methods = useForm({
        resolver: yupResolver(RoleSchema),
        defaultValues,
    });


    const {
        reset,
        watch,
        control,
        setValue,
        handleSubmit,
        formState: { isSubmitting },
    } = methods;

    const values = watch();

    useEffect(() => {
        if (isEdit && currentRole) {
            reset(defaultValues);
        }
        if (!isEdit) {
            reset(defaultValues);
        }
    }, [isEdit, currentRole]);

    const onSubmit = async (values) => {
        try {
            httpSer.post("roles", {
                ...values
            }).catch((err) => {
                enqueueSnackbar('Error Occured', { variant: 'error' });
            });
        } catch {
            enqueueSnackbar('Unable to logout!', { variant: 'error' });
        }

    };

    return (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
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
                            <RHFTextField name="role_name" label="Name" sx={{ mb: 2 }} />
                            <RHFTextField name="role_description" label="Description" />
                        </Box>
                        <Stack alignItems="flex-end" sx={{ mt: 3 }}>
                            <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                                Create User
                            </LoadingButton>
                        </Stack>
                    </Card>
                </Grid>
            </Grid>
        </FormProvider>
    );
}

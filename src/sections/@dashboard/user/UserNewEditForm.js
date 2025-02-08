import PropTypes from 'prop-types';
import * as Yup from 'yup';
import { useCallback, useEffect, useMemo } from 'react';
import { useSnackbar } from 'notistack';
import { useNavigate } from 'react-router-dom';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, Card, Grid, Stack, Switch, Typography, FormControlLabel } from '@mui/material';
// utils
import { fData } from '../../../utils/formatNumber';
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// _mock
import { countries } from '../../../_mock';
// components
import Label from '../../../components/Label';
import { FormProvider, RHFMultiCheckbox, RHFSelect, RHFSwitch, RHFTextField, RHFUploadAvatar } from '../../../components/hook-form';
import useBbgUsers from '../../../hooks/bbgUsers';
import httpSer from "src/utils/httpSer";
import RHFMultiSelect from 'src/components/hook-form/RHFMultiSelect';
import { errorTrans, filterBranches } from 'src/common/commonMethods';
import useAuth from 'src/hooks/useAuth';
import { Roles } from 'src/pages/users/constants';
import { setPageProgres } from 'src/redux/slices/bbg';
import { useDispatch } from 'src/redux/store';
// ----------------------------------------------------------------------

UserNewEditForm.propTypes = {
  isEdit: PropTypes.bool,
  currentUser: PropTypes.object,
};

export default function UserNewEditForm({ isEdit, currentUser, parents, handleSuccess, selectedBranches }) {
  const navigate = useNavigate();
  const { roles, branches } = useBbgUsers();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { enqueueSnackbar } = useSnackbar();

  const NewUserSchema = Yup.object().shape({
    fullname: Yup.string().required('Name is required'),
    email: Yup.string().email(),
    phone: Yup.string(),//.required('Phone number is required'),
    last_name: Yup.string(),
    role_id: Yup.string().required('Role Number is required'),
    password: Yup.string(),
    parent_id: Yup.string(),
    branches: Yup.array().min(1).required("Branch Is required")
  });

  const defaultValues = useMemo(
    () => ({
      fullname: currentUser?.fullname || '',
      email: currentUser?.email || '',
      phone: currentUser?.phone || '',
      last_name: currentUser?.last_name || '',
      role_id: currentUser?.role_id || '',
      parent_id: currentUser?.parent_id || '',
      branches: currentUser?.branchesList || []
    }),
    [currentUser]
  );

  const methods = useForm({
    resolver: yupResolver(NewUserSchema),
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
    if (isEdit && currentUser) {
      reset(defaultValues);
    }
    if (!isEdit) {
      reset(defaultValues);
    }
  }, [isEdit, currentUser]);

  const getBranchSelections = () => {
    let newBranches = [];
    let delBranches = []
    if (!currentUser?.id) {
      newBranches = values?.branches;
      return { newBranches, delBranches }
    }
    newBranches = values?.branches?.filter((ss) => {
      if (currentUser?.branches?.find((cc) => cc?.branch_id == ss.id)) {
        return false
      }
      return true;
    });
    delBranches = currentUser?.branches?.filter((cs) => {
      if (values?.branches?.find((ss) => ss.id == cs.branch_id)) {
        return false
      }
      return true
    }) || []
    return { newBranches, delBranches }
  }

  const onSubmit = async () => {
    // console.log(values);
    // return;
    try {
      setPageProgres(true);
      httpSer.post(`users/${currentUser?.id || ''}`, {
        ...values, ...getBranchSelections()
      }).then((res) => {
        setPageProgres(false);
        handleSuccess && handleSuccess(values);
        enqueueSnackbar('Created Successfully');
      }).catch((err) => {
        setPageProgres(false);
        enqueueSnackbar(errorTrans(err), { variant: 'error' });
      });
    } catch(err) {
      console.log(err)
      enqueueSnackbar('Error Occured!', { variant: 'error' });
    }
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={12}>
          <Card sx={{ p: 3 }}>
            <Box
              sx={{
                display: 'grid',
                columnGap: 2,
                rowGap: 3,
                gridTemplateColumns: { xs: 'repeat(1, 1fr)', sm: 'repeat(2, 1fr)' },
              }}
            >
              <RHFTextField name="fullname" label="Full Name" />
              <RHFTextField name="last_name" label="Last Name" />
              <RHFTextField name="email" label="Email Address" />
              <RHFTextField name="phone" label="Phone Number" />
              <RHFTextField name="password" label="Password" />
              <RHFMultiSelect name="branches" label="Branches"
                defaultOptions={currentUser?.branchesList || []} options={filterBranches(branches, user) || []} />

              <RHFSelect name="role_id" label="Role" placeholder="Role">
                <option value="" />
                {roles?.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.role_name}
                  </option>
                ))}
              </RHFSelect>
              {values?.role_id == Roles.Student && <RHFSelect name="parent_id" label="Parent" placeholder="Parent">
                <option value="" >  </option>
                {parents?.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.fullname}
                  </option>
                ))}
              </RHFSelect>
              }
            </Box>
            <Stack alignItems="flex-end" sx={{ mt: 3 }}>
              <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
                {currentUser ? 'Update' : 'Create'} User
              </LoadingButton>
            </Stack>
          </Card>
        </Grid>
      </Grid>
    </FormProvider>
  );
}

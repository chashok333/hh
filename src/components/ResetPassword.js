import React, { useEffect } from "react";
import { LoadingButton } from "@mui/lab";
import { Grid, TextField } from "@mui/material";
import { useFormik } from "formik";
import Iconify from "src/components/Iconify";
import * as Yup from 'yup';
import moment from "moment";
import httpSer from "src/utils/httpSer";
import { useSnackbar } from "notistack";

export default function ResetPassword({ user, handleClose }) {
    const { enqueueSnackbar } = useSnackbar();

    const formik = useFormik({
        initialValues: {
            password: ''
        },
        validationSchema: Yup.object().shape({
            password: Yup.string().min(5).required("Please Enter Password")
        }),
        onSubmit: async (values, { setErrors, setStatus, setSubmitting }) => {
            httpSer.post(`users/${user?.id || ''}/change-password`, {
                ...values
            }).then((resp) => {
                console.log(resp?.data?.message)
                enqueueSnackbar(resp?.data?.message)
                handleClose && handleClose()
            }).catch((err) => {
                console.log(err?.response)
                enqueueSnackbar(err?.response.data?.message || 'Error Occured', { variant: 'error' })

            });
        },
    });

    const { handleBlur, handleChange, handleSubmit, setFieldValue, values, isSubmitting, touched, errors, setSubmitting, setValues } = formik;

    const defaultProps = {
        color: "primary",
        variant: "outlined",
        onBlur: handleBlur,
        onChange: handleChange,
        type: "text",
        inputProps: {},
        size: 'medium'
    }


    return <form onSubmit={handleSubmit} >
        <Grid container spacing={1} px={3} my={5}>
            <Grid item xs={12}>
                <TextField
                    {...defaultProps}
                    id="outlined-adornment-to"
                    error={Boolean(touched.password && errors.password)}
                    fullWidth
                    value={values.password}
                    helperText={Boolean(touched.password) && errors.password}
                    name="password"
                    label="Password"
                />
            </Grid>

            <Grid item xs={12} textAlign={"right"}>
                <LoadingButton type="submit" size='large' variant="contained" loading={false}>
                    Change Password
                </LoadingButton>
            </Grid>
        </Grid>
    </form>
}
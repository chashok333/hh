import React, { useEffect } from "react";
import { FormControlLabel, Grid, IconButton, Switch, TextField } from "@mui/material";
import { Typography } from '@mui/material';
import Iconify from 'src/components/Iconify';
import BBAutocomplete from "src/components/BBAutocomplete";



const AttendeeReview = ({ student, defaultProps, handleAttendeeChange, subjects, weeks, levels, topics }) => {

    const handleStatusChange = () => {
        handleAttendeeChange({ ...student, attendance: !student?.attendance })
    }

    const handleCommentChange = (event) => {
        handleAttendeeChange({ ...student, comment: event?.target?.value })
    }
    const getTopic = (std) => {
        return topics?.find((t) => {
            return t?.subject_id == std?.subject_id && t?.week_id == std?.week_id && t?.level_id == std?.level_id;

        })?.topic || ''
    }
    const handleDepsChanges = (stdInfo) => {
        if (stdInfo?.level_id && stdInfo?.week_id && stdInfo?.subject_id) {
            stdInfo = { ...stdInfo, topic: getTopic(stdInfo) }
        }
        handleAttendeeChange({ ...stdInfo })
    }

    return <>
        <Grid item xs={12}>
            <Grid container xs={12} spacing={1}>
                <Grid item xs={1} >
                    <Typography variant="body" > {student?.user?.fullname} {student?.user?.last_name} : </Typography>
                </Grid>
                <Grid item xs={2}>
                    <BBAutocomplete onChange={(evnt, selected) => {
                        handleDepsChanges({ ...student, level_id: selected?.id })
                    }} customLabel={(o) => o.level_name}
                        defaultValue={levels?.find((l) => l?.id == student?.level_id)} label={"Level"} options={levels} error={false} />
                </Grid>
                <Grid item xs={2}>
                    <BBAutocomplete onChange={(evnt, selected) => {
                        handleDepsChanges({ ...student, week_id: selected?.id })
                    }} customLabel={(o) => o.week_name}
                        defaultValue={weeks?.find((l) => l?.id == student?.week_id)} label={"Week"} options={weeks} error={false} />
                </Grid>
                <Grid item xs={1}>
                    <BBAutocomplete onChange={(evnt, selected) => {
                        handleDepsChanges({ ...student, subject_id: selected?.id })
                    }} customLabel={(o) => o.subject_name}
                        defaultValue={subjects?.find((l) => l?.id == student?.subject_id)} label={"Subject"} options={subjects} error={false} />
                </Grid>
                <Grid item xs={3}>
                    <TextField
                        {...defaultProps}
                        id="outlined-adornment-title"
                        fullWidth
                        name="topic"
                        label="Topic"
                        value={student?.topic || ''}
                        disabled={student?.isDeleted ? true : false}
                        onChange={(event) => {
                            handleAttendeeChange({ ...student, topic: event?.target?.value || '' })
                        }}
                    />
                </Grid>
                <Grid item xs={2}>
                    <TextField
                        {...defaultProps}
                        id="outlined-adornment-title"
                        fullWidth
                        name="comment"
                        label="Comment"
                        value={student?.comment || ''}
                        disabled={student?.isDeleted ? true : false}
                        onChange={handleCommentChange}
                    />
                </Grid>
                <Grid item xs={1} sx={{ textAlign: 'center' }}>
                    <FormControlLabel
                        control={<Switch checked={student?.attendance ? true : false} onChange={() => {
                            handleStatusChange()
                        }} />}
                        label=""
                    />
                    <IconButton size="large" onClick={() => {
                        handleAttendeeChange({ ...student, isDeleted: !student?.isDeleted })
                    }} >
                        <Iconify icon={student?.isDeleted ? 'eva:eye-fill' : 'eva:close-fill'} size="small" color="#006097" width={20}
                            sx={{ cursor: 'pointer' }}
                            height={20} />
                    </IconButton>
                </Grid>
            </Grid>
        </Grid>
    </>
}

export default AttendeeReview;
// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack, Button, Checkbox, Autocomplete, TextField, DialogTitle, Box, Badge, IconButton } from '@mui/material';

import PeopleIcon from '@mui/icons-material/People';
import CloseIcon from '@mui/icons-material/Close';
// assets
import { useCallback, useEffect, useState } from 'react';
import httpSer from 'src/utils/httpSer';
import useAuth from 'src/hooks/useAuth';
import { DatePicker } from '@mui/lab';
import ScheduleUserForm from './ScheduleUserForm';
import { DialogAnimate } from './animate';
import useBbgUsers from 'src/hooks/bbgUsers';
import BBAutocomplete from './BBAutocomplete';
import ScheduleUser from './schedules/ScheduleUser';
import moment from 'moment';
import { dayOptions } from 'src/pages/users/constants';
import { set } from 'lodash';
import Abvs from './schedules/Abvs';

const weeks = ["Sunday", "Monday", 'Tuesday', "Wednesday", "Thursday", "Friday", "Saturday"];

//----------------------------------------------------------------------

export default function SchedulePlan({
    currentUser
}) {
    const { user } = useAuth();
    const [userSchedule, setUserSchedule] = useState([]);
    const [modalInfo, setModalInfo] = useState(null);
    const { usersList } = useBbgUsers();
    const [scheduleDate, setScheduleDate] = useState(null);

    const [daysInMonth, setDaysInMonth] = useState([]);
    const [weekDays, setWeekDays] = useState(null);
    const [dataByMonth, setDataByMonth] = useState(null)

    const handleCloseForm = (...args) => {
        console.log(args)
        setModalInfo(null)
    }

    function groupDatesByWeek(dates) {
        let groupedWeeks = {};

        dates.forEach(date => {
            let weekNum = moment(date, "YYYY-MM-DD").week();

            if (!groupedWeeks[weekNum]) {
                groupedWeeks[weekNum] = [];
            }

            groupedWeeks[weekNum].push(date);
        });

        return groupedWeeks;
    }

    const loadMonthData = () => {

        httpSer.post("/schedules/by-month", {
            from: new Date(moment(scheduleDate).startOf('month').format("YYYY-MM-DD")).setHours(0, 0, 0, 0),
            to: new Date(moment(scheduleDate).endOf('month').format("YYYY-MM-DD")).setHours(23, 59, 59, 0)
        }).then((r) => r.data).then((resp) => {
            setDataByMonth(resp);
            renderCalender()
        })
    }

    const getCountForDay = (day) => {

        return dataByMonth?.filter((d) => moment(d?.schedule_date).isSame(moment(day))).length;
    }

    const renderCalender = () => {
        if (!scheduleDate) return;
        let currentMonthDates = new Array(moment(scheduleDate).daysInMonth()).fill(null).map((x, i) => moment(scheduleDate).startOf('month').add(i, 'days'));
        currentMonthDates = currentMonthDates?.map((m) => (m.format("YYYY-MM-DD")));
        setDaysInMonth(currentMonthDates);
        let byWeeks = groupDatesByWeek(currentMonthDates);
        setWeekDays(byWeeks || []);

    }

    useEffect(() => {
        if (scheduleDate)
            loadMonthData();
    }, [scheduleDate])


    const handleSuccess = () => {
        handleCloseForm();
        loadMonthData();
    }


    return (

        <Grid container spacing={3}>
            <Grid item xs={12} md={12} sx={{
                mt: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3
            }}>

                <Box>
                    <DatePicker
                        inputFormat="MMM-yyyy"
                        views={['year', 'month']}
                        openTo="month"
                        value={scheduleDate}
                        name={"scheduleDate"}
                        label={"Schedule Date"}
                        onChange={(val) => {
                            setScheduleDate(val)
                        }}
                        renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                </Box>

            </Grid>
            <Grid item xs={12}>
                <Grid sx={{ display: 'flex', mb: 2, justifyContent: 'center', alignItems: 'center' }} >
                    {dayOptions.map((day, index) => {
                        return <Box key={index + "aaa"} sx={{ minWidth: 130, textAlign: 'center' }}>{day.label}</Box>
                    })}
                </Grid>
                {weekDays && Object.entries(weekDays).map((entry, index) => {
                    let daysData = entry[1];
                    return <Grid key={`${index}-day`} sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        {dayOptions?.map((d, i) => {
                            let day = daysData.find((dd) => moment(dd).format('d') == d?.value);
                            if (day) {
                                let isSameDay = getCountForDay(day);
                                return <Box key={`${i}-vv`} sx={{
                                    minWidth: 130, minHeight: 100, border: '1px solid #8080803b',
                                    ...{ backgroundColor: isSameDay ? 'rgb(99 115 129 / 15%)' : '' },
                                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                                }}>
                                    <Grid
                                        sx={{
                                            cursor: 'pointer',
                                            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 1
                                        }}
                                        onClick={() => {
                                            setModalInfo({ open: true, data: { date: day } })
                                        }}>
                                        <Box>{moment(day).format("DD-MMM")}</Box>

                                        {isSameDay ? <Badge badgeContent={isSameDay} color="success">
                                            <PeopleIcon color="action" />
                                        </Badge> : ''}
                                    </Grid>
                                </Box>
                            }
                            return <Box key={`${i}-vvv`} sx={{ minWidth: 130, minHeight: 100, border: '1px solid #8080803b' }}></Box>
                        })}
                    </Grid>

                })}
            </Grid>


            <DialogAnimate fullWidth={true}
                sx={{
                    p: 2,
                    minHeight: 600
                }}
                maxWidth={'xl'} open={modalInfo?.open ? true : false}
                onClose={(_, reason) => {
                    if (reason !== 'backdropClick')
                        handleCloseForm()
                }}
            >
                <DialogTitle sx={{ marginBottom: 3, textAlign: 'center', fontSize: "25px" }}>Shift Details For :  {moment(modalInfo?.data?.date).format("DD-MMM")}

                    <IconButton
                        aria-label="close"
                        onClick={handleCloseForm}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                            color: (theme) => theme.palette.grey[500],
                        }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <Abvs scheduleDate={modalInfo?.data?.date} usersList={usersList} handleSuccess={handleSuccess}></Abvs>
            </DialogAnimate>
        </Grid>
    );
}

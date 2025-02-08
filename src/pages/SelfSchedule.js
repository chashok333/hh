// @mui
import { styled } from '@mui/material/styles';
import { Grid, Container, Badge, Box, Typography, TextField, DialogTitle, IconButton, DialogContent } from '@mui/material';
// _mock
import { _mapContact } from '../_mock';
// components
import Page from '../components/Page';
import CBanner from 'src/sections/CBanner';
import { useEffect, useState } from 'react';
import httpSer from 'src/utils/httpSer';
import moment from 'moment';
import { dayOptions } from './users/constants';
import { groupDatesByWeek } from 'src/common/commonMethods';
import PeopleIcon from '@mui/icons-material/People';
import CloseIcon from '@mui/icons-material/Close';
import useAuth from 'src/hooks/useAuth';
import { DatePicker } from '@mui/lab';
import { DialogAnimate } from 'src/components/animate';
import EmpScheduleView from 'src/components/schedules/EmpScheduleView';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(8),
    [theme.breakpoints.up('md')]: {
        paddingTop: theme.spacing(11),
    },
}));

// ----------------------------------------------------------------------

export default function SelfSchedule() {
    const { user } = useAuth();
    const [scheduleDate, setScheduleDate] = useState(new Date());
    const [data, setData] = useState([]);
    const [daysInMonth, setDaysInMonth] = useState([]);
    const [weekDays, setWeekDays] = useState(null);
    const [modalInfo, setModalInfo] = useState(null)

    const loadMySchedules = () => {
        httpSer.get("/schedules/by-emp", {
            params: {
                from: moment(scheduleDate).startOf('month').format("YYYY-MM-DD"),
                to: moment(scheduleDate).endOf('month').format("YYYY-MM-DD")
            }
        }).then((r) => r.data).then((resp) => {
            setData(resp);
            renderCalender()
        })
    }
    const renderCalender = () => {
        if (!scheduleDate) return;
        let currentMonthDates = new Array(moment(scheduleDate).daysInMonth()).fill(null).map((x, i) => moment(scheduleDate).startOf('month').add(i, 'days'));
        currentMonthDates = currentMonthDates?.map((m) => (m.format("YYYY-MM-DD")));
        setDaysInMonth(currentMonthDates);
        let byWeeks = groupDatesByWeek(currentMonthDates);
        setWeekDays(byWeeks || []);

    }

    const getCountForDay = (day) => {

        return data?.find((d) => moment(d?.schedule_date).isSame(moment(day)));
    }
    const handleCloseModal = () => {
        setModalInfo(null)
    }

    useEffect(() => {
        loadMySchedules()
    }, [scheduleDate])

    return (
        <Page title="Contact us">
            <RootStyle>
                <Grid container sx={{ mt: 2 }} spacing={10}>

                    <Grid item xs={12} md={12} sx={{
                        mt: 2, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 3
                    }}>
                        <Typography variant="h4" sx={{ textAlign: 'center' }}>Hi, {user?.first_name}</Typography>
                        <Box>
                            <DatePicker
                                inputFormat="MMM-yyyy"
                                views={['year', 'month']}
                                openTo="month"
                                value={scheduleDate}
                                name={"scheduleDate"}
                                label={"Month"}
                                onChange={(val) => {
                                    setScheduleDate(val)
                                }}
                                renderInput={(params) => <TextField {...params} fullWidth />}
                            />
                        </Box>

                    </Grid>
                    <Grid item xs={12} sx={{
                        overflowX: 'auto', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                    }}>
                        <Grid sx={{ display: 'flex', mb: 2, justifyContent: 'center', alignItems: 'center' }} >
                            {dayOptions.map((day, index) => {
                                return <Box key={index + "aaa"} sx={{ minWidth: 90, textAlign: 'center' }}>{day.label?.substring(0, 3)}</Box>
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
                                            minWidth: 90, minHeight: 90, border: '1px solid #8080803b',
                                            ...{ backgroundColor: isSameDay ? 'rgb(99 115 129 / 15%)' : '' },
                                            display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'
                                        }}>
                                            <Grid
                                                sx={{
                                                    cursor: 'pointer',
                                                    display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 1
                                                }}
                                               >
                                                <Box>{moment(day).format("DD-MMM")}</Box>

                                                {isSameDay ? <Badge  onClick={() => {
                                                    setModalInfo({ open: true, data: isSameDay })
                                                }} badgeContent={1} color="success">
                                                    <PeopleIcon color="action" />
                                                </Badge> : ''}
                                            </Grid>
                                        </Box>
                                    }
                                    return <Box key={`${i}-vvv`} sx={{ minWidth: 90, minHeight: 90, border: '1px solid #8080803b' }}></Box>
                                })}
                            </Grid>

                        })}
                    </Grid>
                </Grid>
            </RootStyle>
            <DialogAnimate fullWidth={true}
                sx={{
                    p: 2,
                    minHeight: 600
                }}
                maxWidth={'xl'} open={modalInfo?.open ? true : false}
                onClose={(_, reason) => handleCloseModal()}
            >
                <DialogTitle sx={{ marginBottom: 3, textAlign: 'center', fontSize: "25px" }}>Edit Schedule

                    <IconButton
                        aria-label="close"
                        onClick={handleCloseModal}
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
                <DialogContent>
                    <EmpScheduleView handleSuccess={() => {
                        handleCloseModal();
                        loadMySchedules();
                    }} date={modalInfo?.data?.schedule_date} user={modalInfo?.data?.user} data={modalInfo?.data} />
                </DialogContent>

            </DialogAnimate>
        </Page>
    );
}

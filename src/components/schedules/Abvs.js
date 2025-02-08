// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack, Button, Checkbox, Autocomplete, TextField, DialogTitle, Box, Typography, LinearProgress } from '@mui/material';
// hooks

import { useCallback, useEffect, useState } from 'react';
import httpSer from 'src/utils/httpSer';
import useAuth from 'src/hooks/useAuth';
import { DatePicker } from '@mui/lab';
import useBbgUsers from 'src/hooks/bbgUsers';
import ScheduleUser from './ScheduleUser';
import moment from 'moment';
import { dayOptions } from 'src/pages/users/constants';
import { set } from 'lodash';
import BBAutocomplete from '../BBAutocomplete';

const Abvs = ({
    scheduleDate,
    usersList,
    handleSuccess
}) => {
    const [userSchedule, setUserSchedule] = useState([]);

    const [selectedUsers, setSelectedUsers] = useState([]);

    const [loader, setLoader] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadSchedules();
    }, [])

    const loadSchedules = () => {
        setLoader(true);
        httpSer.get("/schedules", {
            params: {
                date: moment(scheduleDate).format("YYYY-MM-DD"),
                from: new Date(scheduleDate).setHours(0, 0, 0, 0),
                to: new Date(scheduleDate).setHours(23, 59, 59, 999)
            }
        }).then((r) => r.data).then((resp) => {
            setSelectedUsers(usersList?.filter((ul) => {
                return resp.find((eu) => eu?.user?.id == ul?.id)
            }));
            setLoader(false)
            setUserSchedule(resp);
        }).catch((error) => {
            setLoader(false)
        })
    }

    const saveSchedule = () => {
        setLoader(true);
        httpSer.post("/schedules/users", {
            scheduleDate, users: userSchedule
        }).then(() => {
            setLoader(false);
            handleSuccess?.()
        }).catch((error) => {
            setLoader(false);
        })
    }
    const handleUpdateSheduleUser = (updated) => {
        setUserSchedule(userSchedule?.map((sd) => {
            if (sd?.user?.id == updated?.user?.id) return updated;

            return sd;
        }))
    }

    const handleUpdateUsersList = (newUsers = [], removedUsers = []) => {

        if (newUsers?.length) {
            setUserSchedule([
                ...userSchedule,
                ...newUsers?.map((nu) => ({
                    user: nu, from: scheduleDate, to: scheduleDate, gap_time: 0
                }))

            ])
        }
        if (removedUsers?.length) {
            setUserSchedule(userSchedule?.filter((eu) => {
                if (removedUsers?.some(ru => ru?.id == eu?.user?.id))
                    return false

                return true;
            }))
        }
    }


    return <Grid container>
        <Grid item xs={12} sx={{
            display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 3
        }}>
            <BBAutocomplete multiple disabled={!Boolean(scheduleDate)} fullWidth
                id="users"
                name="users"
                getOptionDisabled={(option) => {
                    if (!option?.status) return true
                    let day = scheduleDate ? moment(scheduleDate).format("dddd") : '';
                    return !Boolean(option?.slots?.find((s) => {
                        return s.day == day && s.working
                    }))
                }
                }
                onChange={(evnt, selected) => {
                    setSelectedUsers(selected);
                    const addedUsers = selected.filter(user => !selectedUsers.some(u => u.id === user.id));
                    const removedUsers = selectedUsers.filter(user => !selected.some(u => u.id === user.id));
                    handleUpdateUsersList(addedUsers, removedUsers)
                }}
                value={selectedUsers}
                label={"Users"}
                options={usersList || []} />

            <Button onClick={() => {
                saveSchedule()

            }} variant="contained" sx={{
                mr: 2
            }} >Save Schedule</Button>

        </Grid>
        <Box sx={{ width: '100%', p: 1 }}>
            {loader && <LinearProgress />}
        </Box>
        <Grid item xs={12}>
            <Box container >
                {userSchedule?.map((sd, index) => {
                    return <ScheduleUser key={index} index={index} user={sd?.user} data={sd} date={scheduleDate} handleUpdate={handleUpdateSheduleUser} />
                })}
            </Box>
            {userSchedule?.length == 0 && <Box container sx={{
                display: 'flex', justifyContent: 'center', alignItems: 'center', height: 200
            }}>
                <Typography sx={{ textAlign: 'center', fontSize: "35px", fontWeight: 900 }}>{userSchedule?.length == 0 ? "No Schedules Found" : ""}</Typography>
            </Box>}
        </Grid>

    </Grid>
}



export default Abvs;
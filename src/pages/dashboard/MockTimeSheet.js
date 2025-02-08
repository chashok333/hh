// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack, Button, Checkbox, Autocomplete, TextField } from '@mui/material';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// components
import Page from '../../components/Page';

// assets
import { SeoIllustration } from '../../assets';
import MockTimeSheetRow from './WeekRow';
import { useCallback, useEffect, useState } from 'react';
import httpSer from 'src/utils/httpSer';

const weeks = ["Sunday", "Monday", 'Tuesday', "Wednesday", "Thursday", "Friday", "Saturday"];

//----------------------------------------------------------------------

export default function MockTimeSheet({
    currentUser, 
    handleSuccess
}) {
    const { user } = useAuth();
    const [slots, setSlots] = useState(currentUser?.slots || []);


    const updateSlots = (newVal) => {
        if (slots?.find((s) => s.day == newVal?.day)) {
            setSlots(slots?.map((s) => {
                if (s.day == newVal?.day) {
                    return newVal;
                } else {
                    return s;
                }
            }))

        } else {
            setSlots([...slots, newVal])
        }
    }
    const saveSlot = useCallback(() => {
        httpSer.post("/slots", {
            user_id: currentUser?.id,
            data: slots
        }).then(() => {
            handleSuccess?.()
            
        })
    }, [slots])

    return (

        <Grid container spacing={3}>
            <Grid item xs={12} md={12} sx={{
                display: 'flex', flexDirection: 'column', gap: 3
            }}>
                {weeks.map((day, index) => {
                    return <MockTimeSheetRow key={day} onChangeRow={(newVal) => {
                        updateSlots(newVal)
                    }} data={slots?.find((s) => s.day == day) || { day, from: "", to: "", hrs: "" }} day={day} index={index} />
                })}

                <Button onClick={saveSlot} variant="contained" sx={{
                    mr: 3
                }} >Save</Button>

            </Grid>
        </Grid>
    );
}

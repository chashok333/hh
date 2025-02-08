// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack, Button, Checkbox, Autocomplete, TextField } from '@mui/material';
// hooks
const timings = ["10:00", "10:30", "11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00", "18:30", "19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30", "23:00"];

// ----------------------------------------------------------------------

export default function MockTimeSheetRow({
    day, index,
    data,
    onChangeRow
}) {




    return (

        <Grid sx={{ display: 'flex', gap: 2, display: 'flex',  justifyContent: 'center', alignItems: 'center' }} key={day}>
            <Grid variant="span" sx={{ minWidth: 150, }}>{day}</Grid>
            <Checkbox checked={Boolean(data?.working)} label="Working" onChange={() => {
                onChangeRow({ ...data, working: !data?.working })
            }} />
            {/* <Autocomplete
                disablePortal
                id="from"
                options={timings}
                value={data?.from || ""}
                onChange={(event, newValue) => {
                    console.log(newValue);
                    onChangeRow({ ...data, from: newValue })
                }}
                sx={{ minWidth: 150 }}
                renderInput={(params) => <TextField {...params} variant='standard' label="From" />}
            />
            <Autocomplete
                disablePortal
                id="to"
                options={timings}
                value={data?.to || ""}
                onChange={(event, newValue) => {
                    console.log(newValue);
                    onChangeRow({ ...data, to: newValue })
                }}
                sx={{ minWidth: 150 }}
                renderInput={(params) => <TextField {...params} variant='standard' label="To" />}
            />
            <TextField id="hrs" label="Total hrs"  value={data?.hrs || ""} variant="standard" onChange={(event) => {
                onChangeRow({ ...data, hrs: event.target?.value })
            }} /> */}
        </Grid>
    );
}

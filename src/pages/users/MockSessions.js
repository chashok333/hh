import { Accordion, Typography, AccordionSummary, AccordionDetails, Chip, Badge } from '@mui/material';
import moment from 'moment';
import Iconify from 'src/components/Iconify';
// import Chip from 'src/theme/overrides/Chip';
// components
import PeopleIcon from '@mui/icons-material/People';
// import Iconify from 'components/Iconify';
import { dayOptions } from './constants';

// ----------------------------------------------------------------------


export default function MockSessions({ days, branch, teacher, sessions, onClickHandler, ...other }) {
    const timeTransform = (time) => {
        return new Date(`${moment().format("MM DD YYYY")}  ${time}`)
    }
    const getLabel = (session) => {
        return <><Typography sx={{
            py: 6
        }}>
            {session?.teacher?.fullname} | {moment(timeTransform(session?.from_time)).format("hh:mm a")} -  {moment(timeTransform(session?.to_time)).format("hh:mm a")}
            <Badge badgeContent={session?.students?.length || 0} color="primary" sx={{ pl: 2 }}>
                <PeopleIcon color="action" />
            </Badge>
        </Typography></>
    }

    const getFilteredSlots = (accordion) => {
        return sessions?.filter((s) => s.week_day == accordion.id).filter((s) => {
            if (!branch?.id) {
                return true;
            }
            return branch?.id == s?.branch_id;
        }).filter((s) => {
            if (!teacher?.id) {
                return true;
            }
            return teacher?.id == s?.teacher_id;
        })
    }
    return (<>
        {
            days?.map((accordion) => (
                <Accordion key={accordion.id} sx={{ mb: 3 }}>
                    <AccordionSummary sx={{ background: 'rgba(145, 158, 171, 0.12)' }}
                        expandIcon={<Iconify icon={'eva:arrow-ios-downward-fill'} width={20} height={20} />}
                    >
                        <Typography variant="subtitle1">{accordion.label} ({getFilteredSlots(accordion)?.length} Slots)</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                        {getFilteredSlots(accordion)?.map((session, i) => <Chip key={`slot-${i}`} onClick={() => {
                            onClickHandler && onClickHandler(session)
                        }} label={getLabel(session)} text={"aasas"} variant="outlined" sx={{ m: 0.5, p: 1 }} />)}

                    </AccordionDetails>
                </Accordion>
            ))
        }</>
    );
}


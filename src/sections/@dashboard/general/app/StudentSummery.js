import React, { useEffect, useState } from 'react';
import { Box, Stepper, Step, StepLabel, StepContent, Button, Paper, Typography, Chip } from '@mui/material';
import useBbgUsers from 'src/hooks/bbgUsers';
import moment from 'moment';
import Label from 'src/components/Label';
import Iconify from 'src/components/Iconify';


export default function StudentSummery({ data, setOpenMail }) {
    const [activeStep, setActiveStep] = React.useState(0);
    const { levels, weeks } = useBbgUsers();
    const [levelsCopy, setLevelsCopy] = useState(levels || []);


    useEffect(() => {
        setLevelsCopy(levels)
    }, [levels])

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };
    const RenderSubject = ({ subData }) => {
        return 1
    }

    const RenderWeek = ({ weekData }) => {
        return weekData?.map((w) => <>
            <Chip label={w?.week?.week_name} />
            {w.records?.map((r) => <Typography sx={{ pl: 4, py: 1 }}><Label color="info" sx={{ ml: 1 }}>
                {r?.subject?.subject_name}
            </Label>
                <Label color="error">{moment(r.start_date).format("MMM Do YYYY")}</Label>  -
                {r?.mistakes?.map((m) => m.mistakes)?.join(", ")} {r.comments ? ` : ${r.comments}` : ''}
                <Button startIcon={<Iconify icon={'eva:email-fill'} />} onClick={() => { setOpenMail({ open: true, item: r }) }}></Button>
            </Typography>)}
        </>)
    }
    const RenderLevel = ({ levelData }) => {
        return <RenderWeek weekData={weeks?.filter((w) => levelData?.find((g) => g.week_id == w.id))?.map((w) => ({ week: w, records: levelData.filter((r) => r.week_id == w.id) }))} />
    }

    let dataLevels = data?.map((dl) => +dl.level_id) || [];

    return (
        <Box>
            <Stepper orientation="vertical">
                {levelsCopy?.filter((l) => dataLevels?.includes(l.id)).map((step, index) => {
                    let levelData = data?.filter((g) => g.level_id == step?.id);
                    return (
                        <Step key={step.label} active={levelData?.length ? !step.hide : 0}>
                            <StepLabel sx={{ cursor: 'pointer' }} onClick={() => {
                                setLevelsCopy(levelsCopy?.map((l) => {
                                    return {
                                        ...l,
                                        hide: l.id == step.id ? !l.hide : l.hide
                                    }
                                }))
                            }}>
                                {step.level_name} {levelData?.length ? <Iconify icon={`eva:chevron-${step.hide ? 'up' : 'down'}-fill`} sx={{
                                    cursor: 'pointer'
                                }} /> : null}
                            </StepLabel>

                            <StepContent>
                                <RenderLevel levelData={levelData || []} />
                            </StepContent>
                        </Step>
                    )
                })}
            </Stepper>
        </Box >
    );
}

import { Box, CardContent, Card, CardHeader, Grid, Paper, Typography, TextField } from "@mui/material";
import React, { useEffect } from "react";
import { minutesToHours } from "src/common/commonMethods";
import { UserCard } from "../../user/cards";

export default function TimeSheetSummery({ title, subheader, data, ...other }) {
    useEffect(() => {
        console.log(data)
    }, [])
    return <>
        <Card {...other}>
            <CardHeader title={title} subheader={subheader} />

            <CardContent>
                <Box
                    sx={{
                        display: 'grid',
                        gap: 3,
                        gridTemplateColumns: 'repeat(3, 1fr)',
                    }}
                >
                    {data?.map((userDet) => (
                        <Paper key={userDet?.user?.id} variant="outlined" sx={{ py: 2.5, textAlign: 'center' }}>
                            <Typography variant="h6"> {userDet?.user?.fullname} {userDet?.user?.last_name} </Typography>
                            {Object.entries(userDet?.groups).map((res) => {
                                return <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {res[0]} : {minutesToHours(res[1]?.reduce((a, b) => +a + +b.hours, 0))}
                                </Typography>
                            })}

                        </Paper>
                    ))}
                </Box>
            </CardContent>
        </Card>
    </>
}

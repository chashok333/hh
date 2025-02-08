import { m } from 'framer-motion';
// @mui
import { alpha, useTheme, styled } from '@mui/material/styles';
import { Box, Card, Container, Typography } from '@mui/material';
// components
import Image from '../../components/Image';
import { MotionViewport, varFade } from '../../components/animate';

// ----------------------------------------------------------------------



const shadowIcon = (color) => `drop-shadow(2px 2px 2px ${alpha(color, 0.48)})`;

const RootStyle = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(15),
    [theme.breakpoints.up('md')]: {
        paddingBottom: theme.spacing(15),
    },
}));


// ----------------------------------------------------------------------

export default function AppDev() {
    const theme = useTheme();

    const isLight = theme.palette.mode === 'light';

    return (
        <RootStyle>
            <Container component={MotionViewport}>
                <Box
                    sx={{
                        textAlign: 'center',
                        mb: { xs: 10, md: 25 },
                    }}
                >
                    {/* <m.div variants={varFade().inDown}>
                        <Typography variant="h2" sx={{mb:5}}>Application Development</Typography>
                    </m.div> */}
                    <m.div variants={varFade().inUp}>
                        <Typography component="div" variant="overline" sx={{ mb: 2, lineHeight: 2 }}>
                            AdvanSoft’s Applications Management (AM) service offering provides organizations with a flexible set of solutions spanning the entire system life cycle. The key objectives are to help organizations focus on core business issues, reduce costs, improve IT operational efficiency, accelerate time-to-market and free existing staff to focus on mission-critical initiatives. Specific offerings include applications enhancement, applications maintenance, user support and service management.
                        </Typography>
                        <Typography component="div" variant="overline" sx={{ mb: 2, lineHeight: 2 }}>
                            AdvanSoft can deliver AM services on-site, off-site or offshore, depending on business requirements.

                        </Typography>
                        <Typography component="div" variant="overline" sx={{ mb: 2, lineHeight: 2 }}>
                            Technology applications are the empowering foundation of your business. They affect competitiveness and enable organizational vitality by delivering information and functionality to key customers, employees and business partners. We offer you a flexible AM service offering to choose from, all delivered across the full continuum of the life cycle.
                        </Typography>
                        <Typography component="div" variant="overline" sx={{ mb: 2, lineHeight: 2 }}>
                            Increasingly complex applications portfolios, high maintenance costs, and scarce applications support skills can significantly distract attention from competitive issues. Cost management expectations and the continuing need to upgrade applications are driving organizations to explore our AM service offerings.

                        </Typography>
                        <Typography component="div" variant="overline" sx={{ mb: 2, lineHeight: 2 }}>
                            Our AM clients are realizing tremendous benefits in cost containment, productivity improvements, staff retention and speed to market. Our AM service offering is designed to respond to your challenge of finding, enlightening and retaining the technical talent required to manage and enhance critical technology applications. The result ? Improved efficiency, application value, timeliness and controllable costs.

                        </Typography>
                    </m.div>
                </Box>

            </Container>
        </RootStyle>
    );
}

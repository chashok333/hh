// @mui
import { styled } from '@mui/material/styles';
import { Divider, Typography } from '@mui/material';
// components
import Page from '../components/Page';
import { HomeMinimal } from 'src/sections/home';
import AppDev from 'src/sections/ad/AppDev';
import CBanner from 'src/sections/CBanner';
// import Typography from 'src/theme/overrides/Typography';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
    paddingTop: theme.spacing(8),
    [theme.breakpoints.up('md')]: {
        paddingTop: theme.spacing(11),
    },
}));

// ----------------------------------------------------------------------

export default function ApplocationDev() {
    return (
        <Page title="About us">
            <RootStyle>
                <CBanner title={"Application Development"} />
                <AppDev />
            </RootStyle>
        </Page>
    );
}

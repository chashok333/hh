// @mui
import { useTheme } from '@mui/material/styles';
import { Container, Grid, Stack, Button } from '@mui/material';
// hooks
import useAuth from '../../hooks/useAuth';
import useSettings from '../../hooks/useSettings';
// _mock_
import { _appFeatured, _appAuthors, _appInstalled, _appRelated, _appInvoices } from '../../_mock';
// components
import Page from '../../components/Page';

// assets
import { SeoIllustration } from '../../assets';
import MockTimeSheet from './MockTimeSheet';
import SchedulePlan from 'src/components/SchedulePlan';

// ----------------------------------------------------------------------

export default function AdminDashboard() {
    const { user } = useAuth();

    const theme = useTheme();

    const { themeStretch } = useSettings();

    return (
        <Page title="Latest Entries">
            <Container maxWidth={themeStretch ? false : 'xl'}>
                <Grid container spacing={3}>
                    <Grid item xs={12} md={12}>
                        <SchedulePlan />
                    </Grid>
                </Grid>
            </Container>
        </Page>
    );
}

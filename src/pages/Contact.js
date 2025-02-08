// @mui
import { styled } from '@mui/material/styles';
import { Grid, Container } from '@mui/material';
// _mock
import { _mapContact } from '../_mock';
// components
import Page from '../components/Page';
import { ContactHero, ContactForm, ContactMap } from '../sections/contact';
import CBanner from 'src/sections/CBanner';

// ----------------------------------------------------------------------

const RootStyle = styled('div')(({ theme }) => ({
  paddingTop: theme.spacing(8),
  [theme.breakpoints.up('md')]: {
    paddingTop: theme.spacing(11),
  },
}));

// ----------------------------------------------------------------------

export default function Contact() {
  return (
    <Page title="Contact us">
      <RootStyle>
        {/* <ContactHero /> */}
        <CBanner title="Contact Us" subText={"Address : 625 Hyacinthe Blvd, Mississauga, ON L5A2C6"} />

        <Container sx={{ my: 10 }}>
          <Grid container spacing={10}>
          <Grid item xs={12} md={3}>
             
            </Grid>
            <Grid item xs={12} md={6}>
              <ContactForm />
            </Grid>
            <Grid item xs={12} md={3}>
              
            </Grid>


            {/* <Grid item xs={12} md={6}>
              <ContactMap contacts={_mapContact} />
            </Grid> */}
          </Grid>
        </Container>
      </RootStyle>
    </Page>
  );
}

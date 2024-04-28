
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
import RecentTransactions from './recent-transactions-table'; // Assuming the extension is .jsx, adjust accordingly if it's different

// ----------------------------------------------------------------------

export default function AppView() {
  return (
    <Container maxWidth="xl">

      <Grid container spacing={3}>
      <Grid lg={3} sm={6} xs={12}>
          <AppWidgetSummary
            title="All Expense"
            total={18000}
            color="success"
            backgroundColor="#fffbd9"
            icon={<img src='/assets/requested.png' alt='Requested' height='56px' width='56px'/>}
          />
        </Grid>

        <Grid lg={3} sm={6} xs={12}>
          <AppWidgetSummary
            title="Approved"
            total={18000}
            color="info"
            backgroundColor="#e6fce6"
            icon={<img src='/assets/approved.png' alt='Approved' height='56px' width='56px'/>}
          />
        </Grid>

        <Grid lg={3} sm={6} xs={12}>  
          <AppWidgetSummary
            title="Rejected"
            total={18000}
            color="warning"
            backgroundColor="#ffd3d9"
            icon={<img src='/assets/rejected.png' alt='Rejected' height='56px' width='56px'/>}
          />
        </Grid>

        

        <Grid xs={12} md={6} lg={8}>
        <Typography fontSize="1.85rem" sx={{ marginBottom: 2 }}>Expense Report</Typography>
        
          <AppWebsiteVisits
            title=""
            subheader=""
            chart={{
              labels: [
                'Flats',
                'Houses',
                'Cars',
                'Bills',
                'laptops',
              ],
              series: [
                {
                  name: '',
                  type: 'column',
                  fill: 'solid',
                  data: [2.5, 1.5, 3, 2, 2.5, 4, 3, 3.5],
                },
                
              ],
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
        <Typography fontSize="1.85rem" sx={{ marginBottom: 2, color: '#333' }}>Expense By Categories</Typography>
        
          <AppCurrentVisits
            title=""
            chart={{
              series: [
                { label: 'Rent', value: 4344 },
                { label: 'Vehicle', value: 5435 },
                { label: 'Flat', value: 1443 },
                { label: 'Laptops', value: 4443 },
              ],
            }}
          />
        </Grid>

        <Grid lg={12} md={6} xs={12}>
          <Typography fontSize="1.85rem" sx={{ marginBottom: 2 }}>Recent Transactions</Typography>
          <RecentTransactions/>
        </Grid>

      </Grid>
    </Container>
  );
}

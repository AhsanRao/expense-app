import { useState, useEffect } from 'react';

import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import {
  // fetchExpenseData,
  // fetchCategoryData,
  fetchTotalExpenses,
  fetchExpenseLabels,
  fetchExpenseSeries,
  fetchApprovedExpenses,
  fetchRejectedExpenses,
} from 'src/services/firebaseServices';

import AppCurrentVisits from '../app-current-visits';
import AppWebsiteVisits from '../app-website-visits';
import AppWidgetSummary from '../app-widget-summary';
import RecentTransactions from './recent-transactions-table';

// ----------------------------------------------------------------------

export default function AppView() {
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [approvedExpenses, setApprovedExpenses] = useState(0);
  const [rejectedExpenses, setRejectedExpenses] = useState(0);
  // const [expenseData, setExpenseData] = useState({ series: [], labels: [] });
  // const [categoryData, setCategoryData] = useState([]);
  const [labels, setLabels] = useState([]);
  const [series, setSeries] = useState([]);
  // Fetch data from backend
  useEffect(() => {
    const fetchData = async () => {
      const fetchedTotalExpenses = await fetchTotalExpenses();
      const fetchedApprovedExpenses = await fetchApprovedExpenses();
      const fetchedRejectedExpenses = await fetchRejectedExpenses();
      // const fetchedExpenseData = await fetchExpenseData();
      // const fetchedCategoryData = await fetchCategoryData();
      const fetchedLabels = await fetchExpenseLabels();
      const fetchedSeries = await fetchExpenseSeries();

      setTotalExpenses(fetchedTotalExpenses);
      setApprovedExpenses(fetchedApprovedExpenses);
      setRejectedExpenses(fetchedRejectedExpenses);
      // setExpenseData(fetchedExpenseData);
      // setCategoryData(fetchedCategoryData);
      setLabels(fetchedLabels);
      setSeries(
        fetchedSeries.map((total) => ({
          name: [''],
          type: 'column',
          fill: 'solid',
          data: [total], // Chart data needs to be in an array format
        }))
      );
    };

    fetchData();
  }, []);

  return (
    <Container maxWidth="xl">
      <Grid container spacing={3}>
        <Grid lg={3} sm={6} xs={12}>
          <AppWidgetSummary
            title="All Expense"
            total={totalExpenses}
            color="success"
            backgroundColor="#fffbd9"
            icon={<img src="/assets/requested.png" alt="Requested" height="56px" width="56px" />}
          />
        </Grid>

        <Grid lg={3} sm={6} xs={12}>
          <AppWidgetSummary
            title="Approved"
            total={approvedExpenses}
            color="info"
            backgroundColor="#e6fce6"
            icon={<img src="/assets/approved.png" alt="Approved" height="56px" width="56px" />}
          />
        </Grid>

        <Grid lg={3} sm={6} xs={12}>
          <AppWidgetSummary
            title="Rejected"
            total={rejectedExpenses}
            color="warning"
            backgroundColor="#ffd3d9"
            icon={<img src="/assets/rejected.png" alt="Rejected" height="56px" width="56px" />}
          />
        </Grid>

        <Grid xs={12} md={6} lg={8}>
          <AppWebsiteVisits
            title="Expense Overview"
            subheader=""
            chart={{
              labels,
              series,
            }}
          />
        </Grid>

        <Grid xs={12} md={6} lg={4}>
          <Typography fontSize="1.85rem" sx={{ marginBottom: 2, color: '#333' }}>
            Expense By Categories
          </Typography>

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
          <Typography fontSize="1.85rem" sx={{ marginBottom: 2 }}>
            Recent Transactions
          </Typography>
          <RecentTransactions />
        </Grid>
      </Grid>
    </Container>
  );
}

import { useSnackbar } from 'notistack';
import React, { useState, useEffect } from 'react';

import {
  Card,
  Stack,
  Table,
  // Button,
  TableRow,
  Container,
  TableBody,
  TableCell,
  Typography,
  TableContainer,
  TablePagination,
} from '@mui/material';

import { sortExpenses,getComparator, applyExpenseFilter  } from 'src/utils/sortingUtils';

import { fetchExpenses, updateExpense } from 'src/services/firebaseServices';

// import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';

import TableNoData from '../table-no-data';
// import TableEmptyRows from '../table-empty-rows';
import ExpenseTableRow from '../expense-table-row';
import ExpenseTableHead from '../expense-table-head';
import ExpenseTableToolbar from '../expense-table-toolbar';


export default function ExpensePage() {
  const { enqueueSnackbar } = useSnackbar();
  const [expenses, setExpenses] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [order, setOrder] = useState('asc');
  const [orderBy, setOrderBy] = useState('date');
  const [filterName, setFilterName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetchExpenses()
      .then(data => {
        setExpenses(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching expenses:', error);
        setLoading(false);
      });
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelecteds = expenses.map((n) => n.id);
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, id) => {
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1)
      );
    }
    setSelected(newSelected);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterByName = (event) => {
    setFilterName(event.target.value);
  };

  const emptyRows = rowsPerPage - Math.min(rowsPerPage, expenses.length - page * rowsPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }

  const filteredEmployees = applyExpenseFilter({ inputData: expenses, filterName });

  const sortedExpenses = sortExpenses(filteredEmployees, getComparator(order, orderBy));

  const fetchAndUpdateExpenses = async () => {
    try {
      const updatedExpenses = await fetchExpenses();
      setExpenses(updatedExpenses);
    } catch (error) {
      console.error('Error fetching updated expenses:', error);
    }
  };

  const approveExpense = async (id) => {
    try {
      await updateExpense(id, { isApproved: true });
      enqueueSnackbar('Expense approved successfully', { variant: 'success' });
      fetchAndUpdateExpenses(); // Refresh data

    } catch (error) {
      console.error('Error approving expense:', error);
      enqueueSnackbar('Failed to approve expense', { variant: 'error' });
    }
  };

  const rejectExpense = async (id) => {
    try {
      await updateExpense(id, { isApproved: false });
      enqueueSnackbar('Expense rejected successfully', { variant: 'info' });
      fetchAndUpdateExpenses(); // Refresh data

    } catch (error) {
      console.error('Error rejecting expense:', error);
      enqueueSnackbar('Failed to reject expense', { variant: 'error' });
    }
  };


  return (
    <Container>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
        <Typography variant="h4">All Expenses</Typography>
        
      </Stack>

      <Card>
        <ExpenseTableToolbar
          numSelected={selected.length}
          filterName={filterName}
          onFilterName={handleFilterByName}
        />

        <Scrollbar>
          <TableContainer sx={{ minWidth: 800 }}>
            <Table>
              <ExpenseTableHead
                order={order}
                orderBy={orderBy}
                numSelected={selected.length}
                rowCount={sortedExpenses.length}
                onRequestSort={handleRequestSort}
                onSelectAllClick={handleSelectAllClick}
                headLabel={[
                  { id: 'username', label: 'Username' },
                  { id: 'expenseType', label: 'Expense Type' },
                  { id: 'date', label: 'Date' },
                  { id: 'totalAmount', label: 'Amount' },
                  { id: 'isApproved', label: 'Action' },
                  
                  // { id: 'actions', label: 'Actions', align: 'right' },
                ]}
              />
              <TableBody>
                {sortedExpenses.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((row) => (
                  <ExpenseTableRow
                    key={row.id}
                    username={row.username}
                    expenseType={row.expenseType}
                    date={new Date(row.date).toLocaleDateString()}
                    totalAmount={row.totalAmount}
                    isApproved={row.isApproved}
                    selected={selected.indexOf(row.id) !== -1}
                    handleClick={(event) => handleClick(event, row.id)}
                    handleApprove={() => approveExpense(row.id)}
                    handleReject={() => rejectExpense(row.id)}
                  />
                ))}
                {emptyRows > 0 && (
                  <TableRow style={{ height: 53 * emptyRows }}>
                    <TableCell colSpan={6} />
                  </TableRow>
                )}
                {expenses.length === 0 && <TableNoData />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={sortedExpenses.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Card>
    </Container>
  );
}

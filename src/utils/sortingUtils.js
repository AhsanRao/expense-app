export const descendingComparator = (a, b, orderBy) => {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  };

  export const sortExpenses = (expenses, comparator) => {
    const stabilizedThis = expenses.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  };
  export const applyFilter = ({ inputData, filterName }) => {
    if (!filterName) return inputData;
    const lowerCaseFilter = filterName.toLowerCase();

    return inputData.filter(item => {
      const itemUsername = item.username;
      const itemEmail = item.email;
      return (
        (itemUsername && typeof itemUsername === 'string' && itemUsername.toLowerCase().includes(lowerCaseFilter)) ||
        (itemEmail && typeof itemEmail === 'string' && itemEmail.toLowerCase().includes(lowerCaseFilter))
      );
    });
  };

  
export const applyExpenseFilter = ({ inputData, filterName }) => {
  if (!filterName) return inputData;

  const lowerCaseFilter = filterName.toLowerCase();

  return inputData.filter(expense =>
    (expense.username && expense.username.toLowerCase().includes(lowerCaseFilter)) ||
    (expense.expenseType && expense.expenseType.toLowerCase().includes(lowerCaseFilter)) ||
    (expense.totalAmount && expense.totalAmount.toString().includes(lowerCaseFilter)) ||
    (expense.isApproved !== undefined && expense.isApproved.toString().toLowerCase().includes(lowerCaseFilter))
  );
};

  
  export const getComparator = (order, orderBy) =>
  order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);

  
  
  
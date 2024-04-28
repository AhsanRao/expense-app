import { db } from './firebase';

// Fetch all employees and their expenses
export const fetchEmployeesAndExpenses = async () => {
  const employeesSnapshot = await db.collection('employees').get();
  const employeesData = employeesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  const expensesSnapshot = await db.collection('expenses').get();
  const expensesData = expensesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  // Aggregate expenses under each employee
  const employees = employeesData.map(employee => {
    const employeeExpenses = expensesData.filter(expense => expense.username === employee.id);
    return {
      ...employee,
      expensesCount: employeeExpenses.length,
      totalAmount: employeeExpenses.reduce((acc, curr) => acc + curr.totalAmount, 0)
    };
  });

  console.log(employees);

  return employees;
};

export const fetchExpenses = async () => {
    const expensesSnapshot = await db.collection('expenses').get();
    return expensesSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

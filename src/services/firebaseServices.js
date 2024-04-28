import { doc, getDocs, updateDoc, collection  } from 'firebase/firestore';

import { db } from './firebase';

// Fetch all employees and their expenses
export const fetchEmployeesAndExpenses = async () => {
  const employeesCollection = collection(db, 'employees');
  const employeesSnapshot = await getDocs(employeesCollection);
  const employees = employeesSnapshot.docs.map(document => ({ id: document.id, ...document.data() }));

  const expensesCollection = collection(db, 'addExpense');
  const expensesSnapshot = await getDocs(expensesCollection);
  const expenses = expensesSnapshot.docs.map(document => ({ ...document.data() }));

  // Aggregate expenses under each employee
  return employees.map(employee => {
    const employeeExpenses = expenses.filter(expense => expense.username === employee.id);
    return {
      ...employee,
      expensesCount: employeeExpenses.length,
      totalAmount: employeeExpenses.reduce((total, expense) => total + expense.totalAmount, 0)
    };
  });
};

export const fetchExpenses = async () => {
  const expensesCollection = collection(db, 'addExpense');
  const expensesSnapshot = await getDocs(expensesCollection);
  return expensesSnapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
};

export const updateExpense = async (id, updates) => {
  const expenseRef = doc(db, "addExpense", id);
  await updateDoc(expenseRef, updates);
};

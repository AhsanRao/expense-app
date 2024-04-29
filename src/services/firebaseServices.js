import {
  doc,
  query,
  where,
  setDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  collection,
  writeBatch,
} from 'firebase/firestore';

import { db } from './firebase';

// Fetch all employees and their expenses
export const fetchEmployeesAndExpenses = async () => {
  const employeesCollection = collection(db, 'employees');
  const employeesSnapshot = await getDocs(employeesCollection);
  const employees = employeesSnapshot.docs.map((document) => ({
    id: document.id,
    ...document.data(),
  }));

  const expensesCollection = collection(db, 'addExpense');
  const expensesSnapshot = await getDocs(expensesCollection);
  const expenses = expensesSnapshot.docs.map((document) => ({ ...document.data() }));

  // Aggregate expenses under each employee
  return employees.map((employee) => {
    const employeeExpenses = expenses.filter((expense) => expense.username === employee.id);
    return {
      ...employee,
      expensesCount: employeeExpenses.length,
      totalAmount: employeeExpenses.reduce((total, expense) => total + expense.totalAmount, 0),
    };
  });
};

export const fetchExpenses = async () => {
  const expensesCollection = collection(db, 'addExpense');
  const expensesSnapshot = await getDocs(expensesCollection);
  return expensesSnapshot.docs.map((document) => ({ id: document.id, ...document.data() }));
};

export const updateExpense = async (id, updates) => {
  const expenseRef = doc(db, 'addExpense', id);
  await updateDoc(expenseRef, updates);
};

export const addEmployeeToDatabase = async (employeeData) => {
  try {
    const docRef = doc(collection(db, 'employees'));
    await setDoc(docRef, employeeData);
    console.log('Document written with ID: ', docRef.id);
  } catch (e) {
    console.error('Error adding document: ', e);
  }
};

export const deleteEmployeeFromDatabase = async (id) => {
  const employeeRef = doc(db, 'employees', id);
  await deleteDoc(employeeRef);
};

// Function to update an employee
export const updateEmployeeInDatabase = async (id, updates) => {
  const employeeRef = doc(db, 'employees', id);
  await updateDoc(employeeRef, updates);
};

// Function to delete multiple employees by their document IDs
export const deleteMultipleEmployeesFromDatabase = async (ids) => {
  const batch = writeBatch(db);
  ids.forEach((id) => {
    const docRef = doc(db, 'employees', id);
    batch.delete(docRef);
  });
  await batch.commit();
};

// Helper function to fetch data
export const fetchData = async (collectionName, queries = []) => {
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, ...queries);
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(document => ({ id: document.id, ...document.data() }));
};

// Fetch total expenses
export const fetchTotalExpenses = async () => {
  const expenses = await fetchData('addExpense');
  return expenses.reduce((total, expense) => {
    const amount = Number(expense.totalAmount);
    return total + (Number.isNaN(amount) ? 0 : amount); // Only add amount if it's a number
  }, 0);
};

// Fetch approved expenses
export const fetchApprovedExpenses = async () => {
  const approvedExpenses = await fetchData('addExpense', [where('isApproved', '==', true)]);
  return approvedExpenses.reduce((total, expense) => {
    const amount = Number(expense.totalAmount); // Ensure conversion to number
    return total + (Number.isNaN(amount) ? 0 : amount); // Only add amount if it's a number
  }, 0);
};

// Fetch rejected expenses
export const fetchRejectedExpenses = async () => {
  const rejectedExpenses = await fetchData('addExpense', [where('isApproved', '==', false)]);
  return rejectedExpenses.reduce((total, expense) => {
    const amount = Number(expense.totalAmount); // Ensure conversion to number
    return total + (Number.isNaN(amount) ? 0 : amount); // Only add amount if it's a number
  }, 0);
};


// Fetch expense data for charts
export const fetchExpenseData = async () => {
  console.log("Fetching expenses for chart data...");
  const expenses = await fetchData('addExpense');

  console.log("Expenses fetched:", expenses);
  
  // Extracting categories and ensuring uniqueness and validity
  const categories = [...new Set(expenses.map(expense => expense.expenseCategory).filter(cat => cat != null))];
  console.log("Valid unique categories extracted:", categories);

  // Building the data structure for chart
  const data = {
      labels: categories,
      series: categories.map(category => {
          const filtered = expenses.filter(expense => expense.expenseCategory === category);
          console.log(`Expenses filtered for category '${category}':`, filtered);
          const categoryTotal = filtered.reduce((total, current) => {
            const amount = Number(current.totalAmount);  // Ensure the 'totalAmount' field is used and converted to Number
            return total + (Number.isNaN(amount) ? 0 : amount);  // Adding only valid numbers
          }, 0);
          console.log(`Total for '${category}':`, categoryTotal);
          return categoryTotal;
      }),
  };
  
  console.log("Chart data prepared:", data);
  return data;
};

export const fetchExpenseLabels = async () => {
  console.log("Fetching labels for expense chart...");
  const expenses = await fetchData('addExpense');
  const categories = [...new Set(expenses.map(expense => expense.expenseType).filter(Boolean))];
  console.log("Valid unique labels (categories) extracted:", categories);
  return categories;
};
export const fetchExpenseSeries = async () => {
  console.log("Fetching series data for expense chart...");
  const expenses = await fetchData('addExpense');
  const categories = await fetchExpenseLabels(); // Assuming fetchExpenseLabels is accessible and returns the correct data

  const series = categories.map(category => {
      const filtered = expenses.filter(expense => expense.expenseType === category);
      console.log(`Expenses filtered for category '${category}':`, filtered);
      const total = filtered.reduce((sum, current) => {
          const amount = Number(current.totalAmount);
          return sum + (Number.isNaN(amount) ? 0 : amount);  // Add valid numbers only
      }, 0);
      console.log(`Total for '${category}':`, total);
      return total;
  });

  console.log("Series data prepared:", series);
  return series;
};


// Fetch category data for pie chart
export const fetchCategoryData = async () => {
  const expenses = await fetchData('addExpense');
  const categories = [...new Set(expenses.map(expense => expense.category))];
  return categories.map(category => {
      const total = expenses.filter(expense => expense.category === category)
                            .reduce((sum, { amount }) => sum + amount, 0);
      return { label: category, value: total };
  });
};

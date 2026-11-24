
// ========================================
// SPENDWISE - BUDGET TRACKER
// ========================================

// Get HTML elements
const incomeForm = document.getElementById("income-form");
const expenseForm = document.getElementById("expense-form");

const incomeInput = document.getElementById("income-input");
const expenseNameInput = document.getElementById("expense-name");
const expenseAmountInput = document.getElementById("expense-amount");

const totalIncomeElement = document.getElementById("total-income");
const totalExpensesElement = document.getElementById("total-expenses");
const remainingBalanceElement = document.getElementById("remaining-balance");

const expenseList = document.getElementById("expense-list");
const budgetMessage = document.getElementById("budget-message");

// ========================================
// LOAD SAVED DATA
// ========================================

let income = Number(localStorage.getItem("income")) || 0;

let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

// Make sure expenses is an array
if (!Array.isArray(expenses)) {
  expenses = [];
}

// ========================================
// FORMAT KENYAN SHILLINGS
// ========================================

function formatKSh(amount) {
  return `KSh ${Number(amount).toLocaleString("en-KE", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

// ========================================
// UPDATE DASHBOARD
// ========================================

function updateDashboard() {
  // Calculate total expenses
  const totalExpenses = expenses.reduce((total, expense) => {
    return total + Number(expense.amount);
  }, 0);

  // Calculate remaining balance
  const remaining = income - totalExpenses;

  // Update dashboard
  totalIncomeElement.textContent = formatKSh(income);
  totalExpensesElement.textContent = formatKSh(totalExpenses);
  remainingBalanceElement.textContent = formatKSh(remaining);

  // Update budget message
  if (income === 0) {
    budgetMessage.textContent =
      "Please set your monthly income above to evaluate your budget health.";

    budgetMessage.style.backgroundColor = "";
    budgetMessage.style.color = "";
  } else if (remaining > 0) {
    budgetMessage.textContent =
      `Good job! You have ${formatKSh(remaining)} remaining.`;

    budgetMessage.style.backgroundColor = "#d1fae5";
    budgetMessage.style.color = "#047857";
  } else if (remaining === 0) {
    budgetMessage.textContent =
      "Your income has been completely spent.";

    budgetMessage.style.backgroundColor = "#fef3c7";
    budgetMessage.style.color = "#92400e";
  } else {
    budgetMessage.textContent =
      `Warning! You are ${formatKSh(Math.abs(remaining))} over your income.`;

    budgetMessage.style.backgroundColor = "#fee2e2";
    budgetMessage.style.color = "#b91c1c";
  }
}

// ========================================
// DISPLAY EXPENSES
// ========================================

function displayExpenses() {
  // Clear old records
  expenseList.innerHTML = "";

  // If there are no expenses
  if (expenses.length === 0) {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td colspan="2">No expenses recorded yet.</td>
    `;

    expenseList.appendChild(row);
    return;
  }

  // Display every expense
  expenses.forEach((expense, index) => {
    const row = document.createElement("tr");

    row.innerHTML = `
      <td>
        ${expense.name}
      </td>

      <td>
        ${formatKSh(expense.amount)}

        <button
          type="button"
          onclick="deleteExpense(${index})"
        >
          Delete
        </button>
      </td>
    `;

    expenseList.appendChild(row);
  });
}

// ========================================
// UPDATE MONTHLY INCOME
// ========================================

incomeForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const newIncome = Number(incomeInput.value);

  // Validate income
  if (isNaN(newIncome) || newIncome <= 0) {
    alert("Please enter a valid income amount.");
    return;
  }

  // Save income
  income = newIncome;

  localStorage.setItem("income", income);

  // Update dashboard
  updateDashboard();

  // Clear input
  incomeInput.value = "";

  alert("Monthly income updated successfully!");
});

// ========================================
// ADD EXPENSE
// ========================================

expenseForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const expenseName = expenseNameInput.value.trim();
  const expenseAmount = Number(expenseAmountInput.value);

  // Validate expense name
  if (expenseName === "") {
    alert("Please enter an expense name.");
    return;
  }

  // Validate expense amount
  if (isNaN(expenseAmount) || expenseAmount <= 0) {
    alert("Please enter a valid expense amount.");
    return;
  }

  // Create new expense
  const newExpense = {
    name: expenseName,
    amount: expenseAmount
  };

  // Add expense to array
  expenses.push(newExpense);

  // Save expenses
  localStorage.setItem("expenses", JSON.stringify(expenses));

  // Update everything
  displayExpenses();
  updateDashboard();

  // Clear inputs
  expenseNameInput.value = "";
  expenseAmountInput.value = "";
});

// ========================================
// DELETE EXPENSE
// ========================================

function deleteExpense(index) {
  // Remove expense
  expenses.splice(index, 1);

  // Save updated expenses
  localStorage.setItem("expenses", JSON.stringify(expenses));

  // Update page
  displayExpenses();
  updateDashboard();
}

// ========================================
// LOAD DATA WHEN PAGE OPENS
// ========================================

displayExpenses();
updateDashboard();


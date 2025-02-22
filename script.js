document.addEventListener("DOMContentLoaded", function () {
    let transactions = [];
    let budget = 0;

    const balanceEl = document.getElementById("balance");
    const remainingBudgetEl = document.getElementById("remainingbudget");
    const savingsEl = document.getElementById("savings");
    const incomeAmountEl = document.getElementById("incomeamount");
    const expenseAmountEl = document.getElementById("expenseamount");
    const transactionListEl = document.getElementById("transactionlist");

    const budgetInput = document.getElementById("budgetinput");
    const transactionForm = document.getElementById("transactionform");
    const expenseChartCanvas = document.getElementById("expensechart");

    const setBudgetBtn = document.getElementById("bsbtn"); 

    let expenseChart;

    function updateUI() {
        const income = transactions.filter(t => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
        const expenses = transactions.filter(t => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
        const balance = income - expenses;
        const remainingBudget = budget - expenses;
        const savings = budget > 0 ? ((remainingBudget / budget) * 100).toFixed(1) : 0;

        balanceEl.textContent = `$${balance.toFixed(2)}`;
        remainingBudgetEl.textContent = `$${remainingBudget.toFixed(2)}`;
        savingsEl.textContent = `${savings}%`;
        incomeAmountEl.textContent = `$${income.toFixed(2)}`;
        expenseAmountEl.textContent = `$${expenses.toFixed(2)}`;

        renderTransactionList();
        updateExpenseChart();
    }

    function renderTransactionList() {
        transactionListEl.innerHTML = "";
        transactions.forEach((transaction, index) => {
            const li = document.createElement("li");
            li.innerHTML = `${transaction.description} - $${transaction.amount.toFixed(2)} (${transaction.type}) `;
    
            // Create delete button
            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "❌";
            deleteBtn.style.marginLeft = "10px";
            deleteBtn.onclick = function () {
                deleteTransaction(index);
            };
    
            li.style.color = transaction.type === "income" ? "green" : "red";
            li.appendChild(deleteBtn);
            transactionListEl.appendChild(li);
        });
    }
    
    
    
    

    function deleteTransaction(index) {
        transactions.splice(index, 1);
        updateUI();
    }

    function setBudget() {
        budget = parseFloat(budgetInput.value);
        if (isNaN(budget) || budget < 0) {
            alert("Please enter a valid budget amount.");
            return;
        }
        updateUI();
    }

    setBudgetBtn.addEventListener("click", setBudget);  

    transactionForm.addEventListener("submit", function (e) {
        e.preventDefault();
        console.log("Form submitted!");

        const description = document.getElementById("description").value;  
        const amount = parseFloat(document.getElementById("amount").value);  
        const type = document.getElementById("type").value;  
        const category = document.getElementById("category").value;  

        if (!description || isNaN(amount) || amount <= 0) {
            alert("Please enter valid details.");
            return;
        }

        transactions.push({ description, amount, type, category });
        console.log("Transactions Array:", transactions);
        transactionForm.reset();
        updateUI();
    });

    function updateExpenseChart() {
        if (!expenseChartCanvas) return; // Prevent errors if element is missing

        const expenseCategories = {};
        transactions
            .filter(t => t.type === "expense")
            .forEach(t => {
                expenseCategories[t.category] = (expenseCategories[t.category] || 0) + t.amount;
            });

        const labels = Object.keys(expenseCategories);
        const data = Object.values(expenseCategories);

        if (expenseChart) {
            expenseChart.destroy();
        }

        expenseChart = new Chart(expenseChartCanvas, {
            type: "pie",
            data: {
                labels: labels,
                datasets: [{
                    data: data,
                    backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0", "#9966ff"],
                }],
            },
        });
    }

    window.deleteTransaction = function (index) {
        transactions.splice(index, 1);
        renderTransactionList(); // Re-render list after deletion
        updateUI();
    };
    
    
});

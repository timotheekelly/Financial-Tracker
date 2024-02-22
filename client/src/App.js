import React, { useState, useEffect } from 'react';
import axios from './api/axios'; // If you created an instance
import './App.css';

function App() {

  const [transaction, setTransaction] = useState({
    description: '',
    amount: '',
    type: 'expense',
    date: ''
  });
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await axios.get('transactions');
      setTransactions(response.data);
    } catch (error) {
      console.error("Error fetching transactions:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTransaction(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('transactions', transaction);
      setTransactions([...transactions, response.data]);
      setTransaction({ description: '', amount: '', type: 'expense', date: '' }); // Reset form
    } catch (error) {
      console.error("Error adding transaction:", error);
    }
  };

  const [filter, setFilter] = useState('all');


  return (
    <div className="App">
      <h2>Add Transaction</h2>
      <form onSubmit={handleSubmit}>
      <div>
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={transaction.description}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Amount ($):</label>
          <input
            type="number"
            name="amount"
            value={transaction.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label>Type:</label>
          <select name="type" value={transaction.type} onChange={handleChange}>
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
        </div>
        <div>
          <label>Date:</label>
          <input
            type="date"
            name="date"
            value={transaction.date}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit">Add Transaction</button>
      </form>
      <div className="transaction-table">
        <h3>Transactions</h3>
        <div>
          <label>Filter transactions: </label>
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="expense">Expenses</option>
            <option value="income">Income</option>
          </select>
        </div>
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
          {transactions
            .filter((trans) => filter === 'all' || trans.type === filter)
            .map((trans, index) => (
              <tr key={index}>
                <td>{trans.description}</td>
                <td>${trans.amount}</td>
                <td>{trans.type}</td>
                <td>{trans.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default App;

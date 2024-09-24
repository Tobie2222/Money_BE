const connection = require('../config/database'); // Ensure the correct path to the config file
const { Transaction } = require('../model/transactionsModel'); // Import the Transaction model
const { Account } = require('../model/accountsModel'); // Import the Account model
const { User } = require('../model/userModel'); // Import the User model

class TransactionsController {
  
  // Helper method to get account by ID
  async getAccountById(accountId) {
    return new Promise((resolve, reject) => {
      connection.query('SELECT * FROM accounts WHERE id = ?', [accountId], (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results[0]);
      });
    });
  }

  // Helper method to update account balance
  async updateAccountBalance(accountId, amount, isDebit) {
    const operation = isDebit ? 'balance - ?' : 'balance + ?';
    return new Promise((resolve, reject) => {
      connection.query(`UPDATE accounts SET balance = ${operation} WHERE id = ?`, [amount, accountId], (err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  }

  // [Create Expense Transaction]
  async createExpenseTransactions(req, res) {
    const { accountId, userId, categoryId } = req.params;
    const { transaction_name, desc_transaction, amount, transaction_date } = req.body;

    // Validate input
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    try {
      const findAccount = await this.getAccountById(accountId);
      if (!findAccount) {
        return res.status(404).json({ message: "Account not found" });
      }

      if (findAccount.balance < amount) {
        return res.status(403).json({ message: "Insufficient balance" });
      }

      await this.updateAccountBalance(accountId, amount, true);

      const query = 'INSERT INTO transactions (transaction_name, desc_transaction, is_fixed, amount, type, transaction_date, user_id, account_id, category_id, income_type, slug_user) VALUES (?, ?, false, ?, "expense", ?, ?, ?, ?, NULL, ?)';
      connection.query(query, [transaction_name, desc_transaction, amount, new Date(transaction_date), userId, accountId, categoryId, findAccount.slug_user], (err, result) => {
        if (err) {
          return res.status(500).json({ message: `Error: ${err.message}` });
        }

        connection.query('UPDATE accounts SET transactions = JSON_ARRAY_APPEND(transactions, "$", ?) WHERE id = ?', [result.insertId, accountId], (err) => {
          if (err) {
            return res.status(500).json({ message: `Error: ${err.message}` });
          }

          return res.status(200).json({
            message: "Expense transaction created successfully",
            newExpenseTrans: { id: result.insertId, transaction_name, desc_transaction, amount, transaction_date, user_id: userId, account_id: accountId, category_id: categoryId }
          });
        });
      });

    } catch (err) {
      return res.status(500).json({ message: `Error: ${err.message}` });
    }
  }

  // [Create Income Transaction]
  async createIncomeTransactions(req, res) {
    const { accountId, incomeTypeId, userId } = req.params;
    const { transaction_name, desc_transaction, amount, transaction_date } = req.body;

    // Validate input
    if (isNaN(amount) || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    try {
      const findAccount = await this.getAccountById(accountId);
      if (!findAccount) {
        return res.status(404).json({ message: "Account not found" });
      }

      await this.updateAccountBalance(accountId, amount, false);

      const query = 'INSERT INTO transactions (transaction_name, desc_transaction, is_fixed, amount, type, transaction_date, user_id, account_id, category_id, income_type, slug_user) VALUES (?, ?, false, ?, "income", ?, ?, ?, ?, ?, ?)';
      connection.query(query, [transaction_name, desc_transaction, amount, new Date(transaction_date), userId, accountId, null, incomeTypeId, findAccount.slug_user], (err, result) => {
        if (err) {
          return res.status(500).json({ message: `Error: ${err.message}` });
        }

        connection.query('UPDATE accounts SET transactions = JSON_ARRAY_APPEND(transactions, "$", ?) WHERE id = ?', [result.insertId, accountId], (err) => {
          if (err) {
            return res.status(500).json({ message: `Error: ${err.message}` });
          }

          return res.status(200).json({
            message: "Income transaction created successfully",
            newTranIncome: { id: result.insertId, transaction_name, desc_transaction, amount, transaction_date, user_id: userId, account_id: accountId, income_type: incomeTypeId }
          });
        });
      });

    } catch (err) {
      return res.status(500).json({ message: `Error: ${err.message}` });
    }
  }

  // Get recent transactions by user
  async getRecentTranByUser(req, res) {
    const { userId } = req.params;
    const twoDaysAgo = new Date();
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    try {
      connection.query(`SELECT * FROM transactions WHERE user_id = ? AND type = "income" AND transaction_date >= ? ORDER BY transaction_date DESC LIMIT 5`, [userId, twoDaysAgo], (err, recentIncomeTransactions) => {
        if (err) {
          return res.status(500).json({ message: `Error: ${err.message}` });
        }

        connection.query(`SELECT * FROM transactions WHERE user_id = ? AND type = "expense" AND transaction_date >= ? ORDER BY transaction_date DESC LIMIT 5`, [userId, twoDaysAgo], (err, recentExpenseTransactions) => {
          if (err) {
            return res.status(500).json({ message: `Error: ${err.message}` });
          }

          return res.status(200).json({
            message: "success",
            allTranRecent: {
              tranIncome: recentIncomeTransactions,
              tranExpense: recentExpenseTransactions
            }
          });
        });
      });

    } catch (err) {
      return res.status(500).json({ message: `Error: ${err.message}` });
    }
  }

  // Get all income transactions by user
  async getAllTranIncome(req, res) {
    const { userId } = req.params;

    try {
      connection.query(`SELECT * FROM transactions WHERE user_id = ? AND type = "income"`, [userId], (err, findTran) => {
        if (err) {
          return res.status(500).json({ message: `Error: ${err.message}` });
        }

        return res.status(200).json({
          message: "success",
          findTran
        });
      });

    } catch (err) {
      return res.status(500).json({ message: `Error: ${err.message}` });
    }
  }

  // Get all expense transactions by user
  async getAllTranExpense(req, res) {
    const { userId } = req.params;

    try {
      connection.query(`SELECT * FROM transactions WHERE user_id = ? AND type = "expense"`, [userId], (err, findTran) => {
        if (err) {
          return res.status(500).json({ message: `Error: ${err.message}` });
        }

        return res.status(200).json({
          message: "success",
          findTran
        });
      });

    } catch (err) {
      return res.status(500).json({ message: `Error: ${err.message}` });
    }
  }

  // Delete transaction
  async deleteTran(req, res) {
    const { tranId } = req.params;

    try {
      connection.query('SELECT * FROM transactions WHERE id = ?', [tranId], (err, transactions) => {
        if (err) {
          return res.status(500).json({ message: `Error: ${err.message}` });
        }

        const transaction = transactions[0];
        if (!transaction) {
          return res.status(404).json({ message: "Transaction not found" });
        }

        connection.beginTransaction(err => {
          if (err) {
            return res.status(500).json({ message: `Error: ${err.message}` });
          }

          connection.query('UPDATE accounts SET transactions = JSON_REMOVE(transactions, JSON_UNQUOTE(JSON_SEARCH(transactions, "one", ?))) WHERE id = ?', [tranId, transaction.account_id], (err) => {
            if (err) {
              return connection.rollback(() => {
                res.status(500).json({ message: `Error: ${err.message}` });
              });
            }

            connection.query('DELETE FROM transactions WHERE id = ?', [tranId], (err) => {
              if (err) {
                return connection.rollback(() => {
                  res.status(500).json({ message: `Error: ${err.message}` });
                });
              }

              connection.commit(err => {
                if (err) {
                  return connection.rollback(() => {
                    res.status(500).json({ message: `Error: ${err.message}` });
                  });
                }

                return res.status(200).json({
                  message: "Transaction deleted successfully"
                });
              });
            });
          });
        });
      });
    } catch (err) {
      return res.status(500).json({ message: `Error: ${err.message}` });
    }
  }
}

module.exports = new TransactionsController();

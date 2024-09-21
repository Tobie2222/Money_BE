const db = require('../config/database');

const Transaction = {
  transaction_id: 'transaction_id',
  user_id: 'user_id',
  account_id: 'account_id',
  category_id: 'category_id',
  income_type_id: 'income_type_id',
  transaction_name: 'transaction_name',
  desc_transaction: 'desc_transaction',
  is_fixed: 'is_fixed',
  amount: 'amount',
  transactions_type: 'transactions_type',
  transaction_date: 'transaction_date',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

module.exports = Transaction;

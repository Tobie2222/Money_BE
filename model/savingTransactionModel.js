const db = require('../config/database');

const SavingsTransaction = {
  transaction_id: 'transaction_id',
  user_id: 'user_id',
  account_id: 'account_id',
  saving_id: 'saving_id',
  amount: 'amount',
  transaction_date: 'transaction_date',
  name_tran: 'name_tran',
  created_at: 'created_at',
  updated_at: 'updated_at'
};

module.exports = SavingsTransaction;

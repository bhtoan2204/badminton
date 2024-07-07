export const updateExpenseSchema = {
  type: 'object',
  properties: {
    id_expenditure: {
      type: 'number',
      description: 'The ID of the expenditure',
    },
    id_family: {
      type: 'number',
      description: 'The ID of the family',
    },
    id_created_by: {
      type: 'string',
      description: 'The ID of the user who caused the income',
    },
    id_expense_type: {
      type: 'number',
      description: 'The ID of the expense type',
    },
    amount: {
      type: 'number',
      description: 'The amount of the expense',
    },
    expenditure_date: {
      type: 'string',
      format: 'date',
      description: 'The date of the expense',
    },
    description: {
      type: 'string',
      description: 'The description of the expense',
    },
    expenseImg: {
      type: 'string',
      format: 'binary',
      description: 'The image of the expenditure (optional)',
    },
  },
  required: ['id_expenditure', 'id_family'],
};

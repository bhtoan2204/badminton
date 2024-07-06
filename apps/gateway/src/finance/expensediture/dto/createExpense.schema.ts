export const createExpenditureSchema = {
  type: 'object',
  properties: {
    id_family: {
      type: 'number',
      description: 'The ID of the family',
    },
    id_expenditure_type: {
      type: 'number',
      description: 'The ID of the expenditure type',
    },
    id_created_by: {
      type: 'number',
      description: 'The ID of the user who created the expenditure',
    },
    amount: {
      type: 'number',
      description: 'The amount of the expenditure',
    },
    description: {
      type: 'string',
      description: 'The description of the expenditure',
    },
    expenditure_date: {
      type: 'string',
      format: 'date',
      description: 'The date of the expenditure (default is current date)',
    },
    expenseImg: {
      type: 'string',
      format: 'binary',
      description: 'The image of the expenditure (optional)',
    },
  },
  required: ['id_family', 'id_created_by', 'id_expenditure_type', 'amount'],
};

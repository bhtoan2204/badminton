export const SendFamilyVideoSchema = {
  type: 'object',
  properties: {
    video: {
      type: 'string',
      format: 'binary',
      description: 'The video of the expense (optional)',
    },
    familyId: {
      type: 'string',
      description: 'The ID of the receiver',
    },
  },
};

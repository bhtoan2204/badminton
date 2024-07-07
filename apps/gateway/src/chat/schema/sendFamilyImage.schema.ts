export const SendFamilyImageSchema = {
  type: 'object',
  properties: {
    image: {
      type: 'string',
      format: 'binary',
      description: 'The image of the expense (optional)',
    },
    familyId: {
      type: 'string',
      description: 'The ID of the receiver',
    },
  },
};

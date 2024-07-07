export const SendImageMessageSchema = {
  type: 'object',
  properties: {
    image: {
      type: 'string',
      format: 'binary',
      description: 'The image of the expense (optional)',
    },
    receiverId: {
      type: 'string',
      description: 'The ID of the receiver',
    },
  },
};

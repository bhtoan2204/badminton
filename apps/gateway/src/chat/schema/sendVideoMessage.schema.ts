export const SendVideoMessageSchema = {
  type: 'object',
  properties: {
    video: {
      type: 'string',
      format: 'binary',
      description: 'The video of the expense (optional)',
    },
    receiverId: {
      type: 'string',
      description: 'The ID of the receiver',
    },
  },
};

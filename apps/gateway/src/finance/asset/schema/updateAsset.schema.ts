export const UpdateAssetSchema = {
  type: 'object',
  properties: {
    id_asset: {
      type: 'number',
      description: 'The ID of the asset',
    },
    id_family: {
      type: 'number',
      description: 'The ID of the family',
    },
    name: {
      type: 'string',
      description: 'The name of the asset',
    },
    description: {
      type: 'string',
      description: 'The description of the asset',
    },
    value: {
      type: 'number',
      description: 'The value of the asset',
    },
    purchase_date: {
      type: 'string',
      format: 'date',
      description: 'The date of the asset purchase',
    },
    image: {
      type: 'string',
      format: 'binary',
      description: 'The image of the asset',
    },
  },
  required: ['id_asset', 'id_family'],
};

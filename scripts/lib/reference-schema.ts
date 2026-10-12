const text = { type: 'string', minLength: 1, pattern: '\\S' };
const slug = { type: 'string', pattern: '^[a-z0-9]+(?:-[a-z0-9]+)*$' };
const code = { type: 'string', pattern: '^[A-Z]{2}$' };
const labels = {
  type: 'object',
  properties: { zh: text, en: text },
  required: ['zh', 'en'],
  additionalProperties: false,
};
const aliases = { type: 'array', items: text, uniqueItems: true };
const source = {
  type: 'object',
  properties: {
    url: { type: 'string', format: 'uri' },
    title: text,
    accessed_at: { type: 'string', format: 'date' },
    reuse_basis: { enum: ['original_summary', 'permission', 'open_license'] },
    license_note: text,
  },
  required: ['url', 'title', 'accessed_at', 'reuse_basis'],
  additionalProperties: false,
  allOf: [
    {
      if: {
        properties: { reuse_basis: { enum: ['permission', 'open_license'] } },
      },
      then: { required: ['license_note'] },
    },
  ],
};
export default {
  type: 'object',
  additionalProperties: false,
  required: ['categories', 'countries', 'cities'],
  properties: {
    categories: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: { type: 'string', pattern: '^[a-z0-9]+(?:_[a-z0-9]+)*$' },
          labels,
        },
        required: ['id', 'labels'],
        additionalProperties: false,
      },
    },
    countries: {
      type: 'array',
      items: {
        type: 'object',
        properties: { code, names: labels, aliases },
        required: ['code', 'names', 'aliases'],
        additionalProperties: false,
      },
    },
    cities: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          id: slug,
          country_code: code,
          names: labels,
          aliases,
          latitude: { type: 'number', minimum: -90, maximum: 90 },
          longitude: { type: 'number', minimum: -180, maximum: 180 },
          source,
        },
        required: [
          'id',
          'country_code',
          'names',
          'aliases',
          'latitude',
          'longitude',
          'source',
        ],
        additionalProperties: false,
      },
    },
  },
};

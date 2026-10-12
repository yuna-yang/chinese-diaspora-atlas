// Generated from data/schema/relationship.schema.json; do not edit.
export default {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Relationship",
  "type": "object",
  "properties": {
    "schema_version": {
      "const": 1
    },
    "id": {
      "type": "string",
      "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$"
    },
    "source_id": {
      "type": "string",
      "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$"
    },
    "target_id": {
      "type": "string",
      "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$"
    },
    "direction": {
      "enum": [
        "directed",
        "undirected"
      ]
    },
    "types": {
      "type": "array",
      "items": {
        "enum": [
          "bonding",
          "bridging",
          "linking"
        ]
      },
      "uniqueItems": true,
      "minItems": 0
    },
    "forms": {
      "type": "array",
      "items": {
        "enum": [
          "co_event_project",
          "space_resources",
          "funding_support",
          "knowledge_exchange",
          "referrals",
          "ongoing_cooperation",
          "other"
        ]
      },
      "uniqueItems": true,
      "minItems": 1
    },
    "descriptions": {
      "type": "object",
      "properties": {
        "zh": {
          "anyOf": [
            {
              "type": "string",
              "minLength": 1,
              "maxLength": 600,
              "pattern": "\\S"
            },
            {
              "type": "null"
            }
          ]
        },
        "en": {
          "anyOf": [
            {
              "type": "string",
              "minLength": 1,
              "maxLength": 600,
              "pattern": "\\S"
            },
            {
              "type": "null"
            }
          ]
        }
      },
      "required": [
        "zh",
        "en"
      ],
      "additionalProperties": false,
      "anyOf": [
        {
          "properties": {
            "zh": {
              "type": "string"
            }
          }
        },
        {
          "properties": {
            "en": {
              "type": "string"
            }
          }
        }
      ]
    },
    "classification_basis": {
      "type": "object",
      "properties": {
        "zh": {
          "anyOf": [
            {
              "type": "string",
              "minLength": 1,
              "maxLength": 600,
              "pattern": "\\S"
            },
            {
              "type": "null"
            }
          ]
        },
        "en": {
          "anyOf": [
            {
              "type": "string",
              "minLength": 1,
              "maxLength": 600,
              "pattern": "\\S"
            },
            {
              "type": "null"
            }
          ]
        }
      },
      "required": [
        "zh",
        "en"
      ],
      "additionalProperties": false
    },
    "period": {
      "type": "object",
      "properties": {
        "start": {
          "type": [
            "string",
            "null"
          ],
          "pattern": "^\\d{4}(?:-\\d{2}(?:-\\d{2})?)?$"
        },
        "end": {
          "type": [
            "string",
            "null"
          ],
          "pattern": "^\\d{4}(?:-\\d{2}(?:-\\d{2})?)?$"
        },
        "label": {
          "type": "object",
          "properties": {
            "zh": {
              "anyOf": [
                {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 600,
                  "pattern": "\\S"
                },
                {
                  "type": "null"
                }
              ]
            },
            "en": {
              "anyOf": [
                {
                  "type": "string",
                  "minLength": 1,
                  "maxLength": 600,
                  "pattern": "\\S"
                },
                {
                  "type": "null"
                }
              ]
            }
          },
          "required": [
            "zh",
            "en"
          ],
          "additionalProperties": false
        }
      },
      "required": [
        "start",
        "end",
        "label"
      ],
      "additionalProperties": false
    },
    "temporal_status": {
      "enum": [
        "current",
        "past",
        "unknown"
      ]
    },
    "source_city_id": {
      "type": [
        "string",
        "null"
      ]
    },
    "target_city_id": {
      "type": [
        "string",
        "null"
      ]
    },
    "sources": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "url": {
            "type": "string",
            "format": "uri",
            "pattern": "^https://[^/\\s]+(?:/[^\\s]*)?$"
          },
          "title": {
            "type": "string",
            "minLength": 1,
            "maxLength": 300,
            "pattern": "\\S"
          },
          "accessed_at": {
            "type": "string",
            "format": "date"
          },
          "supports": {
            "type": "array",
            "items": {
              "enum": [
                "relationship",
                "period",
                "classification",
                "direction"
              ]
            },
            "uniqueItems": true,
            "minItems": 1
          },
          "reuse_basis": {
            "enum": [
              "original_summary",
              "permission",
              "open_license"
            ]
          },
          "license_note": {
            "type": "string",
            "minLength": 1,
            "maxLength": 600,
            "pattern": "\\S"
          },
          "kind": {
            "enum": [
              "public_source",
              "organization_statement"
            ]
          }
        },
        "required": [
          "url",
          "title",
          "accessed_at",
          "supports",
          "reuse_basis"
        ],
        "additionalProperties": false,
        "allOf": [
          {
            "if": {
              "properties": {
                "reuse_basis": {
                  "enum": [
                    "permission",
                    "open_license"
                  ]
                }
              }
            },
            "then": {
              "required": [
                "license_note"
              ]
            }
          }
        ]
      },
      "uniqueItems": true,
      "minItems": 1
    },
    "information_basis": {
      "enum": [
        "public_documentation",
        "organization_contribution",
        "organization_reviewed"
      ]
    },
    "last_verified": {
      "type": "string",
      "format": "date"
    },
    "created_at": {
      "type": "string",
      "format": "date"
    },
    "updated_at": {
      "type": "string",
      "format": "date"
    }
  },
  "required": [
    "schema_version",
    "id",
    "source_id",
    "target_id",
    "direction",
    "types",
    "forms",
    "descriptions",
    "classification_basis",
    "period",
    "temporal_status",
    "source_city_id",
    "target_city_id",
    "sources",
    "information_basis",
    "last_verified",
    "created_at",
    "updated_at"
  ],
  "additionalProperties": false
} as const;

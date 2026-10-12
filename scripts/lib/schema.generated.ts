// Generated from data/schema/organization.schema.json; do not edit.
export default {
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "title": "Organization",
  "type": "object",
  "properties": {
    "schema_version": {
      "const": 2
    },
    "id": {
      "type": "string",
      "pattern": "^[a-z0-9]+(?:-[a-z0-9]+)*$"
    },
    "names": {
      "type": "object",
      "properties": {
        "zh": {
          "anyOf": [
            {
              "type": "string",
              "minLength": 1,
              "maxLength": 160,
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
              "maxLength": 160,
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
    "translated_name_locales": {
      "type": "array",
      "items": {
        "enum": [
          "zh",
          "en"
        ]
      },
      "uniqueItems": true,
      "minItems": 0
    },
    "aliases": {
      "type": "array",
      "items": {
        "type": "string",
        "minLength": 1,
        "maxLength": 160,
        "pattern": "\\S"
      },
      "uniqueItems": true,
      "minItems": 0,
      "maxItems": 10
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
    "categories": {
      "type": "array",
      "items": {
        "enum": [
          "community_culture",
          "student_alumni",
          "professional",
          "civic_advocacy",
          "feminist",
          "lgbtq",
          "religion",
          "mutual_aid",
          "media",
          "arts_intellectual",
          "other"
        ]
      },
      "uniqueItems": true,
      "minItems": 0
    },
    "keywords": {
      "type": "array",
      "items": {
        "type": "string",
        "minLength": 1,
        "maxLength": 80,
        "pattern": "\\S"
      },
      "uniqueItems": true,
      "minItems": 0,
      "maxItems": 15
    },
    "locations": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "city_id": {
            "type": [
              "string",
              "null"
            ],
            "minLength": 1
          },
          "country_code": {
            "type": "string",
            "pattern": "^[A-Z]{2}$"
          }
        },
        "required": [
          "city_id",
          "country_code"
        ],
        "additionalProperties": false
      },
      "uniqueItems": true,
      "minItems": 0
    },
    "online_only": {
      "type": "boolean"
    },
    "links": {
      "type": "array",
      "items": {
        "type": "object",
        "properties": {
          "kind": {
            "enum": [
              "website",
              "social"
            ]
          },
          "url": {
            "type": "string",
            "format": "uri",
            "pattern": "^https://[^/\\s]+(?:/[^\\s]*)?$"
          }
        },
        "required": [
          "kind",
          "url"
        ],
        "additionalProperties": false
      },
      "uniqueItems": true,
      "minItems": 1
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
                "identity",
                "scope",
                "location",
                "activity",
                "affiliation",
                "founded",
                "reach",
                "contact"
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
    "activity_status": {
      "enum": [
        "active",
        "inactive",
        "unknown"
      ]
    },
    "affiliation": {
      "type": "object",
      "properties": {
        "kind": {
          "enum": [
            "independent",
            "government_linked",
            "unclear"
          ]
        },
        "explanation": {
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
        "source_urls": {
          "type": "array",
          "items": {
            "type": "string",
            "format": "uri",
            "pattern": "^https://[^/\\s]+(?:/[^\\s]*)?$"
          },
          "uniqueItems": true,
          "minItems": 0
        }
      },
      "required": [
        "kind",
        "explanation",
        "source_urls"
      ],
      "additionalProperties": false
    },
    "inclusion_basis": {
      "type": "string",
      "minLength": 1,
      "maxLength": 600,
      "pattern": "\\S"
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
    },
    "kind": {
      "enum": [
        "primary",
        "institution"
      ]
    },
    "institution_type": {
      "anyOf": [
        {
          "enum": [
            "culture",
            "education",
            "ngo",
            "municipality_public",
            "migrant_diaspora",
            "media",
            "foundation_funder",
            "commercial",
            "state_affiliated",
            "other"
          ]
        },
        {
          "type": "null"
        }
      ]
    },
    "founded_year": {
      "type": [
        "integer",
        "null"
      ],
      "minimum": 1000,
      "maximum": 9999
    },
    "reach": {
      "anyOf": [
        {
          "type": "null"
        },
        {
          "type": "object",
          "properties": {
            "scope": {
              "enum": [
                "local",
                "regional",
                "national",
                "transnational",
                "online",
                "unclear"
              ]
            },
            "summary": {
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
            "source_urls": {
              "type": "array",
              "items": {
                "type": "string",
                "format": "uri",
                "pattern": "^https://[^/\\s]+(?:/[^\\s]*)?$"
              },
              "minItems": 1,
              "uniqueItems": true
            }
          },
          "required": [
            "scope",
            "summary",
            "source_urls"
          ],
          "additionalProperties": false
        }
      ]
    },
    "public_contacts": {
      "type": "array",
      "uniqueItems": true,
      "items": {
        "type": "object",
        "properties": {
          "kind": {
            "enum": [
              "contact_page",
              "role_email"
            ]
          },
          "value": {
            "type": "string",
            "minLength": 1,
            "maxLength": 600,
            "pattern": "\\S"
          },
          "source_url": {
            "type": "string",
            "format": "uri",
            "pattern": "^https://[^/\\s]+(?:/[^\\s]*)?$"
          }
        },
        "required": [
          "kind",
          "value",
          "source_url"
        ],
        "additionalProperties": false
      }
    },
    "information_basis": {
      "enum": [
        "public_documentation",
        "organization_contribution",
        "organization_reviewed"
      ]
    }
  },
  "required": [
    "schema_version",
    "id",
    "names",
    "translated_name_locales",
    "aliases",
    "descriptions",
    "categories",
    "keywords",
    "locations",
    "online_only",
    "links",
    "sources",
    "activity_status",
    "affiliation",
    "inclusion_basis",
    "last_verified",
    "created_at",
    "updated_at",
    "kind",
    "institution_type",
    "founded_year",
    "reach",
    "public_contacts",
    "information_basis"
  ],
  "additionalProperties": false,
  "allOf": [
    {
      "if": {
        "properties": {
          "kind": {
            "const": "primary"
          }
        }
      },
      "then": {
        "properties": {
          "categories": {
            "minItems": 1
          },
          "institution_type": {
            "type": "null"
          }
        }
      },
      "else": {
        "properties": {
          "institution_type": {
            "type": "string"
          }
        }
      }
    }
  ]
} as const;

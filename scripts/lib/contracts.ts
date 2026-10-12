import type { FromSchema } from 'json-schema-to-ts';
import schema from './schema.generated';
import relationshipSchema from './relationship-schema.generated';
export type Organization = FromSchema<typeof schema>;
export type Relationship = FromSchema<typeof relationshipSchema>;
export type Locale = 'en' | 'zh-CN';
export type ActivityStatus = Organization['activity_status'];
export type Labels = { zh: string; en: string };
export interface Category {
  id: string;
  labels: Labels;
}
export interface Country {
  code: string;
  names: Labels;
  aliases: string[];
}
export interface City {
  id: string;
  country_code: string;
  names: Labels;
  aliases: string[];
  latitude: number;
  longitude: number;
  source: {
    url: string;
    title: string;
    accessed_at: string;
    reuse_basis: string;
    license_note?: string;
  };
}
export interface ReferenceData {
  categories: Category[];
  countries: Country[];
  cities: City[];
}
export interface Dataset {
  schema_version: 2;
  dataset_version: string;
  generated_at: string;
  license: string;
  attribution: string;
  reference_data: ReferenceData;
  organizations: Organization[];
  relationships: Relationship[];
}
export interface ValidationIssue {
  file: string;
  path: string;
  code: string;
  message: string;
}
export interface DuplicateDecision {
  ids: [string, string];
  reason: string;
}
export interface ReviewReport {
  staleIds: string[];
  duplicatePairs: DuplicateDecision[];
}
export interface Statistics {
  dataset_version: string;
  total: number;
  byActivity: Record<ActivityStatus, number>;
  stale: number;
  onlineOnly: number;
  byCountry: Record<string, number>;
  byCategory: Record<string, number>;
  byCity: Record<string, number>;
  institutions: number;
  relationships: number;
  byRelationshipType: Record<string, number>;
  byPeriodStatus: Record<string, number>;
}
export interface AtlasState {
  q: string;
  categories: string[];
  country: string | null;
  city: string | null;
  statuses: ActivityStatus[];
  onlineOnly: boolean;
  page: number;
  kind: 'primary' | 'institution' | 'all';
  institution: string | null;
  relationshipTypes: ('bonding' | 'bridging' | 'linking' | 'unclassified')[];
  periodStatuses: ('current' | 'past' | 'unknown')[];
  selectedNodeId: string | null;
  selectedRelationshipId: string | null;
}

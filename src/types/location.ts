export interface OpenmrsLink {
  rel: string;
  uri: string;
  resourceAlias?: string;
}

export interface LocationReference {
  uuid: string;
  display: string;
  name?: string;
  links?: OpenmrsLink[];
}

export interface LocationTag extends LocationReference {
  retired?: boolean;
}

export interface QueueLocation extends LocationReference {
  tags?: LocationTag[];
  parentLocation?: QueueLocation;
  childLocations?: LocationReference[];
  retired?: boolean;
  attributes?: unknown[];
}

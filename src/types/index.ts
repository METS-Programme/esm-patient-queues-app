export interface NewVisitPayload {
  uuid?: string;
  location: string;
  patient?: string;
  startDatetime: Date;
  visitType: string;
  stopDatetime?: Date;
  attributes?: Array<{
    attributeType: string;
    value: string;
  }>;
}

export interface ProviderAttribute {
  attributeType: {
    display: string;
  };
  value: string | { uuid: string; display?: string };
}

export interface ProviderResponse {
  uuid: string;
  display: string;
  identifier: string;
  attributes: ProviderAttribute[];
  retired: boolean;
}

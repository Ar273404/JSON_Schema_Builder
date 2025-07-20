export interface SchemaField {
  id: string;
  name: string;
  type: 'string' | 'number' | 'nested';
  value?: any;
  children?: SchemaField[];
}

export interface SavedObject {
  id: string;
  name: string;
  data: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

import { SchemaField } from '@/types/schema';

export const generateJsonSchema = (fields: SchemaField[]): Record<string, any> => {
  const result: Record<string, any> = {};

  fields.forEach((field) => {
    // Only include fields that have a name
    if (!field.name || !field.name.trim()) return;

    switch (field.type) {
      case 'string':
        result[field.name] = field.value || '';
        break;
      case 'number':
        result[field.name] = field.value !== undefined && field.value !== '' ? Number(field.value) : 0;
        break;
      case 'nested':
        if (field.children && field.children.length > 0) {
          const nestedObject = generateJsonSchema(field.children);
          if (Object.keys(nestedObject).length > 0) {
            result[field.name] = nestedObject;
          }
        }
        break;
    }
  });

  return result;
};
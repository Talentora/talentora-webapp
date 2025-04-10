interface ProcessDataConfig {
  rowFields: string[];
  colFields: string[];
  valueFields: string[];
  aggregation?: string;
}

type ProcessedData = Record<string, any>[];

type DataItem = Record<string, any>;
type GroupedData = Record<string, DataItem[]>;

// Helper function to get nested value from an object using dot notation
const getNestedValue = (obj: Record<string, any>, path: string): any => {
  if (!path) return undefined;
  
  const keys = path.split('.');
  return keys.reduce((o, key) => {
    if (o && typeof o === 'object') {
      // Handle array access with [0] notation
      if (key.includes('[') && key.includes(']')) {
        const arrayKey = key.substring(0, key.indexOf('['));
        const index = parseInt(key.substring(key.indexOf('[') + 1, key.indexOf(']')));
        return o[arrayKey] && Array.isArray(o[arrayKey]) ? o[arrayKey][index] : undefined;
      }
      return o[key];
    }
    return undefined;
  }, obj);
};

// Process data for charts
export const processData = (data: DataItem[], config: ProcessDataConfig): ProcessedData => {
  if (!data.length) return [];

  // Group data by row fields
  const groupedData = data.reduce<GroupedData>((acc, item) => {
    const rowKey = config.rowFields.map(field => {
      const value = getNestedValue(item, field);
      return value !== undefined ? value : 'Unknown';
    }).join(' - ');

    if (!acc[rowKey]) {
      acc[rowKey] = [];
    }
    acc[rowKey].push(item);
    return acc;
  }, {});

  // Process each group based on aggregation
  return Object.entries(groupedData).map(([key, group]) => {
    const result: Record<string, any> = {
      [config.rowFields[0]]: key
    };

    // Handle value fields
    if (config.valueFields.length > 0) {
      config.valueFields.forEach(field => {
        const values = group
          .map(item => getNestedValue(item, field))
          .filter((v): v is number => v !== undefined && !isNaN(Number(v)));
        
        switch (config.aggregation) {
          case 'sum':
            result[field] = values.reduce((sum, v) => sum + v, 0);
            break;
          case 'average':
            result[field] = values.length ? 
              values.reduce((sum, v) => sum + v, 0) / values.length : 
              0;
            break;
          case 'min':
            result[field] = values.length ? Math.min(...values) : 0;
            break;
          case 'max':
            result[field] = values.length ? Math.max(...values) : 0;
            break;
          case 'count':
          default:
            result[field || 'value'] = values.length;
        }
      });
    } else {
      // Default to count if no value fields specified
      result.value = group.length;
    }

    return result;
  });
}; 
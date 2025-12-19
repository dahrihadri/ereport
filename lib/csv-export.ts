// CSV Export Utility Functions

export function downloadCSV(data: string, filename: string) {
  const blob = new Blob([data], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export function convertToCSV(data: any[], headers: string[]): string {
  const headerRow = headers.join(',');
  const rows = data.map(item => {
    return headers.map(header => {
      const value = item[header];
      // Handle values that might contain commas or quotes
      if (value === null || value === undefined) return '';
      const stringValue = String(value);
      if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
        return `"${stringValue.replace(/"/g, '""')}"`;
      }
      return stringValue;
    }).join(',');
  });

  return [headerRow, ...rows].join('\n');
}

export function exportToCSV<T extends Record<string, any>>(
  data: T[],
  filename: string,
  columnMapping: Record<keyof T, string>
) {
  const headers = Object.keys(columnMapping);
  const csvData = data.map(item => {
    const row: any = {};
    headers.forEach(key => {
      const value = item[key];
      // Format dates
      if (value instanceof Date) {
        row[key] = value.toISOString().split('T')[0];
      }
      // Format arrays (for multi-select fields)
      else if (Array.isArray(value)) {
        row[key] = value.join('; ');
      }
      // Format booleans
      else if (typeof value === 'boolean') {
        row[key] = value ? 'Yes' : 'No';
      }
      else {
        row[key] = value;
      }
    });
    return row;
  });

  const csv = convertToCSV(csvData, headers);
  downloadCSV(csv, filename);
}

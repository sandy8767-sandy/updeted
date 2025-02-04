export const parseLogFile = (content: string): any[] => {
  try {
    // Try parsing as JSON array first
    return JSON.parse(content);
  } catch {
    // If not JSON, try parsing line by line
    return content
      .split('\n')
      .filter(line => line.trim())
      .map(line => {
        try {
          // Try parsing each line as JSON
          return JSON.parse(line);
        } catch {
          // If not JSON, try parsing common log formats
          const timestamp = new Date().toISOString(); // Extract timestamp if possible
          return {
            timestamp,
            level: detectLogLevel(line),
            message: line.trim(),
            source: 'unknown'
          };
        }
      });
  }
};

const detectLogLevel = (line: string): 'info' | 'warn' | 'error' | 'debug' => {
  const lowerLine = line.toLowerCase();
  if (lowerLine.includes('error')) return 'error';
  if (lowerLine.includes('warn')) return 'warn';
  if (lowerLine.includes('debug')) return 'debug';
  return 'info';
};
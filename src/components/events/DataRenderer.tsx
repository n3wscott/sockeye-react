import React, { memo } from 'react';
import { Box } from '@mui/material';
import JSONPretty from 'react-json-pretty';
import { CloudEvent } from '../../types';

interface DataRendererProps {
  event: CloudEvent;
}

function parseQuotedData(data: any): any {
  if (typeof data === 'string' && data.startsWith('"') && data.endsWith('"')) {
    try {
      return JSON.parse(data);
    } catch {
      return data;
    }
  }
  return data;
}

function DataRenderer({ event }: DataRendererProps) {
  let data = event.data;
  
  // Handle base64 encoded data
  if (event.data_base64) {
    try {
      data = atob(event.data_base64);
    } catch (err) {
      console.error('Failed to decode base64 data:', err);
      data = event.data_base64;
    }
  }

  const mediaType = event.datacontenttype || 'text/plain';
  const parsedData = parseQuotedData(data);

  // Handle JSON content
  if (mediaType.startsWith('application/json') || mediaType.startsWith('text/json')) {
    try {
      const jsonData = typeof parsedData === 'string' ? JSON.parse(parsedData) : parsedData;
      return (
        <Box>
          <JSONPretty 
            data={jsonData}
            theme={{
              main: 'line-height:1.3;color:#444;background:#fff;overflow:auto;padding:8px;border-radius:4px;border:1px solid #e0e0e0;',
              error: 'line-height:1.3;color:#444;background:#fff;overflow:auto;',
              key: 'color:#881391;',
              string: 'color:#c41a16;',
              value: 'color:#1c00cf;',
              boolean: 'color:#1c00cf;'
            }}
            space={2}
          />
        </Box>
      );
    } catch (err) {
      return (
        <Box component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
          {String(parsedData)}
        </Box>
      );
    }
  }

  // Handle images
  if (mediaType.startsWith('image/')) {
    if (typeof parsedData === 'string' && parsedData.startsWith('data:image/')) {
      return (
        <Box>
          <img 
            src={parsedData} 
            alt="CloudEvent data" 
            style={{ 
              maxWidth: '100%', 
              height: 'auto',
              borderRadius: 4
            }} 
          />
        </Box>
      );
    }
  }

  // Handle XML
  if (mediaType.startsWith('application/xml') || mediaType.startsWith('text/xml')) {
    return (
      <Box component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
        {String(parsedData)}
      </Box>
    );
  }

  // Default: plain text
  return (
    <Box component="pre" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
      {String(parsedData)}
    </Box>
  );
}

export default memo(DataRenderer);
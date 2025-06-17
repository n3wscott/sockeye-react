import React, { memo } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableRow, 
  Paper,
  Box,
  Chip,
  Typography
} from '@mui/material';
import { CloudEvent } from '../../types';
import DataRenderer from './DataRenderer';

interface CloudEventCardProps {
  event: CloudEvent;
}

function CloudEventCard({ event }: CloudEventCardProps) {
  if (!event) {
    return (
      <Paper sx={{ p: 1, mb: 1 }}>
        <Typography color="text.secondary">No event data</Typography>
      </Paper>
    );
  }

  // Filter out data fields and datacontenttype (shown in data area)
  // Only show specversion if it's not the standard "1.0"
  const attributeEntries = Object.entries(event).filter(
    ([key, value]) => {
      if (key === 'data' || key === 'data_base64' || key === 'datacontenttype') {
        return false;
      }
      if (key === 'specversion' && value === '1.0') {
        return false;
      }
      return true;
    }
  );

  return (
    <Paper variant="outlined" sx={{ mb: 1 }}>
      <Box display="flex">
        {/* Attributes Table - Left Side */}
        <Box flex="0 0 300px">
          <TableContainer>
            <Table size="small">
              <TableBody>
                {attributeEntries.map(([key, value]) => (
                  <TableRow key={key}>
                    <TableCell 
                      component="th" 
                      scope="row" 
                      sx={{ 
                        fontWeight: 'medium', 
                        width: '80px',
                        py: 0.25,
                        px: 1,
                        fontSize: '0.75rem',
                        borderBottom: '1px solid rgba(224, 224, 224, 0.5)'
                      }}
                    >
                      {key}
                    </TableCell>
                    <TableCell sx={{ 
                      py: 0.25, 
                      px: 1,
                      fontSize: '0.75rem',
                      borderBottom: '1px solid rgba(224, 224, 224, 0.5)'
                    }}>
                      {key === 'time' && value ? (
                        new Date(value).toLocaleString()
                      ) : (
                        String(value || '')
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>

        {/* Data Display - Right Side */}
        <Box 
          flex="1" 
          sx={{ 
            borderLeft: '1px solid rgba(224, 224, 224, 0.5)',
            minHeight: '100px',
            position: 'relative'
          }}
        >
          {/* Content type in upper right */}
          {event.datacontenttype && (
            <Box 
              sx={{ 
                position: 'absolute',
                top: 4,
                right: 8,
                fontSize: '0.7rem',
                color: 'text.secondary',
                fontFamily: 'monospace'
              }}
            >
              {event.datacontenttype}
            </Box>
          )}
          
          {/* Data content */}
          <Box sx={{ p: 1, pt: event.datacontenttype ? 3 : 1, width: '100%' }}>
            <DataRenderer event={event} />
          </Box>
        </Box>
      </Box>
    </Paper>
  );
}

export default memo(CloudEventCard);
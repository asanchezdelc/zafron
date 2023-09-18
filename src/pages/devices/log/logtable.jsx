import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
} from '@tremor/react';

import { formatTime } from '../../../services/utils';

function NoData() {
  return (
    <div className='mt-5 recharts-responsive-container h-full w-full' height="112" style={{'width': '100%', 'height': '100%'}}>
       <div className='tremor-Flex-root flex flex-row justify-center items-center w-full h-full border border-dashed rounded-tremor-default border-tremor-border dark:border-tdark-remor-border'>
        <div className='text-tremor-default text-tremor-content dark:text-dark-tremor-content p-10'>No data</div>
      </div>
    </div>
   
  )
}

function getDate(date) {
  return new Date(date.year, date.month - 1, date.day, date.hour, date.minute);
}

function flattenMeasurements(measurements) {
  return measurements.map((measurement) => {
    console.log(measurement)
    return {
      channel: measurement.metadata.channel,
      value: measurement.value,
      unit: measurement.metadata.unit,
      type: measurement.metadata.type,
    };
  });
}

export default function LogTable({ logs }) {
  return (
    (logs.readings && logs.readings.length === 0) ? <NoData /> : ( <>
    <Table className="mt-6">
      <TableHead className='border-gray-500'>
        <TableRow>
          <TableHeaderCell>Time</TableHeaderCell>
          <TableHeaderCell>Type</TableHeaderCell>
          <TableHeaderCell>Value</TableHeaderCell>
          <TableHeaderCell>Unit</TableHeaderCell>
          <TableHeaderCell>Channel</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {logs.readings.map((log) => (
          <TableRow key={log.timestamp}>
            <TableCell>
              {formatTime(log.timestamp)}
            </TableCell>
            
            <TableCell>{log.metadata.type}</TableCell>
            <TableCell>{log.value}</TableCell>
            <TableCell>{log.metadata.unit}</TableCell>
            <TableCell>
            {log.metadata.channel}
            </TableCell>            
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </>  
    )
  );
}

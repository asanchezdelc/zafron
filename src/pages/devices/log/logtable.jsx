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

export default function LogTable({ logs }) {
  return (
    (logs.readings && logs.readings.length === 0) ? <NoData /> : ( <>
    <Table className="mt-6">
      <TableHead className='border-gray-500'>
        <TableRow>
          <TableHeaderCell>Time</TableHeaderCell>
          <TableHeaderCell>Log</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {logs.readings.map((log) => (
          <TableRow key={log._id}>
            <TableCell>
              {formatTime(log.timestamp)}
            </TableCell>
            <TableCell>
              <code>
               {JSON.stringify(log.readings)}
               </code>
            </TableCell>              
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </>  
    )
  );
}

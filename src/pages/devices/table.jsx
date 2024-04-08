import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
  Button,
} from '@tremor/react';

import { Link } from "react-router-dom";
import { toFriendlyTime } from '../../services/utils';

export default function DevicesTable({ devices, onDelete }) {
  return (
    <Table>
      <TableHead className='bg-gray-50'>
        <TableRow>
          <TableHeaderCell>Serial</TableHeaderCell>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Type</TableHeaderCell>
          <TableHeaderCell>Last Seen</TableHeaderCell>
          {/* <TableHeaderCell></TableHeaderCell> */}
        </TableRow>
      </TableHead>
      <TableBody>
        {devices.map((device) => (
          <TableRow key={device._id}>
            <TableCell>
              <Link to={`/devices/${device._id}`} className="inline-flex items-center gap-1 text-tremor-brand hover:underline hover:underline-offset-4">
                {device.serial}
              </Link>
            </TableCell>
            <TableCell>
              <Link to={`/devices/${device._id}`}>{device.name}</Link>
            </TableCell>
            <TableCell>
              { device.type ? device.type : 'mqtt' }
            </TableCell>
            <TableCell>
              { (device.lastOnline) ? toFriendlyTime(device.lastOnline): <Badge size="xs">Never Seen</Badge> }
            </TableCell>
            {/* <TableCell>
              <Button size='xs' className="mr-5" variant='secondary'>
                <Cog6ToothIcon className="h-5 w-5 text-blue-500"/>
              </Button>
            </TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

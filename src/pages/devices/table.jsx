import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Badge,
} from '@tremor/react';

import { Link } from "react-router-dom";
import { toFriendlyTime } from '../../services/utils';

export default function DevicesTable({ devices, onDelete }) {
  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Serial</TableHeaderCell>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Last Online</TableHeaderCell>
          {/* <TableHeaderCell></TableHeaderCell> */}
        </TableRow>
      </TableHead>
      <TableBody>
        {devices.map((device) => (
          <TableRow key={device._id}>
            <TableCell>
              <Link to={`/devices/${device._id}`}>
                {device.serial}
              </Link>
            </TableCell>
            <TableCell>
              <Link to={`/devices/${device._id}`}>{device.name}</Link>
            </TableCell>
            <TableCell>
              { (device.lastOnline) ? toFriendlyTime(device.lastOnline): <Badge size="xs">Never Seen</Badge> }
            </TableCell>
            {/* <TableCell>
              <Button size='xs' className="mr-5" variant='secondary'>
                <CogIcon className="h-5 w-5 text-blue-500"/>
              </Button>
              <Button size='xs' onClick={() => onDelete(device._id)} variant='secondary' className='border-red-500'>
                <TrashIcon className="h-5 w-5 text-red-500"/>
              </Button>
            </TableCell> */}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

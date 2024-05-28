import React, { useState } from "react";
import {
  Table,
  TableHead,
  TableHeaderCell,
  TableBody,
  TableRow,
  TableCell,
  Button
} from "@tremor/react";
import { TrashIcon } from '@heroicons/react/24/outline';
import { Link } from "react-router-dom";

const ProfilesTable = ({ profiles, onDelete }) => { 
  const [copied, setCopied] = useState(false);

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Source</TableHeaderCell>
          <TableHeaderCell></TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {profiles.map((profile) => (
          <TableRow key={profile._id}>
            <TableCell><Link to={`/profiles/${profile._id}/settings`} className="inline-flex items-center gap-1 text-tremor-brand hover:underline hover:underline-offset-4">{profile.name}</Link></TableCell>
            <TableCell>{profile.source.name}</TableCell>
            <TableCell>
              <Button 
                variant="secondary" 
                color="red" 
                size="xs" 
                onClick={() => onDelete(profile._id)} 
                icon={TrashIcon}>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default ProfilesTable;
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
import { TrashIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline';
import { set } from "mongoose";

const APP_URL = process.env.REACT_APP_HOSTNAME || 'app.zafron.dev';

const SourcesTable = ({ sources, onDelete }) => { 
  const [copied, setCopied] = useState(false);
  const getEndpoint = (source) => {
    return `https://${APP_URL}/api/ingress/${source.maskId}?apiKey=${source.apiKey}`;
  }

  const onCopy = (source) => {
    copyToClipboard(getEndpoint(source));
    setCopied(source._id);
    setTimeout(() => {
      setCopied(null);
    }, 3000);
  }

  const copyToClipboard = (value) => {
    navigator.clipboard.writeText(value);
    // You can add some visual feedback here if you like
  };

  return (
    <Table>
      <TableHead>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Provider</TableHeaderCell>
          <TableHeaderCell>Endpoint</TableHeaderCell>
          <TableHeaderCell></TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {sources.map((source) => (
          <TableRow key={source._id}>
            <TableCell>{source.name}</TableCell>
            <TableCell>{source.provider}</TableCell>
            <TableCell>
              <a href={getEndpoint(source)} onClick={(e) => e.preventDefault()}>{`${APP_URL}...?apiKey=${source.apiKey}`}</a>
              <span> </span><Button variant="light" onClick={() => onCopy(source)} size="xs" icon={DocumentDuplicateIcon}></Button>
              {' '}{copied === source._id && <span>Copied</span>}
            </TableCell>
            <TableCell>
              <Button 
                variant="secondary" 
                color="red" 
                size="xs" 
                onClick={() => onDelete(source._id)} 
                icon={TrashIcon}>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export default SourcesTable;
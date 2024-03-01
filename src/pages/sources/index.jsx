import React, { useState, useEffect } from 'react';
import { Card, Title, Button, Flex, Text, Divider } from '@tremor/react';
import SourceTable from './table';
import SourceForm from './form';
import { Dialog, DialogPanel } from "@tremor/react";
import Nav from '../../components/nav';

import * as sourcesAPI from '../../services/sources';

export default function Sources() {
  const [sources, setSources] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [isOpen, setIsOpen] = React.useState(false);
  const [newSource, setNewSource] = useState('');

  const refresh = async () => {
    try {
      await getSources();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onDelete = async (id) => {
    console.log(id);
    try {
      await sourcesAPI.remove(id);
      await getSources();
    } catch (error) {
      console.error(error);
    }
  }

  const getSources = async () => {
    try {
      const response = await sourcesAPI.list(page, limit);
      setSources(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error(error);
    }
  }

  // Read operation
  useEffect(() => {
    getSources();
  }, []);

  // Add functions for Create, Update, and Delete operations here

  return (
    <div>
    <Nav />
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Flex>
        <div>
          <Title>Sources</Title>
          <Text>
            Sources are endpoints to send data to Zafron via HTTP. 
          </Text>
        </div>
        <div>
          <Button variant="primary" size='xs' onClick={() => setIsOpen(true)}>New Source</Button>
        </div>
      </Flex>
      <Divider />
      <Card className="mt-6">
      {sources.length > 0  ? ( <SourceTable sources={sources} onDelete={onDelete} /> ) : (
          <div>
            <Text className='pb-4'>Create a new source to receive data from other platforms such as a LoRaWAN Network Server or Particle.io</Text>
            <Button variant="primary" size='xs' onClick={() => setIsOpen(true)}>Create Source</Button>
          </div> )} 
      </Card>
  </main>
    <Dialog open={isOpen} onClose={(val) => setIsOpen(val)} static={true}>
      <DialogPanel>
        <SourceForm onCancel={refresh} />
      </DialogPanel>
    </Dialog>
  </div>
  );
};
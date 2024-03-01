import React, { useState, useEffect } from 'react';
import { Card, Title, Button, Flex, Text, Divider } from '@tremor/react';
import ProfilesTable from './table';
import ProfileForm from './form';
import { Dialog, DialogPanel } from "@tremor/react";
import Nav from '../../components/nav';

import * as profilesAPI from '../../services/profiles';

export default function Profiles() {
  const [profiles, setProfiles] = useState([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [isOpen, setIsOpen] = React.useState(false);

  const refresh = async () => {
    try {
      await getProfiles();
      setIsOpen(false);
    } catch (error) {
      console.error(error);
    }
  };

  const onDelete = async (id) => {
    console.log(id);
    try {
      await profilesAPI.remove(id);
      await getProfiles();
    } catch (error) {
      console.error(error);
    }
  }

  const getProfiles = async () => {
    try {
      const response = await profilesAPI.list(page, limit);
      setProfiles(response.data);
      setTotal(response.total);
    } catch (error) {
      console.error(error);
    }
  }

  // Read operation
  useEffect(() => {
    getProfiles();
  }, []);

  return (
    <div>
    <Nav />
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Flex>
        <div>
          <Title>Profiles</Title>
          <Text>
            Profiles are device definitions that allow you to define the data format and protocol for your devices.
          </Text>
        </div>
        <div>
          <Button variant="primary" size='xs' onClick={() => setIsOpen(true)}>New Profile</Button>
        </div>
      </Flex>
      <Divider />
      <Card className="mt-6">
      {profiles.length > 0  ? ( <ProfilesTable profiles={profiles} onDelete={onDelete} /> ) : (
          <div>
            <Text className='pb-4'>Create a new profile and define data format and decoder for your devices.</Text>
            <Button variant="primary" size='xs' onClick={() => setIsOpen(true)}>Create Profile</Button>
          </div> )} 
      </Card>
  </main>
    <Dialog open={isOpen} onClose={(val) => setIsOpen(val)} static={true}>
      <DialogPanel>
        <ProfileForm onCancel={refresh} />
      </DialogPanel>
    </Dialog>
  </div>
  );
};
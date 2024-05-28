import React, { useEffect, useState } from 'react';
import { z } from "zod";
import { Flex, Button, Title, TextInput, Text, Select, SelectItem } from '@tremor/react';
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as sourceAPI from '../../services/sources';

// source schema
const sourceSchema = z.object({
  name: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }).min(2),
  provider: z.string({
    required_error: "Provider is required",
    invalid_type_error: "Provider must be a string",
  })
});

const providers = [
  { id: 1, name: 'ChirpStack V3', value: 'chirpstackv3' },
  { id: 2, name: 'ChirpStack V4', value: 'chirpstackv4' },
  { id: 3, name: 'TheThingsNetwork V3', value: 'ttnv3' },
  { id: 6, name: 'Helium', value: 'helium' },
];

export default function SourceForm({ onCancel, source }) {
  const [loading, setLoading] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(source?.provider || '');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: zodResolver(sourceSchema),
  });

  const onSubmitEvent = async (data) => {
    try {
      setLoading(true);
      await sourceAPI.create(data);
      reset({ name: '', provider: '' });
      onCancel();
      setLoading(false);
    } catch (err) {
      console.log(err);
    }
  };

  const handleProviderChange = (value) => {
    setSelectedProvider(value);
    setValue('provider', value); // manually set the value in react-hook-form
  };

  useEffect(() => {
    register('provider'); // register provider field manually
  }, [register]);

  return (
    <div>
      <Flex className='pb-2 mb-2'>
        {/* <h3 className='text-lg font-semibold text-gray-700'>{'Create Source'}</h3> */}
        <Title>{'Create Source'}</Title>
        <button type="button" onClick={onCancel} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
          <XMarkIcon className='h-5' />
          <span className="sr-only">Close modal</span>
        </button>
      </Flex>
      <Text>Sources are endpoints to receive data from 3rd party platforms such as a LoRaWAN Network Server. 
       </Text>
      <div className="form-box mt-6 mb-6">
        <form onSubmit={handleSubmit(onSubmitEvent)}>
          <div className="form-group mb-6">
            <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">Name <span className='text-red-700'>*</span></label>
            <TextInput
              placeholder="Chirpstack NS"
              error={errors.name} 
              errorMessage={errors.name?.message}
              value={source?.name}
              type="text"
              {...register('name')}
            />
          </div>
          <div className="form-group mb-6">
            <label htmlFor="provider" className="block text-sm font-bold text-gray-700 mb-2">Provider <span className='text-red-700'>*</span></label>
            <Select 
              error={errors.provider} 
              errorMessage={errors.provider?.message}
              name="provider"
              value={selectedProvider}
              onValueChange={handleProviderChange}>
              { providers.map((provider) => (
                <SelectItem key={provider.id} value={provider.value}>
                  {provider.name}
                </SelectItem>
              ))}
            </Select>
            <Text className='mt-2'> Don't see a provider? Create a topic 
        on 
         <a href="https://github.com/asanchezdelc/zafron/discussions"> Github</a> or <a href="mailto:hello@zafron.dev">email us.</a></Text>
          </div>
          <div className="form-group">
            
          </div>
          <div className="footer mt-10">
            <Flex justifyContent="center" >
              <Button variant="primary" type="submit" className='w-full' loading={loading}>Create Source</Button>
            </Flex>
          </div>
        </form>
      </div>
      
    </div>
  )
}
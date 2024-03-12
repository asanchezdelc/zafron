import React, { useEffect, useState } from 'react';
import { z } from "zod";
import { Flex, Button, Title, TextInput, Text } from '@tremor/react';
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
  //const [name, setName] = useState(source?.name || '');
  //const [provider, setProvider] = useState(source?.provider || 'chirpstackv3');
  const [action, setAction] = useState('Create');
  const [disabled, setDisabled] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(sourceSchema),
  });

  const onSubmitEvent = async (data) => {
    try {
      setDisabled(true);
      await sourceAPI.create(data);
      reset({ name: '', provider: '' });
      onCancel();
      setDisabled(false);
    } catch (err) {
      console.log(err);
    }
  };

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
            <select 
              name="provider"
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              {...register('provider')}>
              { providers.map((provider) => (
                <option key={provider.id} value={provider.value}>
                  {provider.name}
                </option>
              ))}
            </select>
            <Text className='mt-2'> Don't see a provider? Create a topic 
        on 
         <a href="https://github.com/asanchezdelc/zafron/discussions"> Github</a> or <a href="mailto:hello@zafron.dev">email us.</a></Text>
          </div>
          <div className="form-group">
            
          </div>
          <div className="footer mt-10">
            <Flex justifyContent="center" >
              <Button variant="primary" type="submit" className='w-full'
                  disabled={disabled}>Create Source</Button>
            </Flex>
          </div>
        </form>
      </div>
      
    </div>
  )
}
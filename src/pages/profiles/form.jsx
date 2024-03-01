import React, { useEffect, useState } from 'react';
import { Flex, Button, Title, TextInput, Text } from '@tremor/react';
import { XMarkIcon } from "@heroicons/react/24/outline";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as profileAPI from '../../services/profiles';
import * as sourcesAPI from '../../services/sources';
import { Link } from "react-router-dom";

import { profileSchema } from './schema';

export default function ProfileForm({ onCancel, profile }) {
  const [action, setAction] = useState('Create');
  const [disabled, setDisabled] = useState(false);
  const [sources, setSources] = useState([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  const onSubmitEvent = async (data) => {
    if (!data.source) {
      return;
    }
    try {
      setDisabled(true);
      await profileAPI.create(data);
      reset({ name: '', source: '' });
      onCancel();
      setDisabled(false);
    } catch (err) {
      console.log(err);
    }
  };

  const getSources = async () => {
    try {
      const response = await sourcesAPI.list(1, 25);
      setSources(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getSources();
  }, []);

  return (
    <div>
      <Flex className='pb-2 mb-2'>
        <Title>{'Create Profile'}</Title>
        <button type="button" onClick={onCancel} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center">
          <XMarkIcon className='h-5' />
          <span className="sr-only">Close modal</span>
        </button>
      </Flex>
      <Text>
       </Text>
      <div className="form-box mt-6 mb-6">
        <form onSubmit={handleSubmit(onSubmitEvent)}>
          <div className="form-group mb-6">
            <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">Name <span className='text-red-700'>*</span></label>
            <TextInput
              placeholder="Dragino LHT65"
              error={errors.name} 
              errorMessage={errors.name?.message}
              value={profile?.name}
              type="text"
              {...register('name')}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="provider" className="block text-sm font-bold text-gray-700 mb-2">Pick Source <span className='text-red-700'>*</span></label>
            <select 
              name="source"
              className='bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
              {...register('source', { required: true })}>
                <option value="">Select a source</option>
              { sources.map((source) => (
                <option key={source._id} value={source._id}>
                  {source.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-tremor-default text-tremor-content">Don't see a source?  
            {' '}
            <Link to="/sources" className="underline underline-offset-4">Create One</Link></p>
          </div>
          <div className="footer mt-10">
            <Flex justifyContent="center" >
              <Button variant="primary" type="submit" className='w-full'
                  disabled={disabled}>Create Profile</Button>
            </Flex>
          </div>
        </form>
      </div>
      
    </div>
  )
}
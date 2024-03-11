import React, { useState, useEffect } from 'react';
import { Button, TextInput, Card, Flex } from '@tremor/react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from './schema';
import * as profilesAPI from '../../services/profiles';
import * as sourceAPI from '../../services/sources';

const textStyle = 'mt-2 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content';
const selectStyle = 'bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5'
export default function Config({ profile, onUpdate }) {
  const [sources, setSources] = useState([]);
  const [name, setName] = useState(profile?.name);
  const [source, setSource] = useState(profile?.source);
  const disabled = false;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  const onUpdateClick = async (data) => {
    console.log(data)
    await profilesAPI.update(profile._id, { name: name, source: source });
    console.log(data);
    onUpdate();
  };

  const getSources = async () => {
    try {
      const response = await sourceAPI.list();
      console.log(response);
      setSources(response.data);

    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getSources();
    setName(profile?.name);
    setSource(profile?.source);
  }, [profile]);

  return (
    <div>
      <Card>
        <p className={textStyle}>Manage your device profile.</p>
        <form onSubmit={handleSubmit(onUpdateClick)}>
          <div className="form-group mb-6">
            <label htmlFor="name" className="block text-sm font-bold text-gray-700 mb-2">Name 
              <span className='text-red-700'>*</span>
            </label>
            <TextInput
              placeholder="CayenneLLP"
              error={errors.name} 
              onValueChange={setName}
              errorMessage={errors.name?.message}
              value={name}
              type="text"
              {...register('name')}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="provider" className="block text-sm font-bold text-gray-700 mb-2">Pick Source <span className='text-red-700'>*</span></label>
            <select 
              name="source"
              className={selectStyle}
              onChange={(e) => setSource(e.target.value)}
              value={source}
              {...register('source', { required: true })}>
                <option value="">Select a source</option>
              { sources.map((source) => (
                <option key={source._id} value={source._id}>
                  {source.name}
                </option>
              ))}
            </select>
          </div>
          <div className="footer mt-10">
            <Flex justifyContent="center" >
              <Button variant="primary" type="submit" className='w-full'
                  disabled={disabled}>Update Profile</Button>
            </Flex>
          </div>
        </form>
      </Card>
    </div>
  )
}
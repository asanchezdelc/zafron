import React, { useState, useEffect } from 'react';
import { Button, TextInput, Card, Flex, Select, SelectItem } from '@tremor/react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from './schema';
import * as profilesAPI from '../../services/profiles';
import * as sourceAPI from '../../services/sources';
import { useNavigate } from "react-router-dom";


const textStyle = 'mt-2 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content';

export default function Config({ profile }) {
  const navigate = useNavigate();
  const [sources, setSources] = useState([]);
  const [name, setName] = useState(profile?.name || '');
  const [source, setSource] = useState(profile?.source || '');
  const [loading, setLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  const onDeleteClick = async () => {
    setDeleteLoading(true);
    await profilesAPI.remove(profile._id);
    // redirect to profiles page using useNavigate hook
    navigate('/profiles');
    setDeleteLoading(false);
  };

  const onUpdateClick = async (data) => {
    setLoading(true);
    await profilesAPI.update(profile._id, { name: name, source: source });
    setLoading(false);
  };

  const getSources = async () => {
    try {
      const response = await sourceAPI.list();
      setSources(response.data);

    } catch (error) {
      console.error(error);
    }
  }

  const onSourceChange = (val) => {
    setSource(val);
    setValue('source', val);
  }

  useEffect(() => {
    getSources();
    setName(profile?.name || '');
    setSource(profile?.source || '');
  }, [profile]);

  useEffect(() => {
    register('source'); // register provider field manually
  }, [register]);

  return (
    <div>
      <Card>
        <div className='space-y-8'>
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
            <label htmlFor="provider" className="text-sm font-bold text-gray-700 mb-4">Pick Source <span className='text-red-700'>*</span></label>
            <Select 
              name="source"
              onValueChange={onSourceChange}
              value={source}
              >
              { sources.map((source) => (
                <SelectItem key={source._id} value={source._id}>
                  {source.name}
                </SelectItem>
              ))}
            </Select>
          </div>
          <div className="mt-10">
            <Flex justifyContent="between" >
              <Button 
                  variant="secondary" 
                  color="red"
                  loading={deleteLoading}
                  onClick={onDeleteClick}
                  >Delete</Button>

              <Button 
                  variant="primary" 
                  type="submit" 
                  loading={loading}
                  >Update Profile</Button>
              
            </Flex>
          </div>
        </form>
        </div>
      </Card>
    </div>
  )
}
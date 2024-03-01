import { Button, TextInput, Card, Flex } from '@tremor/react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { profileSchema } from './schema';

const labelStyle = 'text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong';
const textStyle = 'mt-2 text-tremor-default leading-6 text-tremor-content dark:text-dark-tremor-content';

export default function Config({ profile }) {
  const sources = [{ _id: '1', name: 'Source 1' }, { _id: '2', name: 'Source 2' }];
  const disabled = false;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(profileSchema),
  });

  const onUpdate = (data) => {
    console.log(data);
  };
  return (
    <div>
      <Card>
        <p className={textStyle}>Manage your device profile.</p>
        <form onSubmit={handleSubmit(onUpdate)}>
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
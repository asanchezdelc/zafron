import React, { useEffect, useState } from 'react';
import {
  Card,
  Title,
  Callout,
  Button,
  TextInput
} from '@tremor/react';

import { TrashIcon, CheckCircleIcon } from '@heroicons/react/24/outline';
import Nav from '../../components/nav';
import DeleteConfirm from '../../components/DeleteConfirm';
import Spinner from '../../components/spinner';
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as userAPI from '../../services/user';

// account schema
const accountSchema = z.object({
  fullname: z.string({
    required_error: "Name is required",
    invalid_type_error: "Name must be a string",
  }).min(2),
  password: z.string().optional(),
  confirmPassword: z.string().optional(),
})
.refine((data) => {
  if (data.password || data.confirmPassword) {
    if (data.password.length < 8 || data.confirmPassword.length < 8) {
      return false;
    }
  }
  return true;
}, {
  path: ["password"],
  message: "Password length does not meet 8 characters size",
})
.refine((data) => {
  if (data.password || data.confirmPassword) {
    return data.password === data.confirmPassword;
  }
  return true;
}, {
  path: ["confirmPassword"],
  message: "Passwords don't match",
});

export default function Account() {
  const [disabled, setDisabled] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [profile, setProfile] = useState({ email: '', name: ''});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({
    resolver: zodResolver(accountSchema),
  });

  const onSubmit = async (data) => {
    try {
      setDisabled(true);
      const resp = await userAPI.updateProfile({
        name: data.fullname,
        password: data.password,
      });
      reset({ fullname: resp.name, email: resp.email, password: '', confirmPassword: '' });
      setSuccess(true);
      setDisabled(false);
      // spinner
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err) {
      console.log(err);
    }
  };

  const onAccountDelete = async () => {
    try {
      setDeleteOpen(false);
      setDisabled(true);      
      setLoading(true);
      await userAPI.deleteAccount();
      localStorage.removeItem('jwt');
      window.location.href = '/login?accountDeleted=true';
    } catch (err) {
      console.log(err);
    }
  }

  useEffect(() => {
    const getUserData = async () => {
      const resp = await userAPI.getUserInfo();
      reset({ fullname: resp.name })
      setProfile(resp);
    };
    getUserData()
    
   
  }, []);

  return (
    <div>
      <Nav />
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>Account Settings</Title>
      <div className='grid grid-cols-2 gap-4 mt-5'>
        <DeleteConfirm 
          isOpen={deleteOpen} 
          onConfirm={onAccountDelete} 
          closeModal={() => setDeleteOpen(false)} 
          message="Are you sure you want to permanently delete your Zafron's account?" 
          inputConfirm={true}
          />
      <Card>
        <form className="px-8 pt-6 pb-8 mb-4" onSubmit={handleSubmit(onSubmit)}>
        { success && 
        <Callout className="mb-4" title="Success" icon={CheckCircleIcon} color="teal">
          Your account is safe and sound.
        </Callout> }
            <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="fullname"
              >
                Name
              </label>
              <TextInput 
                placeholder="Full name" 
                value={profile.name}
                error={errors.fullname} 
                errorMessage={errors.fullname?.message} 
                {...register("fullname")} 
              />
              
            </div>
          <div className="mb-4">
            <label
              className="block mb-2 text-sm font-bold text-gray-700"
              htmlFor="email"
            >
              Email
            </label>
            <input
              className="w-full px-3 py-2 text-sm leading-tight text-gray-700 border rounded appearance-none focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              disabled={true}
              placeholder="Email"
              value={profile.email}
            />
          </div>
          <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="password"
              >
                Password
              </label>
              <TextInput 
                error={errors.password} 
                errorMessage={errors.password?.message} 
                placeholder="Enter password here" 
                type="password" 
                {...register("password")} 
              />
          </div>
          <div className="mb-4">
              <label
                className="block mb-2 text-sm font-bold text-gray-700"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <TextInput 
                error={errors.confirmPassword} 
                errorMessage={errors.confirmPassword?.message} 
                placeholder="Confirm password here" 
                type="password" 
                {...register("confirmPassword")} 
              />
            </div>

          <div className="mb-6">
            <Button 
              type="submit"
              disabled={disabled}
            >
              Update Account
            </Button>
          </div>
        </form>
        <hr />
        <Callout className="mt-4" title="Danger Zone" color="rose">
          <Button 
            onClick={() => setDeleteOpen(true)} 
            disabled={disabled} 
            color="red"
            icon={TrashIcon}
            type="button">
              Delete Account
           </Button>
           { loading && <Spinner />}
          </Callout>
        </Card>
        </div>
      </main>
    </div>
  )
};
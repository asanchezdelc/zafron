import React, { useEffect, useState, useRef, Fragment } from 'react';
import { 
  Flex, 
  TextInput,
  Card,
  Callout,
  Button
} from '@tremor/react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { useNavigate } from "react-router-dom";

import Credentials from '../credentials';
import DeleteConfirm from '../../../components/DeleteConfirm';
import * as devicesAPI from '../../../services/device';
import Alert from '../../../components/alert';

export default function SettingsForm({ device, onUpdate }) {
  const [name, setName] = useState(device.name);
  const [disabled, setDisabled] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const navigate = useNavigate();
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setName(device.name);
  }, [device]);

  const onDeleteConfirm = async () => {
    try {
      setDisabled(true);
      await devicesAPI.removeDevice(device._id);
      navigate('/devices');
    } catch (err) {
      console.error("Error deleting device:", err);
    }
  }

  const validateForm = () => {
    let errors = {};

    if (!name) errors.name = "Name is required";
    setErrors(errors);
    setDisabled(Object.keys(errors).length > 0);
    setTimeout(() => setErrors({}), 5000);
    console.log(errors)
    return Object.keys(errors).length > 0;
  }

  const onSave = async (e) => {
    e.preventDefault();
    try {
      if (validateForm()) return;
      
      await devicesAPI.patchDevice(device._id, { name });
      device.name = name;
      onUpdate(device);
    } catch (err) {
      console.error("Error updating device:", err);
      setDisabled(false);
    }
  }

  const onSetName = (e) => {
    setName(e.target.value);
    setErrors({});
    setDisabled(false);
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      <div>
        <DeleteConfirm 
          isOpen={deleteOpen} 
          onConfirm={onDeleteConfirm} 
          closeModal={() => setDeleteOpen(false)} 
          message="Are you sure you want to delete this device?" 
          />
        <Card>
            {Object.keys(errors).length > 0 && (
            <Alert title="Error" message="Please correct the errors below:">
              {Object.values(errors).map((error, index) => (
                <div key={index}>{error}</div>
              ))}
            </Alert> 
          )}
          <form>
            <div className="grid gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Name</label>
                <TextInput id="name" value={name} placeholder="Humidor" onChange={onSetName}/>
              </div>
            </div>
            <Flex justifyContent={'end'}>
              <Button onClick={onSave} disabled={disabled}>Save</Button>
            </Flex>
          </form>
        </Card>
        <Callout className="mt-4" title="Danger Zone" color="rose">
          <button 
            onClick={() => setDeleteOpen(true)} 
            disabled={disabled} 
            type="button" 
            className="focus:outline-none inline-flex text-white bg-red-600 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2">
            <TrashIcon className='w-5 h-5 mr-2'/>
              Remove Device
           </button>
          </Callout>
      </div>
      <div>
        <Credentials clientId={device.serial} />
      </div>
    </div>  
  )
}
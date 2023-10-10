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

export default function SettingsForm({ device, onUpdate }) {
  const [name, setName] = useState(device.name);
  const [disabled, setDisabled] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const navigate = useNavigate();

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

  const onSave = async () => {
    try {
      setDisabled(true);
      await devicesAPI.patchDevice(device._id, { name });
      device.name = name;
      onUpdate(device);
      setDisabled(false);
    } catch (err) {
      console.error("Error updating device:", err);
      setDisabled(false);
    }
  }

  return (
    <div class="grid grid-cols-2 gap-4">
      <div>
        <DeleteConfirm 
          isOpen={deleteOpen} 
          onConfirm={onDeleteConfirm} 
          closeModal={() => setDeleteOpen(false)} 
          message="Are you sure you want to delete this device?" 
          />
        <Card>
          <form>
            <div className="grid gap-4 mb-4">
              <div>
                <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Name</label>
                <TextInput id="name" value={name} placeholder="Temperature Alert" onChange={(e) => setName(e.target.value)}/>
              </div>
            </div>
            <Flex justifyContent={'end'}>
              <Button onClick={() => onSave({ name })} disabled={disabled}>Save</Button>
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
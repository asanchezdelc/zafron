import { useState, useEffect } from 'react'
import { Dialog } from '@headlessui/react'
import { Button, TextInput, Select, SelectItem, Flex, Text } from '@tremor/react';
import { generateDeviceName, generateSerial } from '../../services/magicwords';
import { Link } from 'react-router-dom';
import DeviceType from './onboarding/devicetype';
import * as profileAPI from '../../services/profiles';

export default function AddDevice({onCancel, onAction}) {
  let [isOpen, setIsOpen] = useState(true)
  let [type, setType] = useState('mqtt')
  const [profile, setProfile] = useState('')
  let [serial, setSerial] = useState(generateSerial())
  let [name, setName] = useState(generateDeviceName())
  const [profiles, setProfiles] = useState([{}])
  const onAddDevice = async (e) => {
    e.preventDefault();
    try {
      onAction({ name, type, serial, profile });
    } catch (err) {
      console.error("Error adding device:", err);
    }
  }

  const getSources = async () => {
    try {
      const response = await profileAPI.list(0, 10);
      setProfiles(response.data);
    } catch (error) {
      console.error(error);
    }
  }

  const validateSerial = (serial) => {
    if (serial.length < 6) {
      return false;
    }

    serial = serial.toUpperCase();
    serial = serial.replace(/[^A-Z0-9]/g, '');
    serial = serial.trim();

    setSerial(serial);

    console.log(serial);

    return true;
  }

  useEffect(() => {
    getSources();
  }, []);

  return (
    /* Use `initialFocus` to force initial focus to a specific ref. */
    <Dialog
      open={isOpen}
      onClose={() => setIsOpen(false)}
    >
      <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
      <div className="fixed inset-0 w-screen overflow-y-auto">
        {/* Container to center the panel */}
        <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-white rounded-lg shadow">
      <Dialog.Panel className="w-full max-w-md">
          <div className="flex items-start justify-between p-4 border-b rounded-t">
                <h3 className="text-xl font-semibold">
                    Add Device
                </h3>
                <button type="button" onClick={() => onCancel(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center" data-modal-hide="defaultModal">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Close modal</span>
                </button>
            </div>
        
          <form className='p-10'>
            <DeviceType onChange={setType} selected={type} />
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900">Name</label>
              <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Device Name" />
            </div>
            <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900">
                { type === 'lora' ? 'Device EUI' : 'Serial'}
              </label>
              <TextInput value={serial} onChange={(e) => validateSerial(e.target.value)} placeholder="Device Serial" />
            </div>
            {/* <div className="mb-6">
              <label className="block mb-2 text-sm font-medium text-gray-900">Type</label>
              <Select value={type} onValueChange={setType} defaultValue='mqtt'>
                <SelectItem value="mqtt">MQTT</SelectItem>
                <SelectItem value="lora">LoRaWAN</SelectItem>
                <SelectItem value="http">HTTP</SelectItem>
              </Select>
            </div> */}
            { (type === 'http' || type === 'lora') &&  (
              <div className="mb-6">
                <label className="block mb-2 text-sm font-medium text-gray-900">Select Profile</label>
                <Select value={profile} onValueChange={setProfile}>
                  { profiles.map((profile) => (
                    <SelectItem value={profile._id}>{profile.name}</SelectItem>
                  ))}
                </Select>
                <Text className='mt-1 mr-2'>Don't see a profile? <Link to="/profiles" className="text-blue-500">Create Profile</Link></Text>
                </div>)
              }
            
            <Flex justifyContent="end" className="space-x-2 border-t pt-4 mt-8">
              <Button variant="secondary" size='xs' onClick={() => onCancel(false)}>Cancel</Button>
              <Button variant="primary" size='xs' onClick={onAddDevice} className='mr-6'>Add Device</Button>
            </Flex>
         </form>
      </Dialog.Panel>
      </div>
      </div>
      </div>
    </Dialog>
  )
}
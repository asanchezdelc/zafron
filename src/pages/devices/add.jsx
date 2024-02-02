import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { Button, TextInput, Select, SelectItem, Flex } from '@tremor/react';
import { generateDeviceName, generateSerial } from '../../services/magicwords';

export default function AddDevice({onCancel, onAction}) {
  let [isOpen, setIsOpen] = useState(true)
  let [type, setType] = useState('mqtt')
  let [serial, setSerial] = useState(generateSerial())
  let [name, setName] = useState(generateDeviceName())

  const onAddDevice = async (e) => {
    e.preventDefault();
    try {
      onAction({ name, type, serial });
    } catch (err) {
      console.error("Error adding device:", err);
    }
  }
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
      <Dialog.Panel>
          <div className="flex items-start justify-between p-4 border-b rounded-t">
                <h3 className="text-xl font-semibold">
                    Add a new device
                </h3>
                <button type="button" onClick={() => onCancel(false)} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center" data-modal-hide="defaultModal">
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Close modal</span>
                </button>
            </div>
        
          <form className='p-10'>
          <div className="mb-6 w-72">
            <label className="block mb-2 text-sm font-medium text-gray-900">Name</label>
            <TextInput value={name} onChange={(e) => setName(e.target.value)} placeholder="Device Name" />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900">Serial</label>
            <TextInput value={serial} onChange={(e) => setSerial(e.target.value)} placeholder="Device Serial" disabled={true} />
          </div>
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium text-gray-900">Type</label>
            <Select value={type} onValueChange={setType} defaultValue='mqtt'>
              <SelectItem value="mqtt">MQTT</SelectItem>
              {/* <SelectItem value="lora">LoRaWAN</SelectItem> */}
            </Select>
            </div>
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
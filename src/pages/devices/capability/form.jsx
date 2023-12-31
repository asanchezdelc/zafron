import React, { useEffect, useState } from 'react';
import { 
  Flex, 
  Button, 
  TextInput,
  Title, 
  List,
  Text,
  ListItem,
  NumberInput,
  Select,
  SelectItem } from '@tremor/react';
import { XMarkIcon } from "@heroicons/react/24/outline";
import Alert from '../../../components/alert';

const properties = ['type', 'channel', 'unit', 'value'];

export default function CapabilityForm({ onCancel, onAction, onRemove, capability }) {
  const [name, setName] = useState('');
  const [channel, setChannel] = useState('');
  const [datatype, setDatatype] = useState('');
  const [disabled, setDisabled] = useState(false);
  const [errors, setErrors] = useState({});
  const [isActuator, setIsActuator] = useState(false);

  const validateForm = () => {
    let errors = {};
    if (!name) errors.name = "Name is required";
    if (isActuator) {
      if (!channel) errors.channel = "Channel is required";
      if (!datatype) errors.datatype = "Datatype is required";
    }
    setErrors(errors);
  };

  useEffect(() => {
    capability.name = capability.name || capability.type;
    setName(capability.name);

    if (capability.type === 'digital_actuator' || capability.type === 'analog_actuator') {
      setIsActuator(true);
      setChannel(capability.channel);
      setDatatype(capability.type);
    }

  }, [capability]);

  const onSubmit = () => {
    validateForm();
    capability.name = name;
    capability.channel = channel;
    capability.type = datatype;
    setDisabled(true);
    onAction(capability);
  };
    
  return (
    <div className="relative">
      <Flex className='border-b pb-2 mb-2'>
        <h3 className='text-lg font-semibold text-gray-700'>Edit Capability</h3>
        <button type="button" onClick={onCancel} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
          <XMarkIcon />
          <span className="sr-only">Close modal</span>
        </button>
      </Flex>
      <div className="form-box">
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
              <TextInput id="name" value={name} placeholder="Temperature Alert" onChange={(e) => setName(e.target.value)}/>
            </div>
          </div>
          { !isActuator && 
        <div>
          <Title className="mt-6 text-sm">Properties</Title>
          <List className="mt-2">
            {properties.map((item) => (
              <ListItem key={item}>
                <Text>{item}</Text>
                <Text>
                  {capability[item]}
                </Text>
              </ListItem>
            ))}
          </List>
        </div>}
        { isActuator && 
        <div>
          <div className='mt-2'>
          <label htmlFor="name" className="block mb-2 text-sm font-medium text-gray-900">Channel</label>
          <NumberInput id="channel" value={channel} placeholder="Channel" onChange={(e) => setChannel(e.target.value)}/>
        </div>
          <div className='mt-2'>
            <label htmlFor="datatype" className="block mb-2 text-sm font-medium text-gray-900">Type</label>
            <Select defaultValue='digital_actuator' value={datatype} onValueChange={setDatatype}>
              <SelectItem value="digital_actuator">Digital Actuator</SelectItem>
              <SelectItem value="analog_actuator">Analog Actuator</SelectItem>
            </Select>
          </div>
          
        </div> }
        <div className='mt-4'>{" "}</div>
      </form>
      <Flex className='border-t'>
        <Button
          className="mt-2 bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Flex>
          { (!capability.new) ? 
        <button
          className="mt-2 ml-2 items-center justify-center text-red-500 text-sm hover:underline"
          onClick={() => onRemove(capability)}
        >
          {/* <PlusIcon /> */}
          <span>Remove Capability</span>
        </button>: <div></div> }
        <button
          disabled={disabled}
          className="mt-2 flex items-center justify-center text-white bg-blue-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
          onClick={onSubmit}
        >
          {/* <PlusIcon /> */}
          <span>{capability.new ? 'Create':'Update'}</span>
        </button>
        </Flex>
        </Flex>
      </div>
      
    </div>
  )
}
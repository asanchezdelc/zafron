import React, { useEffect, useState } from 'react';
import { Card, Title, Flex, Button, TextInput, Select, SelectItem } from '@tremor/react';
import CloseIcon from '../../../components/icons/CloseIcon';
import Alert from '../../../components/alert';
import PlusIcon from '../../../components/icons/PlusIcon';

export default function RuleCRUD({ capabilities, onCancel, onAction }) {
  const [name, setName] = useState('');
  const [capability, setCapability] = useState('');
  const [condition, setCondition] = useState('');
  const [value, setValue] = useState(0);
  const [webhook, setWebhook] = useState('');
  const [email, setEmail] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [actionType, setActionType] = useState('email');
  const [errors, setErrors] = useState({});
  // if capabilities is undefined, return empty div

  const validateForm = () => {
    let errors = {};

    if (!name.trim()) errors.name = "Name is required";
    if (!capability) errors.capability = "Capability is required";
    if (!condition) errors.condition = "Condition is required";
    if (value === 0) errors.value = "Value must not be zero";
    if (actionType === 'webhook' && !webhook.trim()) errors.webhook = "Webhook URL is required when alert type is webhook";
    if (actionType === 'email' && !email.trim()) errors.email = "Email is required when alert type is email";
    else if (actionType === 'email' && !/\S+@\S+\.\S+/.test(email)) errors.email = "Invalid email format";

    setErrors(errors);
    setDisabled(Object.keys(errors).length > 0);
  };

  const onSubmit = () => {
    validateForm();

    // lets check if the form is valid
    const rule = {
      name,
      capability,
      condition,
      value,
      actionType,
      webhook,
      email
    }
    onAction(rule);
  }

  useEffect(() => {
    if (capabilities === undefined) {
      setDisabled(true);
      return;
    }
  }, [capabilities]);



  return (
    <div className="relative">
      <Flex className='border-b pb-2 mb-2'>
        <h3 className='text-lg font-semibold text-gray-700'>Add Rule</h3>
        <button type="button" onClick={onCancel} class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
          <CloseIcon />
          <span class="sr-only">Close modal</span>
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
      <form action="#">
        <div class="grid gap-4 mb-4">
          <div>
            <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Name</label>
            <TextInput value={name} placeholder="Temperature Alert" onChange={(e) => setName(e.target.value)}/>
          </div>
          <div>
            <label for="category" class="block mb-2 text-sm font-medium text-gray-900">Capability</label>
            <Select value={capability} onValueChange={setCapability} defaultValue='1'>
              { capabilities && capabilities.map((capability, index) => (
              <SelectItem key={index} value={capability.channel}>
                {`${capability.name} - Channel ${capability.channel}`}
              </SelectItem>) ) }
            </Select>
            { capabilities === undefined || capabilities.length === 0 ? <small></small> : <div></div>}
          </div>
        <div>
          <label for="category" class="block mb-2 text-sm font-medium text-gray-900">Condition</label>
          <Select value={condition} onValueChange={setCondition} defaultValue='1'>
            <SelectItem value="gt">
              Greater than
            </SelectItem>
            <SelectItem value="lt">
             Less than
            </SelectItem>
            <SelectItem value="eq">
              equal
            </SelectItem>
          </Select>
        </div>
        <div>
            <label for="name" class="block mb-2 text-sm font-medium text-gray-900">Value</label>
            <TextInput type="number" value={value} onChange={(e) => setValue(e.target.value)}/>
        </div>
        <div>
          <label for="action" class="block mb-2 text-sm font-medium text-gray-900">Action</label>
          <Select value={actionType} onValueChange={setActionType} defaultValue='email'>
            <SelectItem value="email">
              Send Email
            </SelectItem>
            <SelectItem value="webhook">
              Webhook
            </SelectItem>
          </Select>
        </div>
        </div>
        <div className='mb-4'>
          {actionType === 'email' ? 
          <div className='mb-2'>
            <label for="email" class="block mb-2 text-sm font-medium text-gray-900">E-mail Address</label>
            <TextInput value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='foobar@example.com' />
          </div>:
          <div className='mb-2'>
            <label for="webhook" class="block mb-2 text-sm font-medium text-gray-900">Url</label>
            <TextInput value={webhook} onChange={(e) => setWebhook(e.target.value)} type="url" placeholder='http://example.com'/>
          </div>
          }
        </div>
        
      </form>
      <Flex className='border-t'>
        <Button
          className="mt-2 bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <button
          className="mt-2 flex items-center justify-center text-white bg-blue-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
          onClick={onSubmit}
        >
          <PlusIcon />
          Add Rule
        </button>
        </Flex>
      </div>
      
    </div>
  )
}
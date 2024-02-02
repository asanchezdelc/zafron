import React, { useEffect, useState } from 'react';
import { Flex, Button, TextInput, Select, SelectItem, Switch, Text } from '@tremor/react';
import { XMarkIcon } from "@heroicons/react/24/outline";

import Alert from '../../../components/alert';

export default function RuleForm({ capabilities, onCancel, onAction, rule, formMode='create' }) {
  const [name, setName] = useState('');
  const [capability, setCapability] = useState('');
  const [condition, setCondition] = useState('');
  const [value, setValue] = useState(0);
  const [webhook, setWebhook] = useState('');
  const [email, setEmail] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [actionType, setActionType] = useState('email');
  const [errors, setErrors] = useState({});
  const [title, setTitle] = useState('Add Rule');
  const [action, setAction] = useState('Add Rule');
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // If in "edit" mode and a rule is provided, populate the form fields
    if (formMode === 'edit' && rule) {
      setAction('Update');
      setTitle('Edit Rule');
      setName(rule.name || '');
      setCapability(rule.condition.channel || '');
      setCondition(rule.condition.operator || '');
      setValue(rule.condition.value || 0);
      setActionType(rule.action.type || 'email');
      setEnabled(rule.enabled || false);
      if (rule.action.type === 'webhook') setWebhook(rule.action.value || '');
      if (rule.action.type === 'email')       setEmail(rule.action.value || '');
    }
  }, [formMode, rule]);

  const validateForm = () => {
    let errors = {};

    if (!name) errors.name = "Name is required";
    if (!capability) errors.capability = "Capability is required";
    if (!condition) errors.condition = "Condition is required";
    if (value === 0) errors.value = "Value must not be zero";
    if (actionType === 'webhook' && !webhook) errors.webhook = "Webhook URL is required when alert type is webhook";
    if (actionType === 'email' && !email) errors.email = "Email is required when alert type is email";
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
      email,
      enabled
    }
    
    onAction(rule, formMode);
  }
  
  const handleEnableChange = (value) => {
    setEnabled(value);
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
        <h3 className='text-lg font-semibold text-gray-700'>{title}</h3>
        <button type="button" onClick={onCancel} className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-600 dark:hover:text-white">
          <XMarkIcon className='h-5' />
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
          <div>
            <label className="block mb-2 text-sm font-medium text-gray-900">Capability</label>
            <Select value={capability} onValueChange={setCapability}>
              { capabilities && capabilities.map((cap, index) => (
              <SelectItem key={index} value={`${cap.channel}`}>
                {`${cap.type} - Channel ${cap.channel}`}
              </SelectItem>) ) }
            </Select>
            { capabilities === undefined || capabilities.length === 0 ? <small>Cannot create rule without a capability.</small> : <div></div>}
          </div>
        <div>
          <label htmlFor="category" className="block mb-2 text-sm font-medium text-gray-900">Condition</label>
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
            <label htmlFor="value" className="block mb-2 text-sm font-medium text-gray-900">Value</label>
            <TextInput type="number" value={value} onChange={(e) => setValue(e.target.value)} id="value"/>
        </div>
        <div>
          <label htmlFor="action" className="block mb-2 text-sm font-medium text-gray-900">Action</label>
          <Select value={actionType} onValueChange={setActionType} defaultValue='email' id="action">
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
            <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900">E-mail Address</label>
            <TextInput value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder='foobar@example.com' />
          </div>:
          <div className='mb-2'>
            <label htmlFor="webhook" className="block mb-2 text-sm font-medium text-gray-900">Url</label>
            <TextInput value={webhook} onChange={(e) => setWebhook(e.target.value)} type="url" placeholder='http://example.com'/>
          </div>
          }
        </div>
        
      </form>
      <Flex className='border-t'>
        <div>
          <Flex justifyContent="end" className="space-x-2">
          <Button
            className="mt-2 bg-white border-gray-200 text-gray-500 hover:bg-gray-50 hover:border-gray-300"
            onClick={onCancel}
          >
            Cancel
          </Button>
          <div className="flex items-center space-x-3 mt-2">
            <Switch id="switch" name="switch" checked={enabled} onChange={handleEnableChange} />
            <label className="text-sm text-gray-500">
              { enabled ? 'Enabled' : (<Text color="red">Disabled</Text>)}
            </label>
          </div>
        </Flex>
        </div>
        <button
          className="mt-2 flex items-center justify-center text-white bg-blue-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800"
          onClick={onSubmit}
        >
          {/* <PlusIcon /> */}
          { action }
        </button>
        </Flex>
      </div>
      
    </div>
  )
}
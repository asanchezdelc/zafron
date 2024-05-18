import React, { useEffect, useState, Fragment } from 'react';
import { Card, Title, Flex, Button, TextInput } from '@tremor/react';
import RulesTable from './ruletable';
import { Dialog, Transition } from "@headlessui/react";
import RuleForm from './form';
import * as rulesAPI from '../../../services/rule';

export default function RulesPage({device}) {
  const [isOpen, setIsOpen] = useState(false);
  const [rules, setRules] = useState([]);
  const closeModal = ()=> setIsOpen(false);
  const [rule, setRule] = useState({});
  const [formMode, setFormMode] = useState('create');

  const onCreate = async (ruleData, mode) => {
    // call api to create rule
    try {
      let newRule;
      if (mode === 'edit') {

        newRule = await rulesAPI.update(rule._id, { ...ruleData, deviceId: device._id, serial: device.serial });
        const newRules = rules.map(r => {
          if (r._id === rule._id) {
            return newRule;
          }
          return r;
        });
        setRules(newRules);
      } else {
        newRule = await rulesAPI.create({ ...ruleData, deviceId: device._id, serial: device.serial });
        setRules([...rules, newRule]);
      }

      closeModal();
    } catch (err) {
      console.log(err);
    }
  }

  const getRules = async () => {
    if (device === undefined && !device._id) return;
    try {
      const rulesResp = await rulesAPI.list(device._id)
      setRules(rulesResp.rows)
    } catch (err) {
      console.log(err);
    }    
  }

  useEffect(() => {
    if (device === undefined && device._id === undefined) {
      return;
    }

    getRules();

  }, [device]);

  const handleAddRule = () => {
    setRule({});
    setFormMode('create');
    setIsOpen(true);
  }

  const onDelete = async (ruleId) => {
    try {
      await rulesAPI.remove(ruleId);
      // remove from rules
      const newRules = rules.filter(rule => rule._id !== ruleId);
      setRules(newRules);
    } catch (err) {
      console.log(err);
    }
  }

  const onEdit = async (toEditRule) => {
    setRule(toEditRule);
    setFormMode('edit');
    setIsOpen(true);
  }

  return (
    <div className='mt-5'>
      <Card>
        <Flex>
          <div>
            <Flex justifyContent="start" className="space-x-2">
              <Title>Rules</Title>
            </Flex>
          </div>
          <div>
            <Button onClick={handleAddRule}>Add Rule</Button>
          </div>
        </Flex>
        <RulesTable rules={ rules } onDelete={onDelete} onEdit={onEdit} />
        <Transition appear show={isOpen} as={Fragment}>
          <Dialog as="div" className="relative z-50" onClose={closeModal}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-gray-900 bg-opacity-25" />
            </Transition.Child>
            <div className="fixed inset-0 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Transition.Child
                  as={Fragment}
                  enter="ease-out duration-300"
                  enterFrom="opacity-0 scale-95"
                  enterTo="opacity-100 scale-100"
                  leave="ease-in duration-200"
                  leaveFrom="opacity-100 scale-100"
                  leaveTo="opacity-0 scale-95"
                >
                  <Dialog.Panel
                    className="w-full max-w-xl transform overflow-hidden ring-tremor bg-white
                                      p-6 text-left align-middle shadow-tremor transition-all rounded-xl"
                  >
                    <RuleForm deviceId={device._id} onCancel={closeModal} onAction={onCreate} formMode={formMode} rule={rule} />
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </Card>
    </div>
  )
}

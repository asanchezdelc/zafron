import React, { useEffect, useState, Fragment } from 'react';
import { Dialog, Transition } from "@headlessui/react";
import {
  TextInput
} from '@tremor/react';

export default function DeleteConfirm({ isOpen, onConfirm, closeModal, message, inputConfirm }) {
  const [deleteMe, setDeleteMe] = useState('');
  const [errors, setErrors] = useState('');
  const onConfirmClick = () => {
    if (inputConfirm) {
      if (deleteMe !== 'delete me') {
        setErrors('Please enter "delete me"');
        return;
      } else {
        setDeleteMe('');
        onConfirm();
        return;
      }
    }

    return onConfirm();
    
  };

  const onInputTextChange = (e) => {
    setErrors('');
    setDeleteMe(e.target.value);
  }

  return (
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
              <div className="relative p-4 text-center bg-white">
              <svg className="text-gray-400 dark:text-gray-500 w-11 h-11 mb-3.5 mx-auto" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>

              <p className="mb-4 text-gray-700">{message}</p>
              </div>
              {inputConfirm && 
              <div className="relative p-4 text-center bg-white">
                <TextInput placeholder="Enter 'delete me'" type="text" error={errors !== ''} errorMessage={errors} onChange={onInputTextChange} />
              </div>
              }
                  
                  <div className="flex justify-center items-center space-x-4">
                <button onClick={closeModal} type="button" className="py-2 px-3 text-sm font-medium text-gray-500 bg-white rounded-lg border border-gray-200 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-primary-300 hover:text-gray-900 focus:z-10">
                    No, cancel
                </button>
                <button type="submit" onClick={onConfirmClick} className="py-2 px-3 text-sm font-medium text-center text-white bg-red-600 rounded-lg hover:bg-red-700 focus:ring-4 focus:outline-none focus:ring-red-300">
                    Yes, I'm sure
                </button>
            </div>
                  
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
    </Transition>
  )
}
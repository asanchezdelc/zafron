import { Fragment, useState } from 'react'
import {
  Table,
  TableHead,
  TableRow,
  TableHeaderCell,
  TableBody,
  TableCell,
  Text,
  Button,
  Badge
} from '@tremor/react';
import { Menu, Transition } from '@headlessui/react'
import { toFriendlyTime } from '../../../services/utils';
import DeleteConfirm from '../../../components/DeleteConfirm';

function ActionsDropdown({ onDelete, onEdit}) {
  const [deleteOpen, setDeleteOpen] = useState(false);

  const onDeleteCancel = () => {
    setDeleteOpen(false);
  }

  const onDeleteConfirm = () => {
    onDelete();
    setDeleteOpen(false);
  }

  return (
    <div>
      <Menu as="div" className="relative inline-block text-left">
        <Menu.Button className="inline-flex justify-center rounded-md bg-black bg-opacity-20 px-4 py-2 text-sm font-medium text-white hover:bg-opacity-30 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">...</Menu.Button>
        <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
        <Menu.Items className="absolute index-9999 right-0 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
        <div className="px-1 py-1 ">
          <Menu.Item>
            {({ active }) => (
              <button onClick={onEdit}
                className={`${
                  active ? 'bg-gray-200' : 'text-gray-900'
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
              >
                <EditActiveIcon
                    className="mr-2 h-5 w-5"
                    aria-hidden="true"
                  />
                Edit
              </button>
            )}
          </Menu.Item>
          <Menu.Item>
            {({ active }) => (
              <button onClick={() => setDeleteOpen(true)}
                className={`${
                  active ? 'bg-gray-100' : 'text-gray-900'
                } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
              >
                <DeleteActiveIcon
                    className="mr-2 h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                Delete
              </button>
            )}
            </Menu.Item>
          </div>
        </Menu.Items>
        </Transition>
      </Menu>
      <DeleteConfirm 
        isOpen={deleteOpen} 
        onConfirm={onDeleteConfirm} 
        closeModal={onDeleteCancel} 
        message="Are you sure you want to delete this rule?" 
        />
    </div>
  )
}

// email or http icon for type

function NoData() {
  return (
    <div className='mt-5 h-full w-full' height="112">
       <div className='tremor-Flex-root flex flex-row justify-center items-center w-full h-full border border-dashed rounded-tremor-default border-tremor-border dark:border-tdark-remor-border'>
        <div className='text-tremor-default text-tremor-content dark:text-dark-tremor-content p-10'>No rules - Start by adding a rule to receive notifications.</div>
      </div>
    </div>
  )
}

export default function RulesTable({ rules, onDelete, onEdit }) {
  const condtitions = {
    'gt': 'Greater than',
    'lt': 'Less than',
    'eq': 'Equal to',
    'ne': 'Not equal to',
    'gte': 'Greater than or equal to',
    'lte': 'Less than or equal to',
  };

  return (
    (rules && rules.length === 0) ? <NoData /> : ( <>
    <Table className="mt-6 overflow-visible">
      <TableHead className='border-gray-500 bg-gray-100'>
        <TableRow>
          <TableHeaderCell>Name</TableHeaderCell>
          <TableHeaderCell>Threshold</TableHeaderCell>
          <TableHeaderCell>Action Type</TableHeaderCell>
          <TableHeaderCell>Last Triggered</TableHeaderCell>
          <TableHeaderCell>Status</TableHeaderCell>
          <TableHeaderCell className='px-4 py-3 flex items-center justify-end'>Settings</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {rules.map((rule) => (
          <TableRow key={`${rule._id}`}>
            <TableCell>
              { rule.name }
            </TableCell>
            <TableCell>
              {`Channel ${rule.condition.channel}` } { condtitions[rule.condition.operator] } <Badge>{ rule.condition.value }</Badge>
            </TableCell>
            <TableCell>
              { rule.action.type }
            </TableCell>     
            <TableCell>
              { toFriendlyTime(rule.triggeredAt) }
            </TableCell>
            <TableCell>
              { rule.enabled ? <Badge>Enabled</Badge> : <Badge color="red">Disabled</Badge>}
            </TableCell>     
            <TableCell className='flex items-center justify-end'>
              <ActionsDropdown onDelete={() => onDelete(rule._id)} onEdit={() => onEdit(rule)} />
            </TableCell>  
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </>  
    )
  );
}

function EditActiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 13V16H7L16 7L13 4L4 13Z"
        fill="#e3e3e3"
        stroke="#666666"
        strokeWidth="2"
      />
    </svg>
  )
}

function DeleteActiveIcon(props) {
  return (
    <svg
      {...props}
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        x="5"
        y="6"
        width="10"
        height="10"
        fill="#e3e3e3"
        stroke="#666666"
        strokeWidth="2"
      />
      <path d="M3 6H17" stroke="#666666" strokeWidth="2" />
      <path d="M8 6V4H12V6" stroke="#666666" strokeWidth="2" />
    </svg>
  )
}
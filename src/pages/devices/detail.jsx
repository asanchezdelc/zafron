import React, { useEffect, useState, useRef, Fragment } from 'react';
import { useParams } from 'react-router-dom';
import { Title, TabGroup, 
  Flex, Text, Tab, 
  TabList, TabPanel, Grid,
  Badge, 
  TabPanels,
  Icon,
} from '@tremor/react';
import Nav from '../../components/nav';
import * as devicesAPI from '../../services/device';
import LogPanel from './log/logpanel';
import MetricCard from './metric';
import Credentials from './credentials';
import { WifiIcon, CpuChipIcon, TrashIcon, BellAlertIcon, Cog6ToothIcon, CircleStackIcon } from '@heroicons/react/24/outline';
import Spinner from '../../components/spinner';
import { useNavigate } from "react-router-dom";
import { toFriendlyTime } from '../../services/utils';
import RulesPage from './rules/index';
import CapabilityForm from './capability/form';
import { Dialog, Transition } from '@headlessui/react';

function Onboarding({ device }) {
  return (
    <div className='border-1 bg-gray-100'>
      <div className='flex justify-center items-center '>
          <div className="p-6 m-4 text-center">
            <h2 className="text-xl font-bold mb-4 text-gray-400">No Capabilities Found</h2>
            <p className="mb-4 text-gray-600">Start by connecting your device to our application to populate its capabilities.</p>
          </div>          
      </div>
      <div className='flex justify-center items-center'>
        <div className='w-1/2'>
          <Credentials clientId={device.serial} />
        </div>
      </div>    
    </div>
  )
}

export default function DeviceDetail() {
  const params = useParams();
  const [device, setDevice] = useState({ mqttCredentials: {}, capabilities: []});
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [capabilities, setCapabilities] = useState([]);
  const capabilitiesRef = useRef();
  const [uplink, setUplink] = useState(null);
  const navigate = useNavigate();
  const [disabled, setDisabled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = ()=> setIsOpen(false);
  const [capability, setCapability] = useState({});

  const setStatus = (ts, thresholdMinutes = 60) => {
    if (!ts) {
      setIsOnline(false);
      return;
    }

    setUplink(ts)

    // Convert the device's timestamp and the current time to Date objects
    const deviceTime = new Date(ts);
    const currentTime = new Date();

    // Find the difference in milliseconds
    const difference = currentTime - deviceTime;

    // Convert the threshold to milliseconds and compare
    const thresholdMilliseconds = thresholdMinutes * 60 * 1000;
  
    //TODO: doesnt work, test later
    if (difference <= thresholdMilliseconds) {
      setIsOnline(true);
    } else {
      setIsOnline(false);
    }
  }

  const getDevice = async () => {
    try {
      const data = await devicesAPI.fetchOne(params.deviceId);
      setDevice(data);
      setCapabilities(data.capabilities);
      setIsLoading(false)
      setStatus(data.lastOnline);
    } catch (err) {
      console.error("Error fetching device:", err);
    }
  };

  const getLatest = async () => {
    try {
      const data = await devicesAPI.fetchLatest(params.deviceId);
      const currentCapabilities = capabilitiesRef.current;
      const newCapabilities = [];

      if (data.measurements && data.measurements.length > 0) {
        setUplink(data.measurements[0].timestamp);
      }

      data.measurements.forEach((measurement) => {
          let capability = measurement.metadata;
          capability.value = measurement.value;
          const index = currentCapabilities.findIndex((item) => item.channel === measurement.metadata.channel);
          if (index === -1) {
              capability.new = true;
              newCapabilities.push(capability);
          }else{
              currentCapabilities[index].value = measurement.value;
          }
      });
      // Combine capabilitiesRef.current with newCapabilities and set to state
      setCapabilities([...currentCapabilities, ...newCapabilities]);
    } catch (err) {
      console.error("Error fetching latest:", err);
    }
  }

  const onDeleteDevice = async (deviceId) => {
    setDisabled(true);
    try {
      await devicesAPI.removeDevice(deviceId);
      navigate('/devices');
    } catch (err) {
      console.error("Error deleting device:", err);
    }
  };

  const onUpdateCapability = async (updatedCapability) => {
    // lets replace the capability from the list and update the state
    const index = capabilities.findIndex((item) => item.channel === updatedCapability.channel);
    capabilities[index] = updatedCapability;

    // update existing capabilities with updated capability
    setCapabilities([...capabilities]);

    console.log(capabilities)

    try {
      await devicesAPI.patchDevice(device._id, { capabilities: [updatedCapability] });
    } catch (err) {
      console.error("Error updating capability:", err);
    }

    // close modal
    closeModal();
  }

  const onAddCapability = async (capability) => {
    try {
      if (capability.new) {
        delete capability["new"];
      }
      await devicesAPI.patchDevice(device._id, { capabilities: [capability] });
      // lets replace the capability from the list and update the state
      const index = capabilities.findIndex((item) => item.channel === capability.channel);
      capabilities[index] = capability;

      // update existing capabilities with updated capability
      setCapabilities([...capabilities]);
    } catch (err) {
      console.error("Error adding capability:", err);
    }
  }

  const onDeleteCapability = async (toDeleteCapability) => {
    console.log(toDeleteCapability);
    console.log('ondelete')
    try {
      const resp = await devicesAPI.removeCapability(device._id, toDeleteCapability);
      console.log(resp);
      // lets replace the capability from the list and update the state
      const index = capabilities.findIndex((item) => item.channel === toDeleteCapability.channel);
      capabilities.splice(index, 1);
      setCapabilities([...capabilities]);
      closeModal();
    } catch (err) {
      console.error("Error deleting capability:", err);
    }
  }

  const onEditCapability = async (capability) => {
    setCapability(capability);
    setIsOpen(true);
  }

  useEffect(() => {
    getDevice();
    const interval = setInterval(getLatest, 5000); 
    return () => clearInterval(interval);
  }, [params.deviceId]);

  useEffect(() => {
    capabilitiesRef.current = capabilities;
  }, [capabilities]);

  return (
    <div>
      <Nav />
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <Flex justifyContent="between">
          <Flex justifyContent="start" className="space-x-4">
            <Icon icon={CpuChipIcon} variant="light" size="xl" color={'indigo'} />
            <div>
              <Title>{device.name}</Title>
              <Text>
                {device.serial}
              </Text>
              {/* <CoffeeCup /> */}
            </div>
          </Flex>
          <div className='text-right w-1/2'>
          {isOnline ? <Badge color='green' icon={WifiIcon}>Online</Badge> : 
            <Badge color='rose'>Offline</Badge>}
            <Text className='mt-2 text-xs'>Last Update: {toFriendlyTime(uplink)}</Text>
          </div>
        </Flex>
        <TabGroup className="mt-6">
        <TabList>
          <Tab icon={CpuChipIcon}>Overview</Tab>
          <Tab icon={CircleStackIcon}>Logs</Tab>
          <Tab icon={BellAlertIcon}>Rules</Tab>
          <Tab icon={Cog6ToothIcon}>Settings</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            {isLoading ? <Spinner /> : (
            <>{(!capabilities || capabilities.length === 0) && <Onboarding device={device} />}
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
                    <CapabilityForm 
                      onCancel={closeModal} 
                      onAction={onUpdateCapability} 
                      onRemove={onDeleteCapability}
                      capability={capability} 
                    />
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
            <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mt-6">              
              { capabilities && capabilities.map((reading, index) => ( 
              <MetricCard 
                key={index} 
                deviceId={device._id} 
                capability={reading} 
                onAddCapability={onAddCapability}
                onEditCapability={onEditCapability} 
              /> 
              ))}
            </Grid>
            </>)}
          </TabPanel>
          <TabPanel>
            <LogPanel deviceId={device._id} />
          </TabPanel>
          <TabPanel>
            <RulesPage device={device} />
          </TabPanel>
          <TabPanel>  
              <div className='mt-8'>
                  <Credentials clientId={device.serial} />
                </div>
                <button 
                  onClick={() => onDeleteDevice(device._id)} 
                  disabled={disabled} 
                  type="button" 
                  className="focus:outline-none inline-flex text-white bg-red-700 hover:bg-red-800 focus:ring-4 focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-red-600 dark:hover:bg-red-700 dark:focus:ring-red-900">
                  <TrashIcon className='w-5 h-5 mr-2'/>
                  Remove Device
               </button>
          </TabPanel>
        </TabPanels>
        </TabGroup>        
      </main>
    </div>
  );
}

import React, { useEffect, useState, useRef, Fragment, useContext } from 'react';
import { Responsive, WidthProvider } from "react-grid-layout";
import { useParams } from 'react-router-dom';
import { Title, TabGroup, 
  Flex, Text, Tab, 
  TabList, TabPanel, Grid,
  Badge, 
  TabPanels,
  Icon,
  Button,
  Card
} from '@tremor/react';
import Nav from '../../components/nav';
import * as devicesAPI from '../../services/device';
import LogPanel from './log/logpanel';
import MetricCard from './metric';
import { 
  WifiIcon, 
  CpuChipIcon,  
  BellAlertIcon, 
  Cog6ToothIcon, 
  CircleStackIcon,
  CommandLineIcon,
  PlusCircleIcon
} from '@heroicons/react/24/outline';
import Spinner from '../../components/spinner';
import { toFriendlyTime } from '../../services/utils';
import RulesPage from './rules/index';
import CapabilityForm from './capability/form';
import SettingsForm from './settings/form';
import Hero from './onboarding/hero';
import MqttContext from '../../services/ws/MqttContext';
import { MQTTPacket } from '../../services/ws/MqttPacket';
import CapabilityDialog from './capability/dialog';

const ResponsiveGridLayout = WidthProvider(Responsive);



const layout = [
  {
    "w": 3,
    "h": 1,
    "x": 0,
    "y": 0,
    "i": "0"
  },
  {
    "w": 3,
    "h": 1,
    "x": 3,
    "y": 0,
    "i": "1"
  }
]

const layouts = {
  lg: layout,
  md: layout
}

export default function DeviceDetail() {
  const { deviceId } = useParams();
  const [device, setDevice] = useState({ mqttCredentials: {}, capabilities: []});
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [capabilities, setCapabilities] = useState([]);
  const capabilitiesRef = useRef();
  const [uplink, setUplink] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = ()=> setIsOpen(false);
  const [capability, setCapability] = useState({});
  const [name, setName] = useState('');
  const mqttClient = useContext(MqttContext);
  const [messages, setMessages] = useState([]);
  const [tab, setTab] = useState(0);

  const setStatus = (ts, thresholdMinutes = 5) => {
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

  const onUpdateCapability = async (updatedCapability) => {
    if (updatedCapability.new) {
      return onAddCapability(updatedCapability);
    }
    // lets replace the capability from the list and update the state
    const index = capabilities.findIndex((item) => item.channel === updatedCapability.channel);
    capabilities[index] = updatedCapability;

    // update existing capabilities with updated capability
    setCapabilities([...capabilities]);

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
      if (index === -1) {
        capabilities.push(capability);
      }
      capabilities[index] = capability;

      // update existing capabilities with updated capability
      setCapabilities([...capabilities]);
      setIsOpen(false);
    } catch (err) {
      console.error("Error adding capability:", err);
    }
  }

  const onDeleteCapability = async (toDeleteCapability) => {
    try {
      const resp = await devicesAPI.patchCapability(device._id, toDeleteCapability);
      // lets replace the capability from the list and update the state
      const index = capabilities.findIndex((item) => item.channel === toDeleteCapability.channel);
      capabilities.splice(index, 1);
      setCapabilities([...capabilities]);
      closeModal();
    } catch (err) {
      console.error("Error deleting capability:", err);
    }
  }

  const onEditCapClick = async (capability) => {
    setCapability(capability);
    setIsOpen(true);
  }

  const onAddActuator = async () => {
    setCapability({ type: 'digital_actuator', channel: 0, name: 'LED', unit: null, new: true });
    setIsOpen(true);
  }

  const onUpdate = async (device) => {
    setName(device.name);
  }

  useEffect(() => {
    const getDevice = async () => {
      try {
        const data = await devicesAPI.fetchOne(deviceId);
        setDevice(data);
        setCapabilities(data.capabilities);
        setIsLoading(false)
        setStatus(data.lastOnline);
      } catch (err) {
        console.error("Error fetching device:", err);
      }
    };
    getDevice();
  }, [deviceId]);

  useEffect(() => {
    if (mqttClient) {
        const handleNewMessage = (topic, message) => {
            setMessages((prevMessages) => [...prevMessages, message.toString()]);
            const packet = new MQTTPacket({ topic, payload: message });
            
            if (device.serial === packet.getSerial()) {
              console.log('device message received', packet.getSerial(), topic, packet.getCaps());
              setStatus(new Date().getTime());
              const currentCapabilities = capabilitiesRef.current;
              const newCapabilities = [];
              
              packet.getCaps().forEach((cap) => {
                let capability = cap;
                const index = currentCapabilities.findIndex((item) => item.channel + '' === cap.channel + '');
                if (index === -1) {
                    capability.new = true;
                    newCapabilities.push(capability);
                }else{
                    currentCapabilities[index].value = cap.value;
                }
              });
              // Combine capabilitiesRef.current with newCapabilities and set to state
              setCapabilities([...currentCapabilities, ...newCapabilities]);              
            }            
        };

        mqttClient.on('message', handleNewMessage);

        return () => {
            mqttClient.off('message', handleNewMessage);
        };
    }
}, [mqttClient, device]);


  useEffect(() => {
    capabilitiesRef.current = capabilities;
  }, [capabilities]);

  useEffect(() => {
    setName(device.name);
  }, [device]);

  const onTabChange = (index) => {
    setTab(index);
  }

  const onSwitchToggle = async (capability) => {
    console.log('switch toggled', capability)
    // value
    const topic = `v1/${mqttClient.options.username}/things/${device.serial}/cmd/${capability.channel}`;
    const seq = Math.floor(Math.random() * 1000000);
    const payload = `${seq},${capability.value}`;
    await mqttClient.publish(topic, payload);
  }

  const onLayoutChange = (layout, layouts) => {
    console.log(JSON.stringify(layout));
    console.log('layout changed', layout, layouts);
  }

  return (
    <div>
      <Nav />
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <Flex justifyContent="between">
          <Flex justifyContent="start" className="space-x-4">
            <Icon icon={CpuChipIcon} variant="light" size="xl" color={'indigo'} />
            <div>
              <Title>{name}</Title>
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
        <TabGroup className="mt-6" onIndexChange={onTabChange}>
          <TabList>
            <Tab style={{"overflow": "unset"}} icon={CpuChipIcon}>Overview</Tab>
            <Tab style={{"overflow": "unset"}} icon={CircleStackIcon}>Logs</Tab>
            <Tab style={{"overflow": "unset"}} icon={BellAlertIcon}>Rules</Tab>
            <Tab style={{"overflow": "unset"}} icon={Cog6ToothIcon}>Settings</Tab>
            { tab === 0 &&
            <Flex justifyContent='end'>
            <Button variant='light' icon={PlusCircleIcon} size='xs' onClick={onAddActuator}>New Command</Button></Flex> }
          </TabList>
          <TabPanels>
            <TabPanel className='mt-0'>
              {isLoading ? <Spinner /> : (
              <>{(!capabilities || capabilities.length === 0) && <Hero device={device} />}
                <CapabilityDialog isOpen={isOpen} closeModal={closeModal}>
                  <CapabilityForm 
                    onCancel={closeModal} 
                    onAction={onUpdateCapability} 
                    onRemove={onDeleteCapability}
                    capability={capability}
                    formMode='edit'
                  />
                </CapabilityDialog>
                <ResponsiveGridLayout 
                  className="layout"
                  measureBeforeMount={false}
                  onLayoutChange={onLayoutChange}
                  layouts={layouts}
                  currentBreakpoint='lg'
                  breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                  cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                  rowHeight={250}
                  >
                { capabilities && capabilities.map((reading, index) => ( 
                <div key={index+''}>
                  <MetricCard
                    deviceId={device._id} 
                    capability={reading} 
                    onAddCapability={onAddCapability}
                    onEditCapability={onEditCapClick} 
                    onSwitchToggle={onSwitchToggle}
                  /> 
                    </div>
                  ))}
                </ResponsiveGridLayout>
                {/* <Grid numItemsMd={2} numItemsLg={3} className="gap-6 mt-6">              
                  { capabilities && capabilities.map((reading, index) => ( 
                  <MetricCard 
                    key={index} 
                    deviceId={device._id} 
                    capability={reading} 
                    onAddCapability={onAddCapability}
                    onEditCapability={onEditCapClick} 
                    onSwitchToggle={onSwitchToggle}
                  /> 
                  ))}
                </Grid> */}
              </>)}
            </TabPanel>
            <TabPanel>
              { tab === 1 && <LogPanel deviceId={device._id} /> }
            </TabPanel>
            <TabPanel>
              { tab === 2 && <RulesPage device={device} />}
            </TabPanel>
            <TabPanel>
              { tab === 3 && <SettingsForm device={device} onUpdate={onUpdate}/> }
            </TabPanel>
          </TabPanels>
        </TabGroup>        
      </main>
    </div>
  );
}

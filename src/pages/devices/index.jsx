import { useState, useEffect } from 'react'
import { Card, Title, Button, Flex, Text, Divider, Callout } from '@tremor/react';
import DevicesTable from './table';
import Nav from '../../components/nav';
import * as devicesAPI from '../../services/device';
import AddDevice from './add';
import Alert from '../../components/alert';

export default function Devices() {
  let [isOpen, setIsOpen] = useState(false)
  let [devices, setDevices] = useState([])
  let [error, setError] = useState(null)

  useEffect(() => {
    const getDevices = async () => {
      try {
        const data = await devicesAPI.fetchDevices();
        setDevices(data);
      } catch (err) {
        console.error("Error fetching devices:", err);
      }
    };

    getDevices();
  }, []);

  const initDeviceForm = () => {
    setIsOpen(true);
  }

  const onAddDevice = async (device) => {
    try {
      const newDevice = await devicesAPI.addDevice(device);
      setDevices([...devices, newDevice]); // Add the new device to the list
      setIsOpen(false); // Close the form/modal
    } catch (err) {
      const errMsg = err.message || "Failed to add device";
      setError(errMsg);
      setTimeout(() => { setError(null) }, 3000);
      setIsOpen(false); // Close the form/modal
    }
  }

  return (
    <div>
      <Nav />
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <Flex>
          <div>
            <Title>Devices</Title>
            <Text>
              Devices available to connect to the network.
            </Text>
          </div>
          <div>
            <Button variant="primary" size='xs' onClick={initDeviceForm}>Add Device</Button>
          </div>
        </Flex>
        <Divider />
        <Card className="mt-6">
          { error && <Callout title="Error: failed to add device." color="red" className='mb-2'>{error}</Callout> }
          {devices.length > 0  ? ( <DevicesTable devices={devices} /> ) : (
          <div>
            <Text className='pb-4'>Start by creating and connecting a new devices.</Text>
            <Button variant="primary" size='xs' onClick={initDeviceForm}>Add Device</Button>
          </div> )}          
        </Card>
        {isOpen && ( <AddDevice onCancel={setIsOpen} onAction={onAddDevice} />
  
        )}
    </main>
    </div>
  );
}
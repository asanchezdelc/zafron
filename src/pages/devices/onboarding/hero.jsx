import React, { useEffect } from 'react';
import Credentials from '../credentials';
import { Title, Subtitle, 
  Card, Text, List, ListItem, Bold
} from '@tremor/react';
// get sourceAPI
import * as sourceAPI from '../../../services/sources';
import { Link } from 'react-router-dom';
import CopyToClip from '../../../components/copy';

const links = [
  {
  label: 'Cayenne-MQTT-Arduino',
  url: 'https://github.com/myDevicesIoT/Cayenne-MQTT-Arduino'
  },
  {
    label: 'Cayenne-MQTT-ESP',
    url: 'https://github.com/myDevicesIoT/Cayenne-MQTT-ESP'
  },
  {
    label: 'Cayenne-MQTT-C',
    url: 'https://github.com/myDevicesIoT/Cayenne-MQTT-C'
  },
  {
    label: 'Cayenne-MQTT-CPP',
    url: 'https://github.com/myDevicesIoT/Cayenne-MQTT-CPP'
  }
]

const LoraHero = ({ profile }) => {
  const [source, setSource] = React.useState('');

  const getSource = async () => {
    const s = await sourceAPI.findOne(profile.source);
    setSource(s);
    console.log(s);
  }

  useEffect(() => {
    console.log(profile);
    getSource();
  }, [profile.source]);

  return (
    <div className="lora">
      <div class="lora-container">
        <h2 class="text-2xl font-bold mb-2 text-gray-800">Configuring Your LoRa Device</h2>
        <p class="mb-4">You've successfully added your LoRa device. To start sending data and utilize our services, please follow these steps:</p>
        
        <div class="mb-4">
          <h3 class="text-xl font-bold text-gray-700">Step 1: Configure Your {source.provider} LoRa Network Server</h3>
          <p>Set up your LoRa device to communicate with Zafron:</p>
          <ol class="list-decimal ml-8 mb-4">
            <li>Log in to your <Link to={`/sources/${source._id}`} className="text-blue-600">{source.provider}</Link> network server's console.</li>
            <li>Navigate to the routing or forwarding settings.</li>
            <li>Add a new rule to redirect device traffic to Zafron.</li>
            <li>Enter the URL we provide:</li>
          </ol>
          <div className="bg-gray-200 border-rounded px-2"><CopyToClip text={`https://app.zafron.dev/api/ingress/${source.maskId}?apiKey=${source.apiKey}`}></CopyToClip></div>

        </div>
        
        <div class="mb-4">
          <h3 class="text-xl font-bold text-gray-700">Step 2: Update Decoder Function</h3>
          <p>Decode the payload from your LoRa device:</p>
          <ol class="list-decimal ml-8">
            <li>In the <Link to={`/profiles/${profile._id}/settings`} className="text-blue-600">{profile.name}</Link>, find the 'Decoder' section.</li>
            <li>Define or upload your decoder function.</li>
          </ol>
          
        </div>
        
        <p>If you have questions or need assistance during setup, please reach out to our support team.</p>
      </div>
    </div>
  )
}

const MQTTHero = () => {
  return (
    <div className="mqtt">
            <ul className='list-disc list-inside text-gray-600'>
              <li><Bold>Install Libraries:</Bold> Depending on your device's platform (Arduino, ESP, C, C++), install the Cayenne MQTT library. This will allow your device to communicate using MQTT protocol.</li>
              <li><Bold>Configure Your Device:</Bold>
                <ul className='list-disc list-inside'>
                <li>Open your device's programming environment.</li>
                <li>Include the Cayenne MQTT library at the beginning of your code by adding <code>#include CayenneMQTT.h</code>.</li>
                <li>Use the credentials provided on this page to initialize the MQTT connection in your code.</li>
                </ul>
              </li>
            </ul>
            {/*  */}
            <Text className="mb-5">Once your device is connected and sending data, this dashboard will be populated with your sensor readings.</Text>
            
            <Text>Zafron uses Cayenne MQTT API and is a drop-in replacement for Cayenne. <a href="https://zafron.dev/docs/intro" target='_blank' className='text-blue-500' rel="noreferrer">Learn More</a></Text>
            
            <div className='mb-5'>
              <Text>
                <Bold>MQTT Address</Bold>
              </Text>
              <code className='text-sm sm:text-base inline-flex text-left items-center space-x-4 bg-gray-600 text-white rounded-lg p-4 pl-6'>
              <span>#define CAYENNE_DOMAIN "mqtt.zafron.dev"</span>
              </code>
              </div>
            <Text>
            <Bold>Libraries</Bold>
            </Text>
            <List>
              {links.map((link, index) => (
                <ListItem key={index}>
                  <a href={link.url} target="_blank" rel="noreferrer">{link.label}</a>
                </ListItem>
              ))}
            </List>
          </div>
  )

}

export default function Hero({ device }) {
  console.log(device);
  return (
    <div className="grid grid-cols-2 gap-4 mt-5">
      <div>
        <Card>
          <Title>Next Steps</Title>
          <Subtitle className='mb-4'>Hooray you added a device let's get started.</Subtitle>
          { (device.profile && device.profile._id != '') ? (<LoraHero profile={device.profile} />): <MQTTHero />}
        </Card>
      </div>
      <div>
        { !device.profile && <Credentials clientId={device.serial} /> }
      </div>
    </div>
  )
}
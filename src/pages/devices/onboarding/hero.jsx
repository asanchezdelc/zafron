import Credentials from '../credentials';
import { Title, Subtitle, 
  Card, Text, List, ListItem, Bold
} from '@tremor/react';

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
  return (
    <div className="lora">
      <Text>Data will be auto populate as soon as is sent from the network server. If data is not rendered, verify your source and profile.</Text>
      <ul>
        <li><Bold>Name:</Bold> {profile.name}</li>
      </ul>
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
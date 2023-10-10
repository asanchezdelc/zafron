import Credentials from '../credentials';
import { Title,
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

export default function Hero({ device }) {
  return (
    <div class="grid grid-cols-2 gap-4">
      <div>
        <Card>
          <Title>Getting Started</Title>
          <Text className="mb-5">Zafron is a drop-in replacement for Cayenne. <a href="https://zafron.dev/docs/intro" target='_blank' className='text-blue-500' rel="noreferrer">Learn More</a></Text>
          
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
            {links.map(link => (
              <ListItem>
                <a href={link.url} target="_blank" rel="noreferrer">{link.label}</a>
              </ListItem>
            ))}
          </List>
        </Card>
      </div>
      <div>
        <Credentials clientId={device.serial} />
      </div>
    </div>
  )
}
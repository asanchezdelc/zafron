import {Flex, Title, Card} from '@tremor/react';
import { ClipboardIcon } from '@heroicons/react/24/outline'
import * as userAPI from '../../services/user';
import { useEffect, useState } from 'react';

const fieldStyle = 'appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight bg-gray-50'
export default function Credentials({ clientId }) {
  const [credentials, setCredentials] = useState({ username: '', password: ''});

  useEffect(() => {
    const getCredentials = async () => {
      try {
        const data = await userAPI.getUserInfo();
        if (!data.mqttCredentials) throw new Error('No MQTT credentials found');

        setCredentials(data.mqttCredentials);
      } catch (err) {
        console.error("Error fetching credentials:", err);
      }
    };
    getCredentials();
  }, []);

  const copyToClipboard = (value) => {
    navigator.clipboard.writeText(value);
    // You can add some visual feedback here if you like
  };

  return (
    <div>
      <Card>    
        <Title className='mb-8'>MQTT Credentials</Title>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-1">
            Host
          </label>
          <Flex>
          <pre className={fieldStyle}>mqtt.zafron.dev</pre>
          <button onClick={() => copyToClipboard('mqtt.zafron.dev')} className="border rounded py-2 px-2"><ClipboardIcon className='h-5 w-5' /></button>
          </Flex>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-1">
            Port
          </label>

         <Flex>
            <pre className={fieldStyle}>1883</pre>
            <button onClick={() => copyToClipboard('1883')} className="border rounded py-2 px-2">
              <ClipboardIcon className='h-5 w-5' />
            </button>
         </Flex>

        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-1">
            Username
          </label>
          <Flex>
            <pre className={fieldStyle}>{credentials.username}</pre>
            <button onClick={() => copyToClipboard(credentials.username)} className="border rounded py-2 px-2">
                <ClipboardIcon className='h-5 w-5' />
              </button>
          </Flex>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-1" >
            Password
          </label>
          <Flex>
            <pre className={fieldStyle}>{credentials.password}</pre>
            <button onClick={() => copyToClipboard(credentials.password)} className="border rounded py-2 px-2">
                <ClipboardIcon className='h-5 w-5' />
              </button>
          </Flex>
          
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-1" >
            Client Id
          </label>
          <Flex>
          <pre className={fieldStyle}>{clientId}</pre>
          <button onClick={() => copyToClipboard(clientId)} className="border rounded py-2 px-2">
                <ClipboardIcon className='h-5 w-5' />
              </button>
          </Flex>
        </div>
    </Card>
  </div>
  );
}
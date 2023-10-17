import React, { useEffect, useState } from 'react';
import { Text, Flex, Badge } from '@tremor/react';

export default function Toggle({ onToggle, value, disabled }) {
  const [isOn, setIsOn] = useState(false);

  useEffect(() => {
    setIsOn(value);
  }, [value]);

  const handleChange = () => {
    setIsOn(!isOn);
    onToggle(!isOn);
  };

  return (
    <div className="mt-5 rounded-full p-3 bg-gray-100 drop-shadow-sm">
      <Flex>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" checked={isOn} onChange={handleChange} />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
        </label>
        <div className='ml-4'>{isOn ? <Badge color='green'>On</Badge>:<Badge color='red'>Off</Badge>}</div>
      </Flex>
      
    </div>
  )
}
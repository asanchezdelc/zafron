import { useState } from 'react'
import { RadioGroup } from '@headlessui/react'
import { Text } from '@tremor/react';
const protocols = [
  {
    name: 'MQTT',
    type: 'mqtt',
    icon: {
      url: '/img/mqtt-logo.svg',
      alt: 'MQTT logo',
    },
    desc: 'Connect your device using the MQTT protocol.',
  },
  {
    name: 'LoRaWAN',
    type: 'lora',
    icon: {
      url: '/img/lorawan-logo.png',
      alt: 'LoRaWAN logo',
    },
    desc: 'Connect your device using the LoRaWAN protocol.',
  }
]

export default function DeviceTypeSelect({ onChange, selected }) {
  return (
    <div className="w-full mb-4">
      <div className="mx-auto w-full max-w-md">
        <Text className="font-medium mb-4 text-gray-900">Device Protocol</Text>
        <RadioGroup value={selected} onChange={onChange}>
          <div className="space-y-2">
            {protocols.map((plan) => (
              <RadioGroup.Option
                key={plan.name}
                value={plan.type}
                className={({ active, checked }) =>
                  `${
                    active
                      ? 'ring-2 ring-white/60 ring-offset-2 ring-offset-blue-300'
                      : ''
                  }
                  ${checked ? 'text-gray bg-gray-100' : 'bg-white'}
                    relative flex cursor-pointer rounded-lg px-5 py-4 shadow-md focus:outline-none`
                }
              >
                {({ active, checked }) => (
                  <>
                    <div className="flex w-full items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-24 mr-4">
                          <img src={plan.icon.url} alt={plan.icon.alt} />
                        </div>
                        <div className="text-sm">
                          <RadioGroup.Label
                            as="p"
                            className={`font-medium  'text-gray-900`}
                          >
                            {plan.name}
                          </RadioGroup.Label>
                          <RadioGroup.Description
                            as="span"
                            className={`inline text-gray-500`}
                          >
                            <span>
                              {plan.desc}
                            </span>{' '}
                          </RadioGroup.Description>
                        </div>
                      </div>
                      {checked ? (
                        <div className="shrink-0 text-blue">
                          <CheckIcon className="h-6 w-6" />
                        </div>
                      ): <div className="shrink-0 text-blue">
                      <div className="h-6 w-6" />
                    </div>}
                    </div>
                  </>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
    </div>
  )
}

function CheckIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <circle cx={12} cy={12} r={12} fill="#333" opacity="0.2" />
      <path
        d="M7 13l3 3 7-7"
        stroke="#333"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

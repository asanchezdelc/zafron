import React, { useState, useEffect } from 'react';
import { 
  Flex, 
  Title,  
  Card, 
  Button, 
  TextInput, 
  Divider, 
  AccordionList, 
  AccordionHeader, 
  AccordionBody, 
  Accordion } from '@tremor/react';
  import CodeEditor from '@uiw/react-textarea-code-editor';
  import rehypePrism from '@mapbox/rehype-prism';
  import * as profilesAPI from '../../services/profiles';
import Spinner from '../../components/spinner';

export default function Decoder({ profile }) {
  const [code, setCode] = useState('');
  const [payload, setPayload] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');

  const onUpdateCode = async () => {
    setLoading(true);
    await profilesAPI.updateCode(profile._id, code);
    setLoading(false);
  }

  const onTestClick = async () => {
    setError(null);
    setOutput('');
    
    if (!payload) {
      console.log('Payload is required');
      return;
    }

    try {
      const resp = await profilesAPI.decode(profile._id, { payload });
      if (resp.errors && resp.errors.length > 0) {
        setError(JSON.stringify(resp.errors, null, 5));
        return;
      }
      setOutput(JSON.stringify(resp.decoded, null, 2));
      setPayload('');
    } catch (err) {
      console.log(err);
      // setError(err);
    }
  }

  useEffect(() => {
    setCode(profile.decoder);
  }, [profile]);

  return (
    <div>
      <Card>
        <Flex>
          <div className="mb-2 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="m-2">
                  <p className="mt-1 mb-2 text-tremor-default text-tremor-content">
                    Decoder function is used to decode incoming device payload into a normalized structure. 
                      In the case of LoRaWAN, here hex/base64 strings are decoded to Zafron's JSON Schema. 
                </p>
                <CodeEditor
                  value={code}
                  language="js"
                  placeholder="Please enter JS code."
                  onChange={(evn) => setCode(evn.target.value)}
                  padding={15}
                  rehypePlugins={[
                    [rehypePrism, { ignoreMissing: true }],
                  ]}
                  style={{
                    borderRadius: 5,
                    border: '1px solid #e1e1e1',
                    backgroundColor: "#333",
                    fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                  }}
                />
                <div className='mt-2'>
                  <Flex justifyContent="start">
                    <Button variant="primary" size='xs' onClick={onUpdateCode}>Update Decoder</Button>
                    { loading && <Spinner /> }
                  </Flex>
                </div>
              </div>
              <div>
                <Title className="mb-4">Documentation</Title>
                <AccordionList>
                  <Accordion>
                    <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Example 1</AccordionHeader>
                    <AccordionBody className="leading-6">
                      <pre>
                      {`
      function decode(payload) {
        return [
        { 
            channel: "100", 
            type: "temp", 
            value: 21.1, 
            unit: "c" 
          },
          { 
            channel: "200", 
            type: "hum", 
            value: 80, 
            unit: "p" 
          }
        ];
      }
                      `}
                      </pre>
                    </AccordionBody>
                  </Accordion>
                  <Accordion>
                    <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Example 2</AccordionHeader>
                    <AccordionBody className="leading-6">
                      <pre>
                      {`
      function decode(buffer) {
        var sensors = [];
        var i = 0, channel, typeByte, type, unit, size, resolution, precision, data, name;
        while (i < buffer.length) {
            channel = buffer.readUInt8(i++);
            typeByte = buffer.readUInt8(i++);
    
            type = 'digital_input';
            unit = 'd';
            size = 0;
            resolution = 0;
            precision = 0;
            data = undefined;
            name = undefined;
    
            switch (typeByte) {
                case 'digital_input':
                    type = 'digital_input';
                    unit = 'd';
                    size = 1;
                    resolution = 1; // Unsigned
                    precision = 0;
                    data = buffer.readUInt8(i);
                    name = "Digital Input";
                    break;
            }

            if (data !== undefined) {
              var value = new Number((data * resolution).toFixed(precision));
              sensors.push({
                  channel: channel,
                  type: type,
                  unit: unit,
                  value: value,
                  name: name ? name + " (" + channel + ")" : undefined
              });
            }
          }
          return sensors;
        }
                      `}</pre>
                    </AccordionBody>
                  </Accordion>
                  <Accordion>
                    <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">More Decoders</AccordionHeader>
                    <AccordionBody className="leading-6">
                      <a href="https://github.com/TheThingsNetwork/lorawan-devices" target="_blank">LoRaWAN Devices Repo</a>
                    </AccordionBody>
                  </Accordion>
                </AccordionList>
              </div>
            </div>
            <Divider />
            <div className="mt-2 ml-2">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="mb-1">Test Function</h4>
                  <p className="mt-1 mb-2 text-tremor-default text-tremor-content">Input the raw data from the sensor in here to test the decoder function. </p>
                  <TextInput value={payload} className="mb-1" onValueChange={setPayload} placeholder="02da2"></TextInput>
                  <Button variant="secondary" size='xs' onClick={onTestClick}>Test</Button>
                </div>
                <div>
                  <h4 className="mb-1">Test Output</h4>
                  { error && <div className="bg-red-100 px-1"><pre className="text-red-500">{error}</pre></div> }
                  { output && <div className="bg-green-100 p-2 border-1 border-gray-200 border-r">
                    <pre>{output}</pre> 
                  </div>}
                  
                </div>
              </div>
              
            </div>
          </div>
          
        </Flex>
      </Card>
    </div>
  )
}
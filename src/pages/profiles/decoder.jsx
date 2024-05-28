import React, { useState, useEffect } from 'react';
import { 
  Flex, 
  Card, 
  Button, 
  TextInput, 
  Divider, 
  Text,
  TabGroup,
  Tab,
  TabList,
  TabPanels,
  TabPanel,
  Title,
  Select,
  SelectItem,
  NumberInput,
  Switch,
 } from '@tremor/react';
  import CodeEditor from '@uiw/react-textarea-code-editor';
  import rehypePrism from '@mapbox/rehype-prism';
  import * as profilesAPI from '../../services/profiles';

import DecoderHelp from './help';

const decoders = [
  { type: 'cayennelpp', name: 'CayenneLPP' },
  { type: 'custom', name: 'Custom' },
];

export default function Decoder({ profile }) {
  const [code, setCode] = useState('');
  const [payload, setPayload] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [output, setOutput] = useState('');
  const [decoderType, setDecoderType] = useState('cayennelpp');
  const [saveLoading, setSaveLoading] = useState(false);
  const [fPort, setFPort] = useState(1);
  const [isHexString, setIsHexString] = useState(false);

  const onUpdateCode = async () => {
    setLoading(true);
    await profilesAPI.updateCode(profile._id, code);
    setLoading(false);
  }

  const onDecoderTypePick = async () => {
    setSaveLoading(true);
    await profilesAPI.update(profile._id, { decoder_type: decoderType });
    setSaveLoading(false);
  }

  const onTestClick = async () => {
    setError(null);
    setOutput('');
    
    console.log(payload);
    if (!payload) {
      console.log('Payload is required');
      return;
    }

    try {
      const resp = await profilesAPI.decode(profile._id, { payload: payload, fPort: fPort});
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
    setDecoderType(profile.decoder_type || 'cayennelpp');
    setCode(profile.decoder || '');
  }, [profile]);

  return (
    <div>
      <Card>
          <div className="mb-2 mt-2">
            <div className="gap-4">
              <div className="m-2">
                <div className="decoder-picker">
                  <label 
                  className="text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">
                    Pick a decoder or build your own
                  </label>
                  <p className="mt-1 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                
                  </p>
                  <div className="mt-2">
                    <Flex>
                      <Select value={decoderType} onValueChange={setDecoderType}>
                        {decoders.map((d) => <SelectItem key={d.type} value={d.type}>{d.name}</SelectItem>)}
                      </Select>
                      <div className='ml-3'>
                        <Button variant="primary" size='md' loading={saveLoading} onClick={onDecoderTypePick}>
                          <span>Save</span>
                        </Button>
                      </div>
                    </Flex>
                  </div>
                </div>
                <Divider className='mb-2'/>
              </div> { /* outergap */}
              { decoderType === 'custom' && 
                <div className='decoder mt-3 mb-2'>
                  <Text className='mb-2'>
                    Decoder function is used to decode incoming device payload into a normalized structure. 
                    In the case of LoRaWAN, here hex/base64 strings are decoded to Zafron's JSON Schema. 
                  </Text>
                  <TabGroup>
                    <TabList variant="solid" defaultValue="1">
                      <Tab value="1">Editor</Tab>
                      <Tab value="2">Test</Tab>
                      <Tab value="3">Help</Tab>
                    </TabList>
                    <Divider className='mb-3'/>
                    <TabPanels>
                      <TabPanel>
                      <div className='mb-2'>
                        <Flex justifyContent="between">
                          <Title>Editor</Title>
                          <Button variant="secondary" size='xs' onClick={onUpdateCode} loading={loading}>Update</Button>
                        </Flex>
                      </div>
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
                            overflow: 'auto',
                            borderRadius: 5,
                            border: '1px solid #e1e1e1',
                            backgroundColor: "#333",
                            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
                          }}
                        />
                

                      </TabPanel>
                      <TabPanel>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <h4 className="mb-1">Test Decoder</h4>
                            <p className="mt-1 mb-2 text-tremor-default text-tremor-content">Input the raw data from the sensor in here to test the decoder function. </p>
                            <label className='text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong'>Raw Payload</label>
                            <TextInput value={payload} className="mb-1" onValueChange={setPayload} placeholder="base64 e.g. AQIBGgAAAAAAAAA="></TextInput>
                            <div className="flex items-center space-x-3">
                              <Switch
                                id="switch"
                                name="switch"
                                checked={isHexString}
                                onChange={setIsHexString}
                              />
                              <label htmlFor="switch" className="text-tremor-default text-tremor-content dark:text-dark-tremor-content">
                                Is Hex String{' '}
                              </label>
                            </div>
                            <div className='mb-2'>
                            <label className='text-tremor-default font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong'>FPort</label>
                            <NumberInput value={fPort} onValueChange={setFPort} />
                            </div>
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
              
                      </TabPanel>
                      <TabPanel>
                        <DecoderHelp />
                      </TabPanel>
                    </TabPanels>
                  </TabGroup>
                </div> }
            </div>
          </div>
      </Card>
    </div>
  )
}
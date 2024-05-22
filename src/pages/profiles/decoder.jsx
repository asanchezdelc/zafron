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
  Title
 } from '@tremor/react';
  import CodeEditor from '@uiw/react-textarea-code-editor';
  import rehypePrism from '@mapbox/rehype-prism';
  import * as profilesAPI from '../../services/profiles';

import DecoderHelp from './help';
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
            <div className="gap-4">
              <div className="m-2">
                <Text>
                  Decoder function is used to decode incoming device payload into a normalized structure. 
                    In the case of LoRaWAN, here hex/base64 strings are decoded to Zafron's JSON Schema. 
                </Text>
                <div className='mt-3 mb-2'>
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
                          <Button variant="primary" size='xs' onClick={onUpdateCode}>Save</Button>
                          { loading && <Spinner /> }
                        </Flex>
                      </div>
                        <CodeEditor
                          value={code}
                          language="js"
                          placeholder="Please enter JS code."
                          onChange={(evn) => setCode(evn.target.value)}
                          padding={15}
                          minHeight={8}
                          rehypePlugins={[
                            [rehypePrism, { ignoreMissing: true }],
                          ]}
                          style={{
                            height: 600,
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
              
                      </TabPanel>
                      <TabPanel>
                        <DecoderHelp />
                      </TabPanel>
                    </TabPanels>
                  </TabGroup>
                  </div>

                
              </div>
              {/* */}
            </div>
            
           
          </div>
          
        </Flex>
      </Card>
    </div>
  )
}
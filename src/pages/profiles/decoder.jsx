import React, { useState } from 'react';
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

export default function Decoder({ profileId }) {
  const [code, setCode] = useState(`function decode(payload) {\n  return [{ channel: 9, \ntype: "temp", \nvalue: 1, \nunit: "9" }];\n}`);
  const [payload, setPayload] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState({});
  const [output, setOutput] = useState('');

  const onUpdateCode = async () => {
    console.log(code);
    await profilesAPI.updateCode(profileId, code);
  }

  const onTestClick = async () => {
    if (!payload) {
      console.log('Payload is required');
      return;
    }

    try {
      const resp = await profilesAPI.decode(profileId, { payload });
      console.log(resp);
      setOutput(JSON.stringify(resp));
      setPayload('');
    } catch (err) {
      console.log(err);
      setError(err);
    }

    
  }

  return (
    <div>
      <Card>
        <Flex>
          <div className="mb-2 mt-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="m-2">
                  <p className="mt-1 mb-2 text-tremor-default text-tremor-content dark:text-dark-tremor-content">
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
                  <Button variant="primary" size='xs' onClick={onUpdateCode}>Update Decoder</Button>
                </div>
              </div>
              <div>
                <Title>Help</Title>
                <AccordionList>
                  <Accordion>
                    <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Accordion 1</AccordionHeader>
                    <AccordionBody className="leading-6">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
                      tempor lorem non est congue blandit. Praesent non lorem sodales,
                      suscipit est sed, hendrerit dolor.
                    </AccordionBody>
                  </Accordion>
                  <Accordion>
                    <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Accordion 2</AccordionHeader>
                    <AccordionBody className="leading-6">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
                      tempor lorem non est congue blandit. Praesent non lorem sodales,
                      suscipit est sed, hendrerit dolor.
                    </AccordionBody>
                  </Accordion>
                  <Accordion>
                    <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Accordion 3</AccordionHeader>
                    <AccordionBody className="leading-6">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus
                      tempor lorem non est congue blandit. Praesent non lorem sodales,
                      suscipit est sed, hendrerit dolor.
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
                  <TextInput value={payload} className="mb-1" onValueChange={setPayload} placeholder="02da2"></TextInput>
                  <Button variant="secondary" size='xs' onClick={onTestClick}>Test</Button>
                </div>
                <div>
                  <h4 className="mb-1">Output</h4>
                    { output && <div className="bg-gray-100 p-2 border-1 border-gray-200"><code>{output}</code></div> }
                </div>
              </div>
              
            </div>
          </div>
          
        </Flex>
      </Card>
    </div>
  )
}
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
    if (!payload) {
      console.log('Payload is required');
      return;
    }

    try {
      const resp = await profilesAPI.decode(profile.id, { payload });
      setOutput(JSON.stringify(resp));
      setPayload('');
    } catch (err) {
      console.log(err);
      setError(err);
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
                  <p className="mt-1 mb-2 text-tremor-default text-tremor-content">Input the raw data from the sensor in here to test the decoder function. </p>
                  <TextInput value={payload} className="mb-1" onValueChange={setPayload} placeholder="02da2"></TextInput>
                  <Button variant="secondary" size='xs' onClick={onTestClick}>Test</Button>
                </div>
                <div>
                  <h4 className="mb-1">Output</h4>
                  { error && <p className="text-red-500">{error}</p> }
                  <div className="bg-gray-100 p-2 border-1 border-gray-200 border-r">
                    { output && <code>{output}</code> }
                  </div>
                </div>
              </div>
              
            </div>
          </div>
          
        </Flex>
      </Card>
    </div>
  )
}
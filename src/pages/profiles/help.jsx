import  {
AccordionList, 
AccordionHeader, 
AccordionBody,
Title,
Accordion
} from '@tremor/react';
import CodeEditor from '@uiw/react-textarea-code-editor';


export default function DecoderHelp() {
  return (
    <div>
    <Title className="mb-4">Documentation</Title>
    <AccordionList>
      <Accordion>
        <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Example 1</AccordionHeader>
        <AccordionBody className="leading-6">
        <CodeEditor 
          language='js'
          style={{
            height: 600,
            overflow: 'auto',
            borderRadius: 5,
            border: '1px solid #e1e1e1',
            backgroundColor: "#333",
            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
          }}
          value={`
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
  }`} >

          </CodeEditor>
        </AccordionBody>
      </Accordion>
      <Accordion>
        <AccordionHeader className="text-sm font-medium text-tremor-content-strong dark:text-dark-tremor-content-strong">Cayenne LPP</AccordionHeader>
        <AccordionBody className="leading-6">
          <p>Here's limited example of Cayenne LPP decoder.</p>
          <CodeEditor 
          language='js'
          style={{
            height: 600,
            overflow: 'auto',
            borderRadius: 5,
            border: '1px solid #e1e1e1',
            backgroundColor: "#333",
            fontFamily: 'ui-monospace,SFMono-Regular,SF Mono,Consolas,Liberation Mono,Menlo,monospace',
          }}
          value={`
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
                `} ></CodeEditor>
          
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
  )
}

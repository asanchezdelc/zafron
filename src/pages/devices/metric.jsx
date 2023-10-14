import { AreaChart, Text, Flex, Card, Metric, Button, Icon } from "@tremor/react";
import { PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import * as deviceAPI from "../../services/device";
import { useState, useEffect } from "react";
import { toFriendlyTime } from "../../services/utils";
import Toggle from "../../components/Toggle";
export default function MetricCard({ deviceId, capability, onAddCapability, onEditCapability }) {
  const [data, setData] = useState([]);
  const [isActuator, setIsActuator] = useState(false);

  function transformData(data) {
    return data.map(item => ({
      date: toFriendlyTime(item.timestamp),
      Measurement: item.value
    }));
  }

  useEffect(() => {
    const fetchData = async () => {
      const result = await deviceAPI.fetchMetric(deviceId, capability.channel);
      const chartData = transformData(result);
      setData(chartData);
    };

    if (capability.type === 'digital_actuator' || capability.type === 'analog_actuator') {
      setIsActuator(true);
    }

    if (!capability.new || !capability._id) {
      fetchData();
    }

  }, [capability._id, capability.channel, capability.new, capability.type, deviceId]);

  return (
    <Card decoration="top" decorationColor={capability.new ? 'green':'indigo'}>
      <Flex alignItems="start">
        <Text>{capability.name || capability.type}</Text>
        {!capability.new && (
          <Button 
            variant="light" 
            onClick={() => onEditCapability(capability)} 
            size="sm" 
            className="ml-2 border-1" 
            icon={PencilSquareIcon}>
          </Button>
        )}
        {capability.new && (<Button variant="light" onClick={() => onAddCapability(capability)} size="sm" className="ml-2 border-1" icon={PlusCircleIcon}>Add</Button>)}
      </Flex>
      <Flex className="space-x-3 truncate" justifyContent="start" alignItems="baseline">
        {/* <Icon icon={BoltIcon} variant="light" size="xl" color={'indigo'} /> */}
        <Metric>{capability.value}</Metric>
        <Text>{capability.unit}</Text>        
      </Flex>
      { !capability.new && !isActuator && (
       <AreaChart
        className="mt-6 h-28"
        data={data}
        index="date"
        valueFormatter={value => `${value.toFixed(2)} ${capability.unit}`}
        categories={['Measurement']}
        colors={["blue"]}
        showXAxis={true}
        showGridLines={false}
        startEndOnly={true}
        showYAxis={false}
        showLegend={false}
      /> )}
      { isActuator && <Flex justifyContent="center" alignItems="center">
          <Toggle />
        </Flex>}
    </Card>
  );
}
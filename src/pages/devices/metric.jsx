import { AreaChart, Text, Flex, Card, Metric, Button, Icon } from "@tremor/react";
import { BoltIcon, PlusCircleIcon } from "@heroicons/react/24/outline";
import * as deviceAPI from "../../services/device";
import { useState, useEffect } from "react";
import { toFriendlyTime } from "../../services/utils";

export default function MetricCard({ deviceId, capability, onAddCapability }) {
  console.log(capability)
  const [data, setData] = useState([]);

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

    if (!capability.new) {
      fetchData();
    }

    fetchData();
  }, [deviceId, capability.channel, capability.new]);

  return (
    <Card decoration="top" decorationColor={capability.new ? 'green':'indigo'}>
      <Flex alignItems="start">
        <Text>{capability.type}</Text>
        {capability.new && (<Button variant="light" onClick={() => onAddCapability(capability)} size="sm" className="ml-2 border-1" icon={PlusCircleIcon}>Add</Button>)}
      </Flex>
      <Flex className="space-x-3 truncate" justifyContent="start" alignItems="baseline">
        {/* <Icon icon={BoltIcon} variant="light" size="xl" color={'indigo'} /> */}
        <Metric>{capability.value}</Metric>
        <Text>{capability.unit}</Text>        
      </Flex>
      { !capability.new && (
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
    </Card>
  );
}
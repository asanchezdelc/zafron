import { AreaChart, Text, Flex, Card, Metric, Button, Icon } from "@tremor/react";
import { BoltIcon, PlusCircleIcon } from "@heroicons/react/24/outline";


export default function MetricCard({ capability, onAddCapability }) {
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
      {/* <AreaChart
        className="mt-6 h-28"
        data={data}
        index="Month"
        valueFormatter={(number) =>
          `$ ${Intl.NumberFormat("us").format(number).toString()}`
        }
        categories={['Sales']}
        colors={["blue"]}
        showXAxis={true}
        showGridLines={false}
        startEndOnly={true}
        showYAxis={false}
        showLegend={false}
      /> */}
    </Card>
  );
}
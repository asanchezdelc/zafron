import React, { useEffect, useState } from 'react';
import { Card, Title, 
  Flex, Text,
  BarChart ,
  Metric,
  Select,
  SelectItem,
} from '@tremor/react';
import LogTable from './logtable';
import * as devicesAPI from '../../../services/device';
import Pagination from './pagination';

export default function LogPanel({ deviceId }) {
  const [chartData, setChartData] = useState([]);
  const [events, setEvents] = useState({ readings: []});
  const [pakcetCount, setPacketCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getHistogram = async () => {
    try {
      const data = await devicesAPI.fetchHistogram(deviceId);
      const fillchartData = data.map(item => ({
        time: `${item._id.hour}:${item._id.minute}`,
        readings: item.count
      }));

      let noData = true;
      let totalCount = 0;
      data.forEach(item => {
        if (item.count > 0) {
          noData = false;
        }
        totalCount += item.count;
      });

      setPacketCount(totalCount);

      if (!noData) {
        setChartData(fillchartData);
      }

     
    } catch (err) {
      console.error("Error fetching device:", err);
    }
  }

  const getReadings = async () => {
    try {
      const data = await devicesAPI.fetchReadings(deviceId, currentPage, 10);
      setEvents(data);
      setTotalPages(data.totalPages);
      //setCurrentPage(data.currentPage);
    } catch (err) {
      console.error("Error fetching device:", err);
    }
  }

  useEffect(() => {
    if (deviceId === undefined) {
      return;
    }
    
    getHistogram();
    getReadings();

  }, [deviceId, currentPage]); 

  const onChange = (page) => {
    setCurrentPage(page);
    getReadings();
  }

  return (
    <div>
      <Card>
              <Flex justifyContent="start" alignItems="baseline" className="space-x-3 truncate">
                  <Metric>{pakcetCount}</Metric>
                  <Text>Packets in the last 15 minutes</Text>
              </Flex>
                <BarChart
                    className="mt-6 h-28"
                    data={chartData}
                    index="time"
                    categories={["readings"]}
                    colors={["blue"]}
                    showGridLines={false}
                    startEndOnly={true}
                    showYAxis={false}
                    showXAxis={true}
                    showLegend={false}
                />
             </Card>
            <Card className="mt-6">
              <Flex>
                <div>
                <Flex justifyContent="start" className="space-x-2">
                  <Title>Logs</Title>
                  {/* <Badge color="gray">8</Badge> */}
                  
              </Flex>
                </div>
                <div>
                  <Select className="w-48">
                    <SelectItem value='15m'>Last 15 minutes</SelectItem>
                    <SelectItem value='1h'>Last hour</SelectItem>
                    <SelectItem value='12h'>Last 12 hours</SelectItem>
                    <SelectItem value='24h'>Last 24 hours</SelectItem>
                    <SelectItem value='3d'>Last 3 days</SelectItem>
                    <SelectItem value='1w'>Last week</SelectItem>
                  </Select>
                </div>
              </Flex>
             
              
              <Text className="mt-2">Raw logs from device.</Text>
              <LogTable logs={events} />
              { events.readings.length > 1 && (
              <div className="mt-4">
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  onChange={onChange} 
                />
              </div>
              )}
            </Card>
            </div>
  )
}
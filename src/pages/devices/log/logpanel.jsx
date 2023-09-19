import React, { useEffect, useState } from 'react';
import { Card, Title, 
  Flex, Text,
  BarChart ,
  Metric,
  Select,
  SelectItem,
  Badge,
} from '@tremor/react';
import LogTable from './logtable';
import * as devicesAPI from '../../../services/device';
import Pagination from './pagination';

const quickRanges = [
  { label: 'Last 15 minutes', value: '15m' },
  { label: 'Last hour', value: '1h' },
  { label: 'Last 12 hours', value: '12h' },
  { label: 'Last 24 hours', value: '24h' },
  { label: 'Last 3 days', value: '3d' },
  { label: 'Last week', value: '1w' },
];

export default function LogPanel({ deviceId }) {
  const [events, setEvents] = useState({ readings: []});
  const [pakcetCount, setPacketCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const getReadings = async () => {
    try {
      const data = await devicesAPI.fetchReadings(deviceId, currentPage, 10);
      setEvents(data);
      setTotalPages(data.totalPages);
      setPacketCount(data.count);
    } catch (err) {
      console.error("Error fetching device:", err);
    }
  }

  useEffect(() => {
    if (deviceId === undefined) {
      return;
    }
    
    getReadings();

  }, [deviceId, currentPage]); 

  const onChange = (page) => {
    setCurrentPage(page);
    getReadings();
  }

  const onDateSelector = (e) => {
    //const value = e.target.value;
    console.log(e)
  }

  return (
    <div>
      <Card className="mt-6">
        <Flex>
          <div>
          <Flex justifyContent="start" className="space-x-2">
            <Title>Logs</Title>
            <Badge size="xs">{pakcetCount} Entries</Badge>            
        </Flex>
          </div>
          <div>
            <Select onValueChange={onDateSelector} placeholder="Select time frame"
 className="w-48">
              { quickRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
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
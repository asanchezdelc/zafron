import React, { useEffect, useState } from 'react';
import { Card, Title, 
  Flex, Text,
  Button ,
  Select,
  SelectItem,
  Badge,
} from '@tremor/react';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import Spinner from '../../../components/spinner';
import LogTable from './logtable';
import * as devicesAPI from '../../../services/device';
import Pagination from './pagination';
import moment from 'moment';

const quickRanges = [
  { label: 'Last 15 minutes', value: '15m' },
  { label: 'Last 30 minutes', value: '30m' },
  { label: 'Last hour', value: '1h' },
  { label: 'Last 24 hours', value: '24h' },
  { label: 'Last 3 days', value: '3d' },
  { label: 'Last week', value: '1w' },
  { label: 'Last month', value: '1mo' },
  { label: 'All time', value: '-1' },
];

export default function LogPanel({ deviceId }) {
  const [events, setEvents] = useState({ readings: []});
  const [pakcetCount, setPacketCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [timeFrame, setTimeFrame] = useState('-1');
  const [loading, setLoading] = useState(false);

  const getStartDate = () => {
    let startDate;
    switch (timeFrame) {
      case '15m':
        startDate = moment().subtract(15, 'minutes').toISOString();
        break;
      case '1h':
        startDate = moment().subtract(1, 'hours').toISOString();
        break;
      case '30m':
        startDate = moment().subtract(30, 'minutes').toISOString();
        break;
      case '24h':
        startDate = moment().subtract(24, 'hours').toISOString();
        break;
      case '3d':
        startDate = moment().subtract(3, 'days').toISOString();
        break;
      case '1w':
        startDate = moment().subtract(1, 'weeks').toISOString();
        break;
      case '1mo':
        startDate = moment().subtract(1, 'months').toISOString();
        break;
      default:
        startDate = moment().subtract(15, 'minutes').toISOString();
    }

    return startDate;
  }

  const getReadings = async () => {
    try {
      setLoading(true);
      let data;
      if (timeFrame === '-1') {
        data = await devicesAPI.fetchReadings(deviceId, currentPage, 10);
      } else {
        const endDate = moment().toISOString();
        const startDate = getStartDate();
        data = await devicesAPI.fetchReadings(deviceId, currentPage, 10, startDate, endDate);
      }
      setEvents(data);
      setTotalPages(data.totalPages);
      setPacketCount(data.count);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching device:", err);
    }
  }

  useEffect(() => {
    if (deviceId === undefined) {
      return;
    }
    
    getReadings();

  }, [deviceId, currentPage, timeFrame]); 

  const onChange = (page) => {
    setCurrentPage(page);
    getReadings();
  }

  const onDateSelector = (value) => {
    setTimeFrame(value);
    getReadings();
  }

  const onRefresh = () => {
    getReadings();
  }

  return (
    <div>
      <Card className="mt-5">
        <Flex>
          <div>
            <Flex justifyContent="start" className="space-x-2">
              <Title>Logs</Title>
              <Badge size="xs">{pakcetCount} Entries</Badge>            
            </Flex>
          </div>
          <div>
            <Flex justifyContent="end" className="space-x-2">
            <Select onValueChange={onDateSelector} 
              placeholder="Select time frame"
              className="w-48">
              { quickRanges.map((range) => (
                <SelectItem key={range.value} value={range.value}>
                  {range.label}
                </SelectItem>
              ))}
            </Select>
            <Button onClick={onRefresh} icon={ArrowPathIcon}>
              Refresh
            </Button>
            </Flex>
          </div>
        </Flex>
        
        
        <Text className="mt-2">Raw logs from device.</Text>
        <hr className="mt-1" />
        
        { loading ? (<Spinner />) : 
          <div className="logtable">
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
          </div>
         }
      </Card>
    </div>
  )
}
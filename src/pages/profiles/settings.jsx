import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Nav from '../../components/nav';
import { Flex, 
  Text, Title, 
  Icon, Tab, TabGroup, 
  TabList, TabPanel, 
  TabPanels 
} from '@tremor/react';
import Decoder from './decoder';
import * as profileAPI from '../../services/profiles';
import { CodeBracketIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import Config from './config';

export default function ProfileSettings() {
  const { profileId } = useParams();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getDevice = async () => {
      try {
        const data = await profileAPI.fetchOne(profileId);
        setProfile(data);
        
      } catch (err) {
        console.error("Error fetching profile:", err);
      }
    };
    getDevice();
  }, [profileId]);

  return (
    <div>
      <Nav />
      <main className="p-4 md:p-10 mx-auto max-w-7xl">
        <Flex justifyContent="between">

        <Flex justifyContent="start" className="space-x-4">
            <Icon icon={CodeBracketIcon} variant="light" size="xl" color={'blue'} />
            <div>
              <Title>{profile.name}</Title>
              <Text>
                {profile.serial}
              </Text>
            </div>
          </Flex>
        </Flex>
        <TabGroup className="mt-6">
          <TabList>
            <Tab style={{"overflow": "unset"}} icon={CodeBracketIcon}>Decoder</Tab>
            <Tab style={{"overflow": "unset"}} icon={Cog6ToothIcon}>Settings</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Decoder profileId={profileId} profile={profile} />
            </TabPanel>
            <TabPanel>
              <Config />
            </TabPanel>
          </TabPanels>
        </TabGroup>
      </main>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import MqttContext from './MqttContext';
import * as mqtt from 'mqtt/dist/mqtt.min';
import { useAuth } from '../../services/AuthProvider';

const API_URL = process.env.REACT_APP_API_URL;

function MqttClient({ children }) {
    const [client, setClient] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const { isAuthenticated, currentUser } = useAuth();
    const [options, setOptions] = useState();



    useEffect(() => {
        // user is not authenticated, do not connect to mqtt
        if (!isAuthenticated() || !currentUser) {
          return;
        }
        console.log(currentUser);
        const opts = {
          username: currentUser.mqttCredentials.username,
          password: currentUser.mqttCredentials.password,
          clientId: `zafron-web-${currentUser._id}`,
        }
        
        // Create a new MQTT client instance
        const mqttClient = mqtt.connect(`ws://${API_URL}/wslive`, opts);

        mqttClient.on('connect', () => {
            setIsConnected(true);
            
            // Subscribe to a topic
            mqttClient.subscribe(`v1/${opts.username}/things/#`, (err) => {
                if (err) console.error("Error subscribing to topic:", err);
            });
        });

        // Save MQTT client instance in state
        setClient(mqttClient);

        return () => {
            if (mqttClient) {
                mqttClient.end();
            }
        };
    }, [currentUser]); // The empty array ensures this effect runs only once on mount and unmount

    return (
      <MqttContext.Provider value={client}>
          {children}
      </MqttContext.Provider>
  );
}

export default MqttClient;

export class MQTTPacket {
  constructor(packet) {
      this.topic = packet.topic || "";
      this.rawPayload = packet.payload || "";
      this.capabilities = [];
      this.serial = '';

      this.parsePayload(this.rawPayload);
  }

  /**
   * Parses the payload.
   * This is a naive parser and assumes the payload is a JSON string.
   * Adjust accordingly based on your actual payload format.
   */
  parsePayload(rawPayload) {
    // v1/ticadia/things/esp32-1/data/json
    this.serial = this.topic.split('/')[3];
    if (!this.topic.includes('data/json')) {
      // save individual readings (temp,k=22)
      // parse payload
      try {
        let channel;
        let payload;

        if (this.topic !== '') {
          channel = this.topic.split('/')[5];
        }

        if (rawPayload.toString() !== '') {
          payload = rawPayload.toString();
        }

        if (!channel || !payload) {
          return;
        }

        const parts = payload.split(',');
        if (parts.length !== 2) {
          return;
        }

        const vals = parts[1].split('=');

        const uplink = {
          type: parts[0],
          unit: vals[0],
          value: vals[1],
          channel: channel,
        }
        this.capabilities.push(uplink);
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        this.capabilities = JSON.parse(rawPayload);
      } catch (err) {
          console.error("Failed to parse payload:", rawPayload);
          return null;
      }      
    }      
  }

  /**
   * Get the topic of the MQTT packet.
   */
  getTopic() {
      return this.topic;
  }

  getSerial() {
      return this.serial;
  }

  /**
   * Get raw payload.
   */
  getRawPayload() {
      return this.rawPayload;
  }

  /**
   * Get capabilities
   */
  getCaps() {
      return this.capabilities;
  }
}

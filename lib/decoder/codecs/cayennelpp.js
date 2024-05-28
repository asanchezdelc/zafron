// Test Sample : 0167ffd7037104d2fb2e0000

/* LPP_TYPE = IPSO_OBJECT_ID - 3200 */
var LPP_TYPE = {}

LPP_TYPE.DIGITAL_INPUT = 0x00;
LPP_TYPE.DIGITAL_OUTPUT = 0x01;
LPP_TYPE.ANALOG_INPUT = 0x02;
LPP_TYPE.ANALOG_OUTPUT = 0x03;
LPP_TYPE.LUMINOSITY = 0x65;
LPP_TYPE.PRESENCE = 0x66;
LPP_TYPE.TEMPERATURE = 0x67;
LPP_TYPE.HUMIDITY = 0x68;
LPP_TYPE.ACCELEROMETER = 0x71;
LPP_TYPE.BAROMETER = 0x73;
LPP_TYPE.CONCENTRATION = 0x7D;
LPP_TYPE.ENERGY = 0x83;
LPP_TYPE.GYROSCOPE = 0x86;
LPP_TYPE.GPS = 0x88;

const DT = {
  Type: {
    DIGITAL_SENSOR: 'digital_sensor',
    DIGITAL_ACTUATOR: 'digital_actuator',
    ANALOG_SENSOR: 'analog_sensor',
    ANALOG_ACTUATOR: 'analog_actuator',
    LUMINOSITY: 'luminosity',
    MOTION: 'motion',
    TEMPERATURE: 'temperature',
    RELATIVE_HUMIDITY: 'relative_humidity',
    ACCELERATION: 'acceleration',
    BAROMETRIC_PRESSURE: 'barometric_pressure',
    GYROSCOPE: 'gyroscope',
    GPS: 'gps',
  },
  Unit: {
    DIGITAL: 'd',
    ANALOG: null,
    LUX: 'lux',
    CELSIUS: 'c',
    PERCENT: '%',
    G: 'g',
    HECTOPASCAL: 'hPa',
    DEGREE_PER_SEC: 'dps',
    METER: 'm',
  },
};

function decode(fPort, buffer, decoded) {
    var sensors = [];
    var i = 0, channel, typeByte, type, unit, size, resolution, precision, data, name;
    while (i < buffer.length) {
        channel = buffer.readUInt8(i++);
        typeByte = buffer.readUInt8(i++);

        type = DT.Type.UNDEFINED;
        unit = DT.Unit.UNDEFINED;
        size = 0;
        resolution = 0;
        precision = 0;
        data = undefined;
        name = undefined;

        switch (typeByte) {
            case LPP_TYPE.DIGITAL_INPUT:
                type = DT.Type.DIGITAL_SENSOR;
                unit = DT.Unit.DIGITAL;
                size = 1;
                resolution = 1; // Unsigned
                precision = 0;
                data = buffer.readUInt8(i);
                name = "Digital Input";
                break;

            case LPP_TYPE.DIGITAL_OUTPUT:
                type = DT.Type.DIGITAL_ACTUATOR;
                unit = DT.Unit.DIGITAL;
                size = 1;
                resolution = 1 // Unsigned
                precision = 0;
                data = buffer.readUInt8(i);
                name = "Digital Output";
                break;

            case LPP_TYPE.ANALOG_INPUT:
                type = DT.Type.ANALOG_SENSOR;
                unit = DT.Unit.ANALOG;
                size = 2;
                resolution = 0.01; // Signed MSB
                precision = 2;
                data = buffer.readInt16BE(i);
                name = "Analog Input";
                break;

            case LPP_TYPE.ANALOG_OUTPUT:
                type = DT.Type.ANALOG_ACTUATOR;
                unit = DT.Unit.ANALOG;
                size = 2;
                resolution = 0.01; // Signed MSB
                precision = 2;
                data = buffer.readInt16BE(i);
                name = "Analog Output";
                break;

            case LPP_TYPE.LUMINOSITY:
                type = DT.Type.LUMINOSITY;
                unit = DT.Unit.LUX;
                size = 2;
                resolution = 1; // Lux Unsigned MSB
                precision = 0;
                data = buffer.readUInt16BE(i);
                name = "Luminosity";
                break;

            case LPP_TYPE.PRESENCE:
                type = DT.Type.MOTION;
                unit = DT.Unit.DIGITAL;
                size = 1;
                resolution = 1; // Unsigned
                precision = 0;
                data = buffer.readUInt8(i);
                name = "Motion";
                break;

            case LPP_TYPE.TEMPERATURE:
                type = DT.Type.TEMPERATURE;
                unit = DT.Unit.CELSIUS;
                size = 2;
                resolution = 0.1; // °C Signed MSB
                precision = 1;
                data = buffer.readInt16BE(i);
                name = "Temperature";
                break;

            case LPP_TYPE.HUMIDITY:
                type = DT.Type.RELATIVE_HUMIDITY;
                unit = DT.Unit.PERCENT;
                size = 1;
                resolution = 0.5; // % Unsigned
                precision = 1;
                data = buffer.readUInt8(i);
                name = "Humidity";
                break;

            case LPP_TYPE.ACCELEROMETER:
                type = DT.Type.ACCELERATION;
                unit = DT.Unit.G;
                size = 6;
                resolution = 0.001; // G Signed MSB per axis
                precision = 3;
                data = [ buffer.readInt16BE(i), buffer.readInt16BE(i+2), buffer.readInt16BE(i+4)]
                name = "Accelerometer";
                break;

            case LPP_TYPE.BAROMETER:
                type = DT.Type.BAROMETRIC_PRESSURE;
                unit = DT.Unit.HECTOPASCAL;
                size = 2;
                resolution = 0.1; // hPa Unsigned MSB
                precision = 1;
                data = buffer.readUInt16BE(i);
                name = "Barometer";
                break;

            case LPP_TYPE.GYROSCOPE:
                type = DT.Type.GYROSCOPE;
                unit = DT.Unit.DEGREE_PER_SEC;
                size = 6;
                resolution = 0.01; // °/s Signed MSB per axis
                precision = 2;
                data = [ buffer.readInt16BE(i), buffer.readInt16BE(i+2), buffer.readInt16BE(i+4)]
                name = "Gyroscope";
                break;

            case LPP_TYPE.GPS:
                type = DT.Type.GPS;
                unit = DT.Unit.METER;
                //size = 9;
                resolution = 1;
                precision = 5;
                const resolutionGPS = 0.0001; // ° Signed MSB
                const resolutionALT = 0.01; // meter Signed MSB

                var lat = 0;
                lat |= buffer.readUInt8(i++) << 16;
                lat |= buffer.readUInt8(i++) << 8;
                lat |= buffer.readUInt8(i++);
                if( lat & 0x800000 ) {
                    lat -= 0x1000000;
                }
                lat *= resolutionGPS;

                var lon = 0;
                lon |= buffer.readUInt8(i++) << 16;
                lon |= buffer.readUInt8(i++) << 8;
                lon |= buffer.readUInt8(i++);
                if( lon & 0x800000 ) {
                    lon -= 0x1000000;
                }
                lon *= resolutionGPS;

                var alt = 0;
                alt |= buffer.readUInt8(i++) << 16;
                alt |= buffer.readUInt8(i++) << 8;
                alt |= buffer.readUInt8(i++);
                if( alt & 0x800000 ) {
                    alt -= 0x1000000;
                }
                alt *= resolutionALT;

                data = [lat, lon, alt];
                name = "GPS";
                break;
                
            case LPP_TYPE.ENERGY:
                type = DT.Type.ANALOG_SENSOR;
                unit = DT.Unit.ANALOG;
                size = 4;
                resolution = 1; // W*h
                precision = 1;
                data = buffer.readUInt32BE(i);
                name = "Energy (W.h)"
                break;
                
            case LPP_TYPE.CONCENTRATION:
                type = DT.Type.ANALOG_SENSOR;
                unit = DT.Unit.ANALOG;
                size = 3;
                resolution = 0.001; // hPa Unsigned MSB
                precision = 4;
                data = buffer.readUIntBE(i,3);
                name = "Concentration (ppm)"
                break;


            default:
                break;
        }

        if (data !== undefined) {
            var value;
            if (data instanceof Array) {
                value = [];
                data.forEach((v) => {
                    value.push(new Number((v * resolution).toFixed(precision)));
                })
            }
            else {
                value = new Number((data * resolution).toFixed(precision));
            }

            sensors.push({
                channel: channel,
                type: type,
                unit: unit,
                value: value,
                name: name ? name + " (" + channel + ")" : undefined
            });
        }
        else {
            throw new Error("Not Implemented LPP type: 0x" + typeByte.toString(16));
        }

        i+=size;
    }
    return sensors;
}

exports.decode = decode;
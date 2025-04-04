require('dotenv').config();

const config = {
    port: process.env.PORT || 8080,
    api: {
        url: process.env.API_URL,
        key: process.env.API_KEY
    },
    weather: {
        apiKey: process.env.WEATHER_API_KEY,
        location: {
            lat: 10.3157,
            lon: 123.8854,
            name: 'Cebu City'
        },
        checkInterval: 3, // hours
        thresholds: {
            heavyRain: 20, // mm/h
            highHumidity: 90, // %
            highTemperature: 35, // °C
            lowTemperature: 15, // °C
            strongWind: 10 // m/s
        }
    },
    diseaseAlerts: {
        tungro: {
            schedule: '0 9 * * 1', // Every Monday at 9 AM
            riskMonths: [8, 9, 10] // August to October
        },
        blast: {
            schedule: '0 9 * * 3', // Every Wednesday at 9 AM
            riskMonths: [5, 6, 7, 8, 9, 10] // May to October
        },
        blight: {
            schedule: '0 9 * * 5', // Every Friday at 9 AM
            riskMonths: [6, 7, 8, 9] // June to September
        }
    }
};

module.exports = config; 
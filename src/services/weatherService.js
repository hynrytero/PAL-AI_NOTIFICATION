const moment = require('moment-timezone');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const config = require('../config/config');
const notificationService = require('./notificationService');

class WeatherService {
    async checkWeatherConditions() {
        try {
            const { lat, lon, name } = config.weather.location;
            
            console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Fetching weather data for ${name}...`);
            const response = await fetch(
                `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${config.weather.apiKey}&units=metric`
            );
            const weatherData = await response.json();
            
            console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Weather data received:`, {
                temperature: weatherData.main.temp,
                humidity: weatherData.main.humidity,
                rain: weatherData.rain ? weatherData.rain['1h'] || 0 : 0,
                windSpeed: weatherData.wind.speed,
                description: weatherData.weather[0].description
            });
            
            return {
                temperature: weatherData.main.temp,
                humidity: weatherData.main.humidity,
                rain: weatherData.rain ? weatherData.rain['1h'] || 0 : 0,
                description: weatherData.weather[0].description,
                windSpeed: weatherData.wind.speed,
                location: name
            };
        } catch (error) {
            console.error(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Error fetching weather data:`, error);
            return null;
        }
    }

    async sendWeatherAlert(conditions) {
        const { thresholds } = config.weather;
        let alertMessage = '';
        let alertType = '';
        let recommendations = '';
        
        console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Checking weather conditions for alerts:`, conditions);
        
        if (conditions.rain > thresholds.heavyRain) {
            alertMessage = `Heavy rainfall alert in ${conditions.location} (${conditions.rain}mm/h)!`;
            alertType = 'heavy_rain';
            recommendations = `• Check field drainage systems\n• Monitor water levels in paddies\n• Prepare for possible flooding\n• Consider early harvest if crops are mature`;
        } else if (conditions.humidity > thresholds.highHumidity) {
            alertMessage = `High humidity alert in ${conditions.location} (${conditions.humidity}%)!`;
            alertType = 'high_humidity';
            recommendations = `• Increase field ventilation\n• Monitor for early disease symptoms\n• Consider preventive fungicide application\n• Avoid excessive nitrogen fertilization`;
        } else if (conditions.temperature > thresholds.highTemperature) {
            alertMessage = `High temperature alert in ${conditions.location} (${conditions.temperature}°C)!`;
            alertType = 'high_temperature';
            recommendations = `• Ensure adequate water supply\n• Monitor for heat stress symptoms\n• Consider shading young plants\n• Adjust irrigation schedule to cooler times`;
        } else if (conditions.temperature < thresholds.lowTemperature) {
            alertMessage = `Low temperature alert in ${conditions.location} (${conditions.temperature}°C)!`;
            alertType = 'low_temperature';
            recommendations = `• Monitor for cold stress symptoms\n• Consider water management to retain heat\n• Protect young seedlings if possible\n• Delay transplanting if planned`;
        } else if (conditions.windSpeed > thresholds.strongWind) {
            alertMessage = `Strong wind alert in ${conditions.location} (${conditions.windSpeed} m/s)!`;
            alertType = 'strong_wind';
            recommendations = `• Check field structures and supports\n• Monitor for lodging in tall varieties\n• Secure loose materials\n• Consider windbreaks if available`;
        }
        
        if (alertMessage) {
            console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Sending weather alert:`, {
                message: alertMessage,
                type: alertType,
                recommendations: recommendations
            });
            
            try {
                await notificationService.sendNotification({
                    title: `Weather Alert for Rice Fields in ${conditions.location}`,
                    body: `${alertMessage}\nCurrent conditions: ${conditions.description}\n\nRecommendations:\n${recommendations}`,
                    icon: 'weather',
                    icon_bg_color: 'blue',
                    type: 'weather_alert',
                    scheduled_time: moment().format('HH:mm A')
                });
                
                console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Weather alert sent successfully`);
            } catch (error) {
                console.error(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Error sending weather alert:`, error);
            }
        } else {
            console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] No weather alerts triggered for current conditions`);
        }
    }
}

module.exports = new WeatherService(); 
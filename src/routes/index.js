const express = require('express');
const router = express.Router();
const moment = require('moment-timezone');
const weatherService = require('../services/weatherService');
const notificationService = require('../services/notificationService');

// Test notification endpoint
router.get('/test-notification', async (req, res) => {
    try {
        const result = await notificationService.sendNotification({
            title: 'Test Notification',
            body: `Test notification sent at ${moment().format('YYYY-MM-DD HH:mm:ss')}`,
            icon: 'test',
            icon_bg_color: 'orange',
            type: 'test'
        });
        res.json({ success: true, message: 'Test notification sent successfully', result });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to send test notification', error: error.message });
    }
});

// Test weather endpoint
router.get('/test-weather', async (req, res) => {
    try {
        console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Manual weather check triggered`);
        const conditions = await weatherService.checkWeatherConditions();
        
        if (conditions) {
            // Check if any alerts would be triggered
            const alerts = [];
            if (conditions.rain > 20) alerts.push('Heavy rainfall');
            if (conditions.humidity > 90) alerts.push('High humidity');
            if (conditions.temperature > 35) alerts.push('High temperature');
            if (conditions.temperature < 15) alerts.push('Low temperature');
            if (conditions.windSpeed > 10) alerts.push('Strong winds');
            
            // Force send a test notification
            console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Sending test notification...`);
            await notificationService.sendNotification({
                title: 'Test Weather Alert',
                body: `This is a test notification. Current conditions in ${conditions.location}:\nTemperature: ${conditions.temperature}°C\nHumidity: ${conditions.humidity}%\nRain: ${conditions.rain}mm/h\nWind: ${conditions.windSpeed} m/s`,
                icon: 'test',
                icon_bg_color: 'green',
                type: 'test_alert',
                scheduled_time: moment().format('HH:mm A')
            });
            
            res.json({
                success: true,
                message: 'Weather check completed',
                current_conditions: conditions,
                active_alerts: alerts.length > 0 ? alerts : 'No alerts triggered',
                test_notification: 'Sent'
            });
        } else {
            res.status(500).json({
                success: false,
                message: 'Failed to fetch weather data'
            });
        }
    } catch (error) {
        console.error(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Error in test-weather endpoint:`, error);
        res.status(500).json({
            success: false,
            message: 'Error checking weather',
            error: error.message
        });
    }
});

// Root endpoint
router.get('/', (req, res) => {
    res.send('Notification Service Running\n');
});

module.exports = router; 
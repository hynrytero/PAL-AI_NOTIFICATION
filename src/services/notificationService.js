const moment = require('moment-timezone');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const config = require('../config/config');

class NotificationService {
    async sendNotification(notificationData) {
        try {
            console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Attempting to send notification:`, notificationData);
            
            // Send to the API
            const response = await fetch(`${config.api.url}/notifications/store-notification-all`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-API-Key': config.api.key
                },
                body: JSON.stringify({
                    ...notificationData,
                    timestamp: moment().format('YYYY-MM-DD HH:mm:ss'),
                    server_timezone: moment.tz.guess()
                })
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const result = await response.json();
            
            // Send broadcast notification
            try {
                console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Attempting to send broadcast notification...`);
                const broadcastResponse = await fetch(`${config.api.url}/push-notify/broadcast`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': config.api.key
                    },
                    body: JSON.stringify({
                        title: notificationData.title,
                        body: notificationData.body,
                        data: {
                            type: notificationData.type,
                            icon: notificationData.icon,
                            icon_bg_color: notificationData.icon_bg_color,
                            scheduled_time: notificationData.scheduled_time
                        }
                    })
                });

                if (!broadcastResponse.ok) {
                    console.warn(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Broadcast endpoint returned ${broadcastResponse.status}. This is non-critical.`);
                } else {
                    const broadcastResult = await broadcastResponse.json();
                    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Broadcast sent successfully:`, broadcastResult);
                }
            } catch (broadcastError) {
                console.warn(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Broadcast notification failed:`, broadcastError.message);
            }
            
            console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Notification sent successfully:`, result);
            return result;
        } catch (error) {
            console.error(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Error sending notification:`, error);
            throw error;
        }
    }
}

module.exports = new NotificationService(); 
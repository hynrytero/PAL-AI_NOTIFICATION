const moment = require('moment-timezone');
const config = require('../config/config');
const notificationService = require('./notificationService');

class DiseaseAlertService {
    async sendTungroAlert() {
        const currentMonth = moment().month() + 1;
        if (config.diseaseAlerts.tungro.riskMonths.includes(currentMonth)) {
            console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Rice Tungro Disease notification triggered`);
            try {
                await notificationService.sendNotification({
                    title: 'Weekly Rice Tungro Disease Alert',
                    body: `High risk period for Rice Tungro Disease (${moment().format('MMMM YYYY')}). 
                    Preventive measures:
                    • Monitor for yellow-orange discoloration of leaves
                    • Check for stunted growth and reduced tillering
                    • Remove infected plants and weeds
                    • Maintain proper water management
                    • Use disease-free seeds
                    • Consider planting resistant varieties`,
                    icon: 'warning',
                    icon_bg_color: 'red',
                    type: 'disease_alert',
                    scheduled_time: '09:00 AM'
                });
            } catch (error) {
                console.error(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Error sending Tungro notification:`, error);
            }
        }
    }

    async sendBlastAlert() {
        const currentMonth = moment().month() + 1;
        if (config.diseaseAlerts.blast.riskMonths.includes(currentMonth)) {
            console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Rice Blast notification triggered`);
            try {
                await notificationService.sendNotification({
                    title: 'Weekly Rice Blast Disease Alert',
                    body: `High risk period for Rice Blast (${moment().format('MMMM YYYY')}).
                    Preventive measures:
                    • Watch for diamond-shaped lesions with gray centers
                    • Monitor for neck blast symptoms
                    • Maintain proper nitrogen levels
                    • Ensure good field drainage
                    • Use disease-free seeds
                    • Apply appropriate fungicides if needed
                    • Consider planting resistant varieties`,
                    icon: 'warning',
                    icon_bg_color: 'orange',
                    type: 'disease_alert',
                    scheduled_time: '09:00 AM'
                });
            } catch (error) {
                console.error(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Error sending Blast notification:`, error);
            }
        }
    }

    async sendBlightAlert() {
        const currentMonth = moment().month() + 1;
        if (config.diseaseAlerts.blight.riskMonths.includes(currentMonth)) {
            console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Bacterial Leaf Blight notification triggered`);
            try {
                await notificationService.sendNotification({
                    title: 'Weekly Bacterial Leaf Blight Alert',
                    body: `High risk period for Bacterial Leaf Blight (${moment().format('MMMM YYYY')}).
                    Preventive measures:
                    • Look for yellow-orange leaf margins
                    • Check for water-soaked lesions
                    • Maintain proper water management
                    • Avoid excessive nitrogen application
                    • Use disease-free seeds
                    • Practice field sanitation
                    • Consider planting resistant varieties`,
                    icon: 'warning',
                    icon_bg_color: 'yellow',
                    type: 'disease_alert',
                    scheduled_time: '09:00 AM'
                });
            } catch (error) {
                console.error(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Error sending Blight notification:`, error);
            }
        }
    }
}

module.exports = new DiseaseAlertService(); 
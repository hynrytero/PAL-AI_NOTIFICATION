// app.js
const express = require('express');
const bodyParser = require('body-parser');
const schedule = require('node-schedule');
const moment = require('moment-timezone');
const config = require('./config/config');
const weatherService = require('./services/weatherService');
const diseaseAlertService = require('./services/diseaseAlertService');
const routes = require('./routes');

const app = express();
const port = config.port;

// Middleware
app.use(bodyParser.json());

// Store scheduled jobs
const scheduledJobs = new Map();

// Schedule weather checks based on configured interval
const weatherJob = schedule.scheduleJob(`0 */${config.weather.checkInterval} * * *`, async () => {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Starting scheduled weather check...`);
    const conditions = await weatherService.checkWeatherConditions();
    if (conditions) {
        await weatherService.sendWeatherAlert(conditions);
    }
});
scheduledJobs.set('weather', weatherJob);

// Schedule disease alerts
const tungroJob = schedule.scheduleJob(config.diseaseAlerts.tungro.schedule, async () => {
    await diseaseAlertService.sendTungroAlert();
});
scheduledJobs.set('tungro', tungroJob);

const blastJob = schedule.scheduleJob(config.diseaseAlerts.blast.schedule, async () => {
    await diseaseAlertService.sendBlastAlert();
});
scheduledJobs.set('blast', blastJob);

const blightJob = schedule.scheduleJob(config.diseaseAlerts.blight.schedule, async () => {
    await diseaseAlertService.sendBlightAlert();
});
scheduledJobs.set('blight', blightJob);

// Log all scheduled jobs
console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] All notifications scheduled successfully`);
console.log('Scheduled jobs:', {
    tungro: tungroJob ? tungroJob.nextInvocation() : 'Not scheduled',
    blast: blastJob ? blastJob.nextInvocation() : 'Not scheduled',
    blight: blightJob ? blightJob.nextInvocation() : 'Not scheduled',
    weather: weatherJob ? weatherJob.nextInvocation() : 'Not scheduled'
});

// Use routes
app.use('/', routes);

// Start server
app.listen(port, () => {
    console.log(`[${moment().format('YYYY-MM-DD HH:mm:ss')}] Server running on port ${port}`);
});


/*

'0 9 * * 5'
 │ │ │ │ │
 │ │ │ │ └── Day of week (0-6, where 0 is Sunday)
 │ │ │ └──── Month (1-12)
 │ │ └────── Day of month (1-31)
 │ └──────── Hour (0-23, in 24-hour format)
 └────────── Minute (0-59)

Rice Tungro Disease

Most severe: June to November (wet/monsoon season in many rice-growing regions)
Peak infection period: August to October
Year-round presence possible in areas with continuous rice cultivation

Rice Blast

Major outbreaks: May to October in tropical regions (during rainy seasons)
In temperate regions: July to September
Can occur whenever conditions are favorable (high humidity, 20-30°C temperatures)

Bacterial Leaf Blight

Peak incidence: June to September in most Asian rice-growing regions
Most severe during monsoon periods with flooding
Disease pressure highest when temperatures are 25-34°C with high humidity

*/
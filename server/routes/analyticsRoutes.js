const express = require('express');
const router = express.Router();
const { getAnalyticsStats, getAnalyticsQuery, getChartData, getKPIData, getTableData } = require('../controllers/analyticsController');

router.get('/stats', getAnalyticsStats);
router.get('/query', getAnalyticsQuery);
router.post('/chart', getChartData);
router.post('/kpi', getKPIData);
router.post('/table', getTableData);

module.exports = router;

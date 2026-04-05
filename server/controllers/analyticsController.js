const AggregationHelper = require('../utils/aggregationHelper');

const getAnalyticsStats = async (req, res) => {
  try {

    const config = {
      xAxis: req.query.xAxis || 'Product',
      yAxis: req.query.yAxis || 'Total Amount',
      aggregation: req.query.aggregation || 'sum',
      dateFilter: req.query.dateRange || 'all'
    };

    const data = await AggregationHelper.getChartData(config);

    res.json(data);

  } catch (error) {
    console.error('Error fetching analytics stats:', error);
    res.status(500).json({ message: 'Error fetching analytics stats' });
  }
};

const getAnalyticsQuery = async (req, res) => {
  try {
    const config = { ...req.query };
    if (config.columns && typeof config.columns === 'string') {
      config.columns = config.columns.split(',');
    }
    const data = await AggregationHelper.getTableData(config);
    res.json(data);
  } catch (error) {
    console.error('Error fetching analytics query:', error);
    res.status(500).json({ message: 'Error fetching analytics query' });
  }
};

const getChartData = async (req, res) => {
  try {
    const config = req.body;
    const data = await AggregationHelper.getChartData(config);
    res.json(data);
  } catch (error) {
    console.error('Error fetching chart data:', error);
    res.status(500).json({ message: 'Error fetching chart data' });
  }
};

const getKPIData = async (req, res) => {
  try {
    const config = req.body;
    const data = await AggregationHelper.getKPIData(config);
    res.json({ value: data });
  } catch (error) {
    console.error('Error fetching KPI data:', error);
    res.status(500).json({ message: 'Error fetching KPI data' });
  }
};

const getTableData = async (req, res) => {
  try {
    const config = req.body;
    const data = await AggregationHelper.getTableData(config);
    res.json(data);
  } catch (error) {
    console.error('Error fetching table data:', error);
    res.status(500).json({ message: 'Error fetching table data' });
  }
};

module.exports = {
  getAnalyticsStats,
  getAnalyticsQuery,
  getChartData,
  getKPIData,
  getTableData
};

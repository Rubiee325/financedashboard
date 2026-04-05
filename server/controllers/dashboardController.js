const Dashboard = require('../models/Dashboard');

const saveDashboardConfig = async (req, res) => {
  try {

    const userId = req.user.userId || req.user.id || req.user._id;

    let config = await Dashboard.findOne({ userId });

    if (!config) {
      config = new Dashboard({
        userId,
        widgets: req.body.widgets
      });
    } else {
      config.widgets = req.body.widgets;
    }

    await config.save();

    res.json({ success: true, data: config });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


const getDashboardConfig = async (req, res) => {
  try {

    const userId = req.user.userId || req.user.id || req.user._id;

    const config = await Dashboard.findOne({ userId });

    res.json({ success: true, data: config || { widgets: [] } });

  } catch (err) {
    console.error(err);
    console.log("REQ.USER:", req.user);
    console.log("REQ.USER IN CONTROLLER:", req.user);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getDashboardConfig,
  saveDashboardConfig
};
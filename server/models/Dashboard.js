const mongoose = require('mongoose');

const widgetSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    enum: ['KPI', 'Chart', 'Table']  // ✅ MATCH FRONTEND
  },
  title: String,

  x: Number,
  y: Number,
  w: Number,
  h: Number,

  config: {
    chartType: String,   // Bar Chart, Line Chart etc
    xAxis: String,
    yAxis: String,

    aggregation: {
      type: String,
      enum: ['Sum', 'Count', 'Average']  // ✅ MATCH FRONTEND
    },

    color: String,
    showLegend: Boolean,
    showLabel: Boolean,

    metric: String,
    dataFormat: String,
    precision: Number,

    columns: [String],

    dateFilter: {
      type: String,
      default: 'all'
    }
  }
});
const dashboardSchema = new mongoose.Schema({
  name: { type: String, default: 'Main Dashboard' },
  userId: { type: String, default: 'default-user' },
  widgets: [widgetSchema]
}, { timestamps: true });

module.exports = mongoose.model('Dashboard', dashboardSchema);

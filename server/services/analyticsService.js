const Order = require('../models/Order');
const moment = require('moment');
const AggregationHelper = require('../utils/aggregationHelper');

class AnalyticsService {
    /**
     * Widget Engine: Dynamically builds MongoDB aggregation based on widget config
     * @param {Object} queryParams - { groupBy, metric, aggregation, dateRange }
     */
    async query(params) {
        const { groupBy = 'product', metric = 'totalAmount', aggregation = 'Sum', dateRange } = params;

        const pipeline = [];

        // 1. Date Filtering
        const dateFilter = AggregationHelper.buildDateFilter(dateRange);
        if (Object.keys(dateFilter).length > 0) {
            pipeline.push({ $match: dateFilter });
        }

        // 2. Map field names
        const groupField = AggregationHelper.mapFieldName(groupBy);
        const metricField = AggregationHelper.mapFieldName(metric);

        // 3. Dynamic Aggregation
        const groupStage = AggregationHelper.buildGroupStage(groupField, metricField, aggregation);
        pipeline.push({ $group: groupStage });

        // 4. Formatting output for Recharts { name, value }
        pipeline.push(AggregationHelper.buildChartProjection());

        // 5. Sorting
        pipeline.push(AggregationHelper.buildSortStage());

        return await Order.aggregate(pipeline);
    }

    /**
     * Get widget data based on widget type and configuration
     * @param {string} type - Widget type (kpi, barChart, lineChart, pieChart, areaChart, scatterPlot, table)
     * @param {Object} config - Widget configuration
     */
    async getWidgetData(type, config) {
        const { dateRange, ...widgetConfig } = config;

        // Apply date filtering
        const dateFilter = AggregationHelper.buildDateFilter(dateRange);

        switch (type) {
            case 'kpi':
                return await this.getKPIData(widgetConfig, dateFilter);
            
            case 'barChart':
            case 'lineChart':
            case 'areaChart':
                return await this.getChartData(widgetConfig, dateFilter);
            
            case 'pieChart':
                return await this.getPieChartData(widgetConfig, dateFilter);
            
            case 'scatterPlot':
                return await this.getScatterPlotData(widgetConfig, dateFilter);
            
            case 'table':
                return await this.getTableData(widgetConfig, dateFilter);
            
            default:
                throw new Error(`Unsupported widget type: ${type}`);
        }
    }

    async getKPIData(config, dateFilter) {
        const { metric, aggregation = 'sum' } = config;
        const metricField = AggregationHelper.mapFieldName(metric);
        
        const pipeline = [
            { $match: dateFilter },
            {
                $group: {
                    _id: null,
                    value: AggregationHelper.getAggregationOperator(aggregation, metricField)
                }
            }
        ];

        const result = await Order.aggregate(pipeline);
        return result.length > 0 ? result[0].value : 0;
    }

    async getChartData(config, dateFilter) {
        const { xAxis, yAxis, aggregation = 'sum' } = config;
        const xField = AggregationHelper.mapFieldName(xAxis);
        const yField = AggregationHelper.mapFieldName(yAxis);
        
        const pipeline = [
            { $match: dateFilter },
            { $group: AggregationHelper.buildGroupStage(xField, yField, aggregation) },
            AggregationHelper.buildChartProjection(),
            AggregationHelper.buildSortStage()
        ];

        return await Order.aggregate(pipeline);
    }

    async getPieChartData(config, dateFilter) {
        const { chartData, aggregation = 'count' } = config;
        const field = AggregationHelper.mapFieldName(chartData || 'status');
        
        const pipeline = [
            { $match: dateFilter },
            { $group: AggregationHelper.buildGroupStage(field, 'totalAmount', aggregation) },
            AggregationHelper.buildChartProjection(),
            { $sort: { value: -1 } }
        ];

        return await Order.aggregate(pipeline);
    }

    async getScatterPlotData(config, dateFilter) {
        const { xAxis, yAxis } = config;
        const xField = AggregationHelper.mapFieldName(xAxis);
        const yField = AggregationHelper.mapFieldName(yAxis);
        
        const pipeline = [
            { $match: dateFilter },
            {
                $project: {
                    x: `$${xField}`,
                    y: `$${yField}`,
                    _id: 0
                }
            },
            { $sort: { x: 1 } }
        ];

        return await Order.aggregate(pipeline);
    }

    async getTableData(config, dateFilter) {
        const { columns = [], pagination = 10, sortBy = 'orderDate', sortOrder = -1 } = config;
        
        const projection = { _id: 1 };
        columns.forEach(col => {
            const fieldMap = {
                'orderId': '_id',
                'orderDate': 'orderDate'
            };
            const field = fieldMap[col] || AggregationHelper.mapFieldName(col);
            projection[field] = 1;
        });

        const pipeline = [
            { $match: dateFilter },
            { $project: projection },
            AggregationHelper.buildSortStage(sortBy, sortOrder),
            AggregationHelper.buildLimitStage(pagination)
        ];

        return await Order.aggregate(pipeline);
    }
}

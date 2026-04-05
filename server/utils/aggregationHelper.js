const Order = require('../models/Order');

class AggregationHelper {

  static getDateFilter(dateFilter) {
    const now = new Date();
    let startDate;

    switch (dateFilter) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;

      case 'last7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;

      case 'last30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;

      case 'last90days':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;

      default:
        return {}; // All time
    }

    return { createdAt: { $gte: startDate } };
  }


  static async getChartData(config) {

    const { xAxis, yAxis, aggregation, dateFilter } = config;

    const matchFilter = this.getDateFilter(dateFilter);

    let groupBy = { _id: null };
    let project = {};

    const axisMap = {
      Product: '$product',
      Status: '$status',
      'Created By': '$createdBy',
      Country: '$country'
    };

    if (axisMap[xAxis]) {
      groupBy._id = axisMap[xAxis];
      project.x = '$_id';
    }

    const yAxisMap = {
      'Total Amount': 'totalAmount',
      Quantity: 'quantity'
    };

    const yField = yAxisMap[yAxis] || yAxis;

    if (yField === 'totalAmount' || yField === 'quantity') {

      if (aggregation === 'sum') {
        groupBy.total = { $sum: `$${yField}` };
        project.y = '$total';
      }

      else if (aggregation === 'avg') {
        groupBy.total = { $avg: `$${yField}` };
        project.y = '$total';
      }

      else if (aggregation === 'count') {
        groupBy.total = { $sum: 1 };
        project.y = '$total';
      }

    }

    const pipeline = [
      { $match: matchFilter },
      { $group: groupBy },
      { $project: project }
    ];

    const result = await Order.aggregate(pipeline);

    return result.map(item => ({
      x: item.x,
      y: item.y
    }));

  }



  static async getKPIData(config) {

    const { metric, aggregation, dateFilter } = config;

    const matchFilter = this.getDateFilter(dateFilter);

    let groupOp = {};

    if (metric === 'totalAmount') {

      if (aggregation === 'sum') {
        groupOp.value = { $sum: '$totalAmount' };
      }

      else if (aggregation === 'avg') {
        groupOp.value = { $avg: '$totalAmount' };
      }

      else if (aggregation === 'count') {
        groupOp.value = { $sum: 1 };
      }

    }

    else if (metric === 'quantity') {

      if (aggregation === 'sum') {
        groupOp.value = { $sum: '$quantity' };
      }

      else if (aggregation === 'avg') {
        groupOp.value = { $avg: '$quantity' };
      }

      else if (aggregation === 'count') {
        groupOp.value = { $sum: 1 };
      }

    }

    else if (metric === 'orders') {
      groupOp.value = { $sum: 1 };
    }

    const pipeline = [
      { $match: matchFilter },
      { $group: { _id: null, value: groupOp.value } },
      { $project: { _id: 0, value: 1 } }
    ];

    const result = await Order.aggregate(pipeline);

    return result.length > 0 ? result[0].value : 0;

  }



  static async getTableData(config) {

    const { columns, dateFilter } = config;

    const matchFilter = this.getDateFilter(dateFilter);

    let projection = { _id: 0 };

    columns.forEach(col => {

      switch (col) {

        case 'Customer name':
          projection.firstName = 1;
          projection.lastName = 1;
          break;

        case 'Email':
          projection.email = 1;
          break;

        case 'Phone number':
          projection.phone = 1;
          projection.phoneNumber = 1;
          break;

        case 'Product':
          projection.product = 1;
          break;

        case 'Quantity':
          projection.quantity = 1;
          break;

        case 'Unit price':
          projection.unitPrice = 1;
          break;

        case 'Total amount':
          projection.totalAmount = 1;
          break;

        case 'Status':
          projection.status = 1;
          break;

        case 'Created by':
          projection.createdBy = 1;
          break;

      }

    });

    const pipeline = [
      { $match: matchFilter },
      { $project: projection }
    ];

    const result = await Order.aggregate(pipeline);

    return result.map(row => {

      let formattedRow = {};

      if (row.firstName && row.lastName) {
        formattedRow['Customer name'] = `${row.firstName} ${row.lastName}`;
      }

      if (row.email) {
        formattedRow['Email'] = row.email;
      }

      if (row.phoneNumber || row.phone) {
        formattedRow['Phone number'] = row.phoneNumber || row.phone;
      }

      if (row.product) {
        formattedRow['Product'] = row.product;
      }

      if (row.quantity) {
        formattedRow['Quantity'] = row.quantity;
      }

      if (row.unitPrice) {
        formattedRow['Unit price'] = row.unitPrice;
      }

      if (row.totalAmount) {
        formattedRow['Total amount'] = row.totalAmount;
      }

      if (row.status) {
        formattedRow['Status'] = row.status;
      }

      if (row.createdBy) {
        formattedRow['Created by'] = row.createdBy;
      }

      return formattedRow;

    });

  }

}

module.exports = AggregationHelper;
const Order = require('../models/Order');

exports.seedData = async (req, res) => {
  try {
    // Clear existing
    await Order.deleteMany({});
    
    const sampleOrders = [
      { firstName: 'Michael', lastName: 'Harris', email: 'michael@halleyx.com', phone: '555-0101', streetAddress: '123 Tech Blvd', city: 'Palo Alto', state: 'CA', postalCode: '94301', country: 'United States', product: 'Fiber Internet 1 Gbps', quantity: 1, unitPrice: 80, totalAmount: 80, status: 'Completed', createdBy: 'Mr. Michael Harris' },
      { firstName: 'Olivia', lastName: 'Carter', email: 'olivia@client.com', phone: '555-0102', streetAddress: '456 Innovation St', city: 'Austin', state: 'TX', postalCode: '78701', country: 'United States', product: '5GUnlimited Mobile Plan', quantity: 2, unitPrice: 50, totalAmount: 100, status: 'In progress', createdBy: 'Ms. Olivia Carter' },
      { firstName: 'Lucas', lastName: 'Martin', email: 'lucas@halleyx.com', phone: '555-0103', streetAddress: '789 Cloud Dr', city: 'Seattle', state: 'WA', postalCode: '98101', country: 'United States', product: 'VoIP Corporate Package', quantity: 1, unitPrice: 200, totalAmount: 200, status: 'Pending', createdBy: 'Mr. Lucas Martin' },
      { firstName: 'Ryan', lastName: 'Cooper', email: 'ryan@tech.com', phone: '555-0104', streetAddress: '321 Fiber Ave', city: 'Boston', state: 'MA', postalCode: '02108', country: 'United States', product: 'Business Internet 500 Mbps', quantity: 1, unitPrice: 150, totalAmount: 150, status: 'Completed', createdBy: 'Mr. Ryan Cooper' }
    ];

    await Order.insertMany(sampleOrders);

    // Initial Dashboard Config
    await Dashboard.deleteMany({});
    const initialConfig = {
      userId: 'default-user',
      widgets: [
        { id: 'w1', type: 'KPI', title: 'Total Revenue', w: 4, h: 2, x: 0, y: 0, config: { metric: 'Total amount', aggregation: 'Sum', dataFormat: 'Currency', precision: 0 } },
        { id: 'w2', type: 'Chart', title: 'Revenue by Product', w: 8, h: 4, x: 4, y: 0, config: { chartType: 'Bar Chart', xAxis: 'Product', yAxis: 'Total amount', color: '#54bd95' } },
        { id: 'w3', type: 'Table', title: 'Recent Orders', w: 12, h: 4, x: 0, y: 4, config: { columns: ['Customer name', 'Product', 'Total amount', 'Status'], pagination: 5 } }
      ]
    };
    await new Dashboard(initialConfig).save();

    res.status(200).json({ success: true, message: 'System seeded with premium sample data' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

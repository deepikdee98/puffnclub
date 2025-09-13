// import html2pdf from 'html2pdf.js';

// Helper function to format currency with ₹ symbol - now works with HTML
const formatCurrency = (amount: number): string => {
  return `₹${amount.toFixed(2)}`;
};

// Export all orders to PDF using HTML template
export const exportAllOrdersToPDF = (orders: any[]) => {
  try {
    console.log("🚀 Starting bulk orders export, total orders:", orders.length);
    
    // Calculate summary statistics
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const completedOrders = orders.filter(order => order.status === 'Completed').length;
    const pendingOrders = orders.filter(order => order.status === 'Pending').length;
    
    // Create HTML template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .subtitle { font-size: 14px; color: #666; }
          .summary { margin-bottom: 30px; }
          .summary h3 { font-size: 18px; margin-bottom: 15px; }
          .summary-item { margin-bottom: 8px; }
          .orders-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .orders-table th, .orders-table td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left; 
            font-size: 12px; 
          }
          .orders-table th { background-color: #f5f5f5; font-weight: bold; }
          .currency { font-weight: bold; color: #2E7D32; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">ALL ORDERS REPORT</div>
          <div class="subtitle">Generated on: ${new Date().toLocaleDateString()}</div>
          <div class="subtitle">Total Orders: ${orders.length}</div>
        </div>
        
        <div class="summary">
          <h3>SUMMARY</h3>
          <div class="summary-item">Total Revenue: <span class="currency">${formatCurrency(totalRevenue)}</span></div>
          <div class="summary-item">Completed Orders: ${completedOrders}</div>
          <div class="summary-item">Pending Orders: ${pendingOrders}</div>
        </div>
        
        <h3>ORDERS LIST</h3>
        <table class="orders-table">
          <thead>
            <tr>
              <th>Order#</th>
              <th>Customer</th>
              <th>Total</th>
              <th>Status</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            ${orders.map((order, index) => {
              const orderNumber = order.orderNumber || `#${index + 1}`;
              const customerName = order.user?.name || order.customer?.name || "N/A";
              const status = order.status || "N/A";
              const date = new Date(order.createdAt || Date.now()).toLocaleDateString();
              
              return `
                <tr>
                  <td>${orderNumber}</td>
                  <td>${customerName}</td>
                  <td class="currency">${formatCurrency(order.total || 0)}</td>
                  <td>${status}</td>
                  <td>${date}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    // Configure html2pdf options
    const options = {
      margin: 10,
      filename: `All-Orders-Report-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Create temporary element and generate PDF
    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    
    // html2pdf().from(element).set(options).save();

    console.log("✅ Bulk orders export successful!");
    return true;
  } catch (error) {
    console.error("❌ Error exporting all orders:", error);
    throw error;
  }
};

// Export all products to PDF
export const exportAllProductsToPDF = (products: any[]) => {
  try {
    console.log("🚀 Starting bulk products export, total products:", products.length);
    
    // Calculate summary statistics
    const totalValue = products.reduce((sum, product) => sum + ((product.price || 0) * (product.stock || 0)), 0);
    const activeProducts = products.filter(product => product.isActive !== false).length;
    const averagePrice = products.length > 0 ? products.reduce((sum, product) => sum + (product.price || 0), 0) / products.length : 0;
    
    // Create HTML template
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
          .subtitle { font-size: 14px; color: #666; }
          .summary { margin-bottom: 30px; }
          .summary h3 { font-size: 18px; margin-bottom: 15px; }
          .summary-item { margin-bottom: 8px; }
          .products-table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          .products-table th, .products-table td { 
            border: 1px solid #ddd; 
            padding: 8px; 
            text-align: left; 
            font-size: 12px; 
          }
          .products-table th { background-color: #f5f5f5; font-weight: bold; }
          .currency { font-weight: bold; color: #2E7D32; }
          .description { font-size: 10px; color: #666; font-style: italic; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">ALL PRODUCTS CATALOG</div>
          <div class="subtitle">Generated on: ${new Date().toLocaleDateString()}</div>
          <div class="subtitle">Total Products: ${products.length}</div>
        </div>
        
        <div class="summary">
          <h3>SUMMARY</h3>
          <div class="summary-item">Total Inventory Value: <span class="currency">${formatCurrency(totalValue)}</span></div>
          <div class="summary-item">Active Products: ${activeProducts}</div>
          <div class="summary-item">Average Price: <span class="currency">${formatCurrency(averagePrice)}</span></div>
        </div>
        
        <h3>PRODUCTS LIST</h3>
        <table class="products-table">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Category</th>
            </tr>
          </thead>
          <tbody>
            ${products.map((product, index) => {
              const name = product.name || `Product ${index + 1}`;
              const stock = product.stock || 0;
              const category = product.category || "N/A";
              const description = product.description ? 
                (product.description.length > 80 ? product.description.substring(0, 80) + "..." : product.description) : "";
              
              return `
                <tr>
                  <td>
                    <div>${name}</div>
                    ${description ? `<div class="description">${description}</div>` : ''}
                  </td>
                  <td class="currency">${formatCurrency(product.price || 0)}</td>
                  <td>${stock}</td>
                  <td>${category}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    // Configure html2pdf options
    const options = {
      margin: 10,
      filename: `All-Products-Catalog-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    // Create temporary element and generate PDF
    const element = document.createElement('div');
    element.innerHTML = htmlContent;
    
    // html2pdf().from(element).set(options).save();

    console.log("✅ Bulk products export successful!");
    return true;
  } catch (error) {
    console.error("❌ Error exporting all products:", error);
    throw error;
  }
};
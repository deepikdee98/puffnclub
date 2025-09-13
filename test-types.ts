import { dataService, sampleData } from './src/lib/dataService';
import { DashboardMetrics, RecentOrder, TopProduct } from './src/types/dashboard';

// Test the types
async function testTypes() {
  // This should work without TypeScript errors
  const metrics: DashboardMetrics = sampleData.metrics;
  const orders: RecentOrder[] = sampleData.recentOrders;
  const products: TopProduct[] = sampleData.topProducts;

  // These should also work
  const metricsFromAPI = await dataService.getDashboardMetrics();
  const ordersFromAPI = await dataService.getRecentOrders(5);
  const productsFromAPI = await dataService.getTopProducts(4);

  console.log('Types are working correctly');
}

testTypes();
'use client';

import { Card, Badge } from 'react-bootstrap';
import { 
  FiShoppingCart, 
  FiUser, 
  FiPackage, 
  FiDollarSign,
  FiTruck,
  FiAlertCircle
} from 'react-icons/fi';
import { formatRelativeTime } from '@/utils/helpers';
import styles from './RecentActivity.module.scss';

interface ActivityItem {
  id: string;
  type: 'order' | 'user' | 'product' | 'payment' | 'shipping' | 'alert';
  title: string;
  description: string;
  timestamp: string;
  status?: 'success' | 'warning' | 'danger' | 'info';
}

const mockActivities: ActivityItem[] = [
  {
    id: '1',
    type: 'order',
    title: 'New Order Received',
    description: 'Order #12345 from John Doe - $299.99',
    timestamp: '2024-01-15T10:30:00Z',
    status: 'success'
  },
  {
    id: '2',
    type: 'alert',
    title: 'Low Stock Alert',
    description: 'iPhone 15 Pro has only 5 units left',
    timestamp: '2024-01-15T09:45:00Z',
    status: 'warning'
  },
  {
    id: '3',
    type: 'payment',
    title: 'Payment Received',
    description: '$149.50 payment confirmed for Order #12346',
    timestamp: '2024-01-15T09:15:00Z',
    status: 'success'
  },
  {
    id: '4',
    type: 'user',
    title: 'New Customer Registration',
    description: 'Alice Brown joined as a new customer',
    timestamp: '2024-01-15T08:30:00Z',
    status: 'info'
  },
  {
    id: '5',
    type: 'shipping',
    title: 'Order Shipped',
    description: 'Order #12344 has been shipped via FedEx',
    timestamp: '2024-01-15T07:45:00Z',
    status: 'info'
  },
  {
    id: '6',
    type: 'product',
    title: 'Product Updated',
    description: 'MacBook Air M2 price updated to $1,199',
    timestamp: '2024-01-14T16:20:00Z',
    status: 'info'
  }
];

export default function RecentActivity() {
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order': return <FiShoppingCart size={16} />;
      case 'user': return <FiUser size={16} />;
      case 'product': return <FiPackage size={16} />;
      case 'payment': return <FiDollarSign size={16} />;
      case 'shipping': return <FiTruck size={16} />;
      case 'alert': return <FiAlertCircle size={16} />;
      default: return <FiShoppingCart size={16} />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'order': return '#007bff';
      case 'user': return '#28a745';
      case 'product': return '#6f42c1';
      case 'payment': return '#20c997';
      case 'shipping': return '#fd7e14';
      case 'alert': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusVariant = (status?: string) => {
    switch (status) {
      case 'success': return 'success';
      case 'warning': return 'warning';
      case 'danger': return 'danger';
      case 'info': return 'info';
      default: return 'secondary';
    }
  };

  return (
    <Card className={styles.activityCard}>
      <Card.Header className={styles.activityHeader}>
        <h5 className={styles.activityTitle}>Recent Activity</h5>
        <Badge bg="primary" className={styles.activityCount}>
          {mockActivities.length}
        </Badge>
      </Card.Header>
      
      <Card.Body className={styles.activityBody}>
        <div className={styles.activityList}>
          {mockActivities.map((activity) => (
            <div key={activity.id} className={styles.activityItem}>
              <div className={styles.activityIconWrapper}>
                <div 
                  className={styles.activityIcon}
                  style={{ 
                    backgroundColor: `${getActivityColor(activity.type)}20`,
                    color: getActivityColor(activity.type)
                  }}
                >
                  {getActivityIcon(activity.type)}
                </div>
              </div>
              
              <div className={styles.activityContent}>
                <div className={styles.activityHeader}>
                  <h6 className={styles.activityItemTitle}>
                    {activity.title}
                  </h6>
                  {activity.status && (
                    <Badge 
                      bg={getStatusVariant(activity.status)} 
                      className={styles.activityStatus}
                    >
                      {activity.status}
                    </Badge>
                  )}
                </div>
                
                <p className={styles.activityDescription}>
                  {activity.description}
                </p>
                
                <div className={styles.activityTime}>
                  {formatRelativeTime(activity.timestamp)}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className={styles.activityFooter}>
          <button className={styles.viewAllButton}>
            View All Activities
          </button>
        </div>
      </Card.Body>
    </Card>
  );
}
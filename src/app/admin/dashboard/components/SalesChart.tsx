'use client';

import { useState } from 'react';
import { Card, Button, ButtonGroup } from 'react-bootstrap';
import { FiTrendingUp, FiCalendar } from 'react-icons/fi';
import styles from './SalesChart.module.scss';

// Mock chart data
const mockChartData = {
  '7d': {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    data: [1200, 1900, 3000, 5000, 2000, 3000, 4500],
    total: 20600
  },
  '30d': {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    data: [15000, 22000, 18000, 25000],
    total: 80000
  },
  '90d': {
    labels: ['Month 1', 'Month 2', 'Month 3'],
    data: [75000, 85000, 95000],
    total: 255000
  }
};

export default function SalesChart() {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d');
  const currentData = mockChartData[period];

  const maxValue = Math.max(...currentData.data);

  return (
    <Card className={styles.chartCard}>
      <Card.Header className={styles.chartHeader}>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <h5 className={styles.chartTitle}>
              <FiTrendingUp className="me-2" />
              Sales Overview
            </h5>
            <p className={styles.chartSubtitle}>
              Total sales: ${currentData.total.toLocaleString()}
            </p>
          </div>
          <ButtonGroup size="sm" className={styles.periodSelector}>
            <Button
              variant={period === '7d' ? 'primary' : 'outline-primary'}
              onClick={() => setPeriod('7d')}
            >
              7 Days
            </Button>
            <Button
              variant={period === '30d' ? 'primary' : 'outline-primary'}
              onClick={() => setPeriod('30d')}
            >
              30 Days
            </Button>
            <Button
              variant={period === '90d' ? 'primary' : 'outline-primary'}
              onClick={() => setPeriod('90d')}
            >
              90 Days
            </Button>
          </ButtonGroup>
        </div>
      </Card.Header>
      
      <Card.Body>
        <div className={styles.chartContainer}>
          <div className={styles.chart}>
            {currentData.data.map((value, index) => (
              <div key={index} className={styles.chartBar}>
                <div 
                  className={styles.bar}
                  style={{ 
                    height: `${(value / maxValue) * 100}%`,
                    background: `linear-gradient(to top, #007bff, #0056b3)`
                  }}
                >
                  <div className={styles.barValue}>
                    ${(value / 1000).toFixed(1)}k
                  </div>
                </div>
                <div className={styles.barLabel}>
                  {currentData.labels[index]}
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className={styles.chartStats}>
          <div className={styles.statItem}>
            <div className={styles.statValue}>
              ${(currentData.total / currentData.data.length / 1000).toFixed(1)}k
            </div>
            <div className={styles.statLabel}>Average</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>
              ${(Math.max(...currentData.data) / 1000).toFixed(1)}k
            </div>
            <div className={styles.statLabel}>Peak</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statValue}>
              +12.5%
            </div>
            <div className={styles.statLabel}>Growth</div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
}
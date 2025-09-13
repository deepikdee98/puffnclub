"use client";

import { Card } from "react-bootstrap";
import { FiTrendingUp, FiTrendingDown } from "react-icons/fi";
import styles from "./MetricsCard.module.scss";

interface MetricsCardProps {
  title: string;
  value: string;
  subtitle?: string;
  growth?: number;
  trend?: any;
  icon: React.ReactNode;
  iconColor: string;
  iconBg: string;
}

export default function MetricsCard({
  title,
  value,
  subtitle,
  growth,
  trend,
  icon,
  iconColor,
  iconBg,
}: MetricsCardProps) {
  const getTrendIcon = () => {
    if (trend === "up") return <FiTrendingUp size={16} />;
    if (trend === "down") return <FiTrendingDown size={16} />;
    return null;
  };

  const getTrendColor = () => {
    if (trend === "up") return "#4caf50";
    if (trend === "down") return "#f44336";
    return "#6c757d";
  };

  return (
    <Card className={styles.metricsCard}>
      <Card.Body>
        <div className={styles.cardHeader}>
          <div
            className={styles.iconWrapper}
            style={{ backgroundColor: iconBg }}
          >
            <div style={{ color: iconColor }}>{icon}</div>
          </div>
          {growth !== undefined && (
            <div className={styles.growthIndicator}>
              <div style={{ color: getTrendColor() }}>{getTrendIcon()}</div>
              <span
                className={styles.growthText}
                style={{ color: getTrendColor() }}
              >
                {growth > 0 ? "+" : ""}
                {growth}%
              </span>
            </div>
          )}
        </div>

        <div className={styles.cardContent}>
          <h3 className={styles.value}>{value}</h3>
          <p className={styles.title}>{title}</p>
          {subtitle && (
            <div className={styles.subtitle}>
              <span>{subtitle}</span>
            </div>
          )}
        </div>
      </Card.Body>
    </Card>
  );
}

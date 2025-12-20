'use client';

import React from 'react';
import { IoMdCheckmark } from 'react-icons/io';
import type { TrackingStage } from '../types/orders.types';

interface TrackingTimelineProps {
  stages: TrackingStage[];
  currentStage?: number;
}

const TrackingTimeline: React.FC<TrackingTimelineProps> = ({ stages, currentStage }) => {
  return (
    <div className="tracking-timeline">
      {stages.map((stage, index) => {
        const isCompleted = stage.status === 'completed';
        const isActive = stage.status === 'active';
        const isLast = index === stages.length - 1;

        return (
          <div key={index} className="position-relative">
            <div className="d-flex align-items-start gap-3 pb-3">
              {/* Icon */}
              <div
                className="d-flex flex-column align-items-center"
                style={{ minWidth: '24px' }}
              >
                {isCompleted ? (
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '24px',
                      height: '24px',
                      backgroundColor: '#28a745'
                    }}
                  >
                    <IoMdCheckmark size={18} className="text-white" />
                  </div>
                ) : (
                  <div
                    className="rounded-circle border-2 border-secondary d-flex align-items-center justify-content-center"
                    style={{
                      width: '24px',
                      height: '24px',
                      borderStyle: 'solid',
                      backgroundColor: 'white',
                    }}
                  />
                )}

                {/* Connecting Line */}
                {!isLast && (
                  <div
                    style={{
                      width: '2px',
                      height: '100%',
                      minHeight: '50px',
                      marginTop: '4px',
                      backgroundColor: isCompleted ? '#28a745' : '#e0e0e0',
                    }}
                  />
                )}
              </div>

              {/* Content */}
              <div className="flex-grow-1">
                <h6 className={`mb-1 ${isCompleted || isActive ? 'fw-bold' : 'fw-normal'}`} style={{ fontSize: '1rem' }}>
                  {stage.label}
                </h6>
                <p className="text-muted mb-0" style={{ fontSize: '0.875rem' }}>
                  {stage.message || stage.timestamp || 'Pending...'}
                </p>
                {stage.timestamp && stage.message && (
                  <p className="text-muted mb-0" style={{ fontSize: '0.75rem' }}>
                    {stage.timestamp}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TrackingTimeline;

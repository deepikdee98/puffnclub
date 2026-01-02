"use client";

import { Modal, Tab, Tabs } from "react-bootstrap";
import Image from "next/image";
import styles from "./SizeChartModal.module.scss";
import classNames from "classnames";

interface SizeChartData {
  size: string;
  length: number;
  chest: number;
  sleeve: number;
}

interface SizeChartModalProps {
  show: boolean;
  onHide: () => void;
}

// Static data - will be replaced with API data later
const sizeChartDataInches: SizeChartData[] = [
  { size: "S", length: 62.5, chest: 104, sleeve: 24 },
  { size: "M", length: 68.5, chest: 109, sleeve: 25.5 },
  { size: "L", length: 71, chest: 114, sleeve: 26 },
  { size: "XL", length: 73.5, chest: 119, sleeve: 27 },
];

const sizeChartDataCm: SizeChartData[] = [
  { size: "S", length: 158.8, chest: 264.2, sleeve: 61.0 },
  { size: "M", length: 174.0, chest: 276.9, sleeve: 64.8 },
  { size: "L", length: 180.3, chest: 289.6, sleeve: 66.0 },
  { size: "XL", length: 186.7, chest: 302.3, sleeve: 68.6 },
];

export default function SizeChartModal({ show, onHide }: SizeChartModalProps) {
  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header
        closeButton
        className={classNames("border-0", styles.modalHeader)}
      >
        <Modal.Title className={classNames("", styles.modalTitle)}>
          Size Chart
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className={styles.modalBody}>
        <div className="row">
          {/* Left side - T-shirt illustration */}
          <div className="col-md-12 col-lg-5 d-flex align-items-center justify-content-center mb-4 mb-md-0">
            <div className={styles.illustrationContainer}>
              <Image
                src="/images/Size Chart.png"
                alt="Size measurement guide"
                width={300}
                height={300}
                className={styles.illustration}
              />
            </div>
          </div>

          {/* Right side - Measurement table with tabs */}
          <div className="col-md-12 col-lg-7 pt-3 pt-lg-0">
            <Tabs
              defaultActiveKey="inches"
              id="size-chart-tabs"
              className={`mb-3 border-0 ${styles.sizeTabs}`}
            >
              <Tab eventKey="inches" title="Inches">
                <div className={styles.tableContainer}>
                  <table className={`table ${styles.sizeTable}`}>
                    <thead>
                      <tr>
                        <th>Size</th>
                        <th>Length</th>
                        <th>Chest</th>
                        <th>Sleeve</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizeChartDataInches.map((row) => (
                        <tr key={row.size}>
                          <td className={styles.sizeCell}>{row.size}</td>
                          <td>{row.length}</td>
                          <td>{row.chest}</td>
                          <td>{row.sleeve}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Tab>

              <Tab eventKey="cm" title="Cm">
                <div className={styles.tableContainer}>
                  <table className={`table ${styles.sizeTable}`}>
                    <thead>
                      <tr>
                        <th>Size</th>
                        <th>Length</th>
                        <th>Chest</th>
                        <th>Sleeve</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sizeChartDataCm.map((row) => (
                        <tr key={row.size}>
                          <td className={styles.sizeCell}>{row.size}</td>
                          <td>{row.length}</td>
                          <td>{row.chest}</td>
                          <td>{row.sleeve}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Tab>
            </Tabs>
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
}

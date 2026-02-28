export type SpatialData = {
  assetId: string;
  timestamp: number;
  coordinates: {
    x: number; // percentage
    y: number; // percentage
    z: number; // meters
  };
  confidence: number; // percentage
  anomaly: boolean;
  latency: number; // ms
};

export type PerformanceMetrics = {
  latency: number; // ms
  precision: number; // meters
  reliability: number; // percentage
};

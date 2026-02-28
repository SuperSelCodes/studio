import type { SpatialData, PerformanceMetrics } from '@/lib/types';

// In-memory store for our assets' last known state
const assets = new Map<string, { lastX: number; lastY: number; lastZ: number }>();
const MAP_WIDTH = 100;
const MAP_HEIGHT = 100;

function initializeAssets() {
  if (assets.size === 0) {
    for (let i = 1; i <= 5; i++) {
      assets.set(`asset-00${i}`, {
        lastX: Math.random() * MAP_WIDTH,
        lastY: Math.random() * MAP_HEIGHT,
        lastZ: Math.random() * 5,
      });
    }
  }
}

// Simulate the processing pipeline
export function processDataStream(): { newSpatialData: SpatialData[]; newMetrics: PerformanceMetrics } {
  initializeAssets();

  const newSpatialData: SpatialData[] = [];
  let totalLatency = 0;

  assets.forEach((state, assetId) => {
    const movementStrength = Math.random();
    let newX = state.lastX;
    let newY = state.lastY;
    let newZ = state.lastZ;

    // Simulate movement
    if (movementStrength > 0.7) { // 30% chance of moving
      newX += (Math.random() - 0.5) * 5; // move up to 2.5 units
      newY += (Math.random() - 0.5) * 5;
      newZ += (Math.random() - 0.5) * 1;
    }

    // Add jitter/noise to simulate raw signal fluctuation
    const jitterX = newX + (Math.random() - 0.5) * 0.8;
    const jitterY = newY + (Math.random() - 0.5) * 0.8;
    
    // Clamp values to stay within map boundaries
    const smoothedX = Math.max(0, Math.min(MAP_WIDTH, jitterX));
    const smoothedY = Math.max(0, Math.min(MAP_HEIGHT, jitterY));
    const smoothedZ = Math.max(0, Math.min(5, newZ));

    // Update asset state
    assets.set(assetId, { lastX: smoothedX, lastY: smoothedY, lastZ: smoothedZ });

    const confidence = Math.max(50, Math.min(99, 100 - (Math.random() * 15)));
    const anomaly = confidence < 70 || movementStrength > 0.98; // high movement or low confidence
    const latency = Math.floor(Math.random() * (190 - 40 + 1)) + 40; // Simulate latency between 40ms and 190ms
    
    totalLatency += latency;

    newSpatialData.push({
      assetId,
      timestamp: Date.now(),
      coordinates: {
        x: smoothedX,
        y: smoothedY,
        z: smoothedZ,
      },
      confidence: parseFloat(confidence.toFixed(1)),
      anomaly,
      latency,
    });
  });

  const newMetrics: PerformanceMetrics = {
    latency: Math.round(totalLatency / assets.size),
    precision: parseFloat((Math.random() * (0.5 - 0.1) + 0.1).toFixed(2)), // Simulate precision between 0.1m and 0.5m
    reliability: parseFloat((100 - Math.random() * 0.5).toFixed(2)), // Simulate 99.5-100% reliability
  };

  return { newSpatialData, newMetrics };
}

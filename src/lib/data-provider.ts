'use client';
import { processDataStream } from '@/lib/engine';
import type { SpatialData, PerformanceMetrics } from '@/lib/types';

export interface DataStreamSource {
  (): {
    newSpatialData: SpatialData[];
    newMetrics: PerformanceMetrics;
  };
}

// Currently, our data source is the simulation engine.
// This could be replaced with a WebSocket client or API fetcher in the future.
export const dataSource: DataStreamSource = processDataStream;

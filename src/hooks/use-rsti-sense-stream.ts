'use client';

import { useState, useEffect, useCallback } from 'react';
import type { PerformanceMetrics, SpatialData } from '@/lib/types';
import { dataSource } from '@/lib/data-provider';
import { useToast } from '@/hooks/use-toast';

const MAX_LOG_LENGTH = 50;
const UPDATE_INTERVAL = 1000; // 1 second

export function useRstiSenseStream() {
  const [assets, setAssets] = useState<SpatialData[]>([]);
  const [metrics, setMetrics] = useState<PerformanceMetrics>({ latency: 0, precision: 0, reliability: 100 });
  const [eventLog, setEventLog] = useState<SpatialData[]>([]);
  const { toast } = useToast();
  
  const handleAnomaly = useCallback((anomaly: SpatialData) => {
    toast({
      variant: 'destructive',
      title: 'Anomaly Detected!',
      description: `Asset ${anomaly.assetId} has low confidence (${anomaly.confidence}%)`,
    });
  }, [toast]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const { newSpatialData, newMetrics } = dataSource();
      
      setAssets(newSpatialData);
      setMetrics(newMetrics);
      
      setEventLog(prevLog => {
        const newEvents = newSpatialData.filter(d => d.anomaly || Math.random() < 0.1); // Log all anomalies and 10% of regular updates
        return [...newEvents.reverse(), ...prevLog].slice(0, MAX_LOG_LENGTH);
      });

      const anomaly = newSpatialData.find(d => d.anomaly);
      if (anomaly) {
        handleAnomaly(anomaly);
      }
    }, UPDATE_INTERVAL);

    return () => clearInterval(intervalId);
  }, [handleAnomaly]);

  return { assets, metrics, eventLog };
}

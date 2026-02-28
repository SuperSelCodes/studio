'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import type { PerformanceMetrics, SpatialData } from '@/lib/types';
import { processDataStream } from '@/lib/engine';
import { DashboardHeader } from '@/components/dashboard/header';
import { PerformanceMetricsDisplay } from '@/components/dashboard/performance-metrics';
import { AssetMap } from '@/components/dashboard/asset-map';
import { EventLog } from '@/components/dashboard/event-log';
import { AiConfigurator } from '@/components/dashboard/ai-configurator';
import { useToast } from '@/hooks/use-toast';

const MAX_LOG_LENGTH = 50;
const UPDATE_INTERVAL = 1000; // 1 second

export default function DashboardPage() {
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
      const { newSpatialData, newMetrics } = processDataStream();
      
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

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-8">
      <DashboardHeader />
      <div className="mt-6 flex-grow grid grid-cols-1 gap-6 lg:grid-cols-3 xl:grid-cols-4">
        {/* Main Content: Asset Map */}
        <div className="lg:col-span-2 xl:col-span-3">
          <AssetMap assets={assets} />
        </div>

        {/* Sidebar Content */}
        <div className="lg:col-span-1 xl:col-span-1 flex flex-col gap-6">
          <PerformanceMetricsDisplay metrics={metrics} />
          <AiConfigurator />
          <EventLog events={eventLog} />
        </div>
      </div>
    </main>
  );
}

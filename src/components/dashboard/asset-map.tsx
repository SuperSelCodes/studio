import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SpatialData } from '@/lib/types';
import { cn } from '@/lib/utils';
import { MapPin } from 'lucide-react';

interface AssetMapProps {
  assets: SpatialData[];
}

export function AssetMap({ assets }: AssetMapProps) {
  return (
    <Card className="h-[500px] lg:h-full flex flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Real-time Asset Map
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-grow p-2 sm:p-6">
        <div className="relative h-full w-full rounded-md border-2 border-dashed bg-background/50">
          {assets.map((asset) => (
            <AssetMarker key={asset.assetId} asset={asset} />
          ))}
          <div className="absolute bottom-2 left-2 text-xs text-muted-foreground">0,0</div>
          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">100,0</div>
          <div className="absolute top-2 left-2 text-xs text-muted-foreground">0,100</div>
          <div className="absolute top-2 right-2 text-xs text-muted-foreground">100,100</div>
        </div>
      </CardContent>
    </Card>
  );
}

function AssetMarker({ asset }: { asset: SpatialData }) {
  return (
    <div
      className="group absolute -translate-x-1/2 -translate-y-1/2 transform transition-all duration-700 ease-linear"
      style={{
        left: `${asset.coordinates.x}%`,
        top: `${100 - asset.coordinates.y}%`, // Y is inverted for screen coordinates
      }}
    >
      <div
        className={cn(
          "relative flex h-5 w-5 items-center justify-center rounded-full border-2",
          asset.anomaly ? 'bg-destructive/50 border-destructive' : 'bg-primary/50 border-primary'
        )}
      >
        <div className={cn("h-1.5 w-1.5 rounded-full bg-primary-foreground")} />
        {asset.anomaly && (
          <div className="absolute h-full w-full rounded-full border-2 border-destructive bg-destructive/50 animate-ping"></div>
        )}
      </div>
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-max rounded-md bg-popover px-2 py-1 text-xs text-popover-foreground opacity-0 shadow-lg transition-opacity group-hover:opacity-100 z-10">
        <p className="font-bold">{asset.assetId}</p>
        <p>Conf: {asset.confidence}%</p>
        <p>Pos: {asset.coordinates.x.toFixed(1)}, {asset.coordinates.y.toFixed(1)}, {asset.coordinates.z.toFixed(1)}</p>
        {asset.anomaly && <p className="font-bold text-destructive">Anomaly Detected</p>}
      </div>
    </div>
  );
}

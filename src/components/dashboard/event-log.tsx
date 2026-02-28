import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import type { SpatialData } from '@/lib/types';
import { ListCollapse } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

interface EventLogProps {
  events: SpatialData[];
}

export function EventLog({ events }: EventLogProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ListCollapse className="h-5 w-5" />
          Event Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[240px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[90px]">Time</TableHead>
                <TableHead>Asset</TableHead>
                <TableHead className="text-right">Event</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length > 0 ? (
                events.map((event) => (
                  <TableRow key={event.timestamp + event.assetId} className="text-xs">
                    <TableCell className="font-mono">{format(event.timestamp, 'HH:mm:ss.SSS')}</TableCell>
                    <TableCell className="font-medium">{event.assetId}</TableCell>
                    <TableCell className="text-right">
                      {event.anomaly ? (
                        <Badge variant="destructive">ANOMALY</Badge>
                      ) : (
                        <span className="text-muted-foreground">Update</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="h-24 text-center text-muted-foreground">
                    No events to display.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

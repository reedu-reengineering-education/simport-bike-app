'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import useSenseBox from '@/lib/useSenseBox'
import { Button } from '../ui/button'

export default function PreviewModal() {
  const { isConnected, connect, values, disconnect, resetValues } =
    useSenseBox()

  return (
    <Dialog>
      <DialogTrigger>
        <Button>Show Data</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Data Preview</DialogTitle>
          <DialogDescription>
            Last Measurement:{' '}
            {values
              .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
              .at(-1)
              ?.timestamp.toLocaleTimeString() || '-'}
          </DialogDescription>
        </DialogHeader>
        <div className="max-h-80 overflow-auto">
          <Table>
            <TableCaption>Data</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Temperature</TableHead>
                <TableHead>Humidity</TableHead>
                <TableHead>PM1</TableHead>
                <TableHead>PM2.5</TableHead>
                <TableHead>PM4</TableHead>
                <TableHead>PM10</TableHead>
                <TableHead>Acceleration X</TableHead>
                <TableHead>Acceleration Y</TableHead>
                <TableHead>Acceleration Z</TableHead>
                <TableHead>GPS Lat</TableHead>
                <TableHead>GPS Lng</TableHead>
                <TableHead>GPS Spd</TableHead>
                <TableHead>Distance L</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {values
                .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
                .map((value, idx) => (
                  <TableRow key={idx}>
                    <TableCell>{value.temperature?.toFixed(2)}</TableCell>
                    <TableCell>{value.humidity?.toFixed(2)}</TableCell>
                    <TableCell>{value.pm1?.toFixed(2)}</TableCell>
                    <TableCell>{value.pm2_5?.toFixed(2)}</TableCell>
                    <TableCell>{value.pm4?.toFixed(2)}</TableCell>
                    <TableCell>{value.pm10?.toFixed(2)}</TableCell>
                    <TableCell>{value.acceleration_x?.toFixed(2)}</TableCell>
                    <TableCell>{value.acceleration_y?.toFixed(2)}</TableCell>
                    <TableCell>{value.acceleration_z?.toFixed(2)}</TableCell>
                    <TableCell>{value.gps_lat?.toFixed(2)}</TableCell>
                    <TableCell>{value.gps_lng?.toFixed(2)}</TableCell>
                    <TableCell>{value.gps_spd?.toFixed(2)}</TableCell>
                    <TableCell>{value.distance_l?.toFixed(2)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </div>
        <DialogFooter>
          {isConnected ? (
            <Button variant="default" onClick={() => disconnect()}>
              Disconnect
            </Button>
          ) : (
            <Button variant="default" onClick={() => connect()}>
              Connect
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

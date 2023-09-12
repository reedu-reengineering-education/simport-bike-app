import {
  BeakerIcon,
  ChartBarIcon,
  CloudIcon,
  SignalIcon,
  SunIcon,
  TruckIcon,
} from "@heroicons/react/24/outline";

export default function MeasurementsOverview({ data }: { data: any }) {
  return (
    <div className="flex flex-col gap-1 ">
      <span className="flex">
        <SunIcon className="h-6 w-6" /> {data.temperature}°C
      </span>
      <span className="flex">
        <BeakerIcon className="h-6 w-6" /> {data.humidity}%
      </span>
      <span className="flex">
        <CloudIcon className="h-6 w-6" /> {data.pm1} / {data.pm25} / {data.pm4}{" "}
        / {data.pm10} µg/m³
        {data.pm10} µg/m³
      </span>
      <span className="flex">
        <ChartBarIcon className="h-6 w-6" /> {data.accelerationX} /{" "}
        {data.accelerationY} / {data.accelerationZ} m/s²
      </span>
      <span className="flex">
        {" "}
        <TruckIcon className="h-6 w-6" />
        {data.speed} km/h
      </span>
      <span className="flex">
        <SignalIcon className="h-6 w-6" /> {data.speed}
      </span>
    </div>
  );
}

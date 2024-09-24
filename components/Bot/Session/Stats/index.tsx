import React, { useEffect, useRef, useState } from "react";
import {
  Sparklines,
  SparklinesBars,
  SparklinesLine,
  SparklinesReferenceLine,
} from "react-sparklines";
import { Loader2, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import HelpTip from "@/components/ui/helptip";

interface StatsProps {
  statsAggregator: StatsAggregator;
  handleClose: () => void;
}

const StatsTile = ({
  service,
  metric,
  tip,
  sub = "s",
  multiplier = 3,
  data,
}: {
  service: string;
  sub?: string;
  metric: string;
  tip?: string;
  multiplier?: number;
  data: MetricValue;
}) => {
  return (
    <div className="p-3 border border-primary-200 rounded-md bg-white text-sm">
      <header>
        <div className="font-semibold text-base mb-3 flex flex-row gap-1 items-center">
          {service.charAt(0).toUpperCase() + service.slice(1)} {metric}
          {tip && <HelpTip text={tip} />}
        </div>
        <div className="bg-primary-50 rounded-md text-xs uppercase tracking-wide flex flex-row wrap items-center justify-center gap-2 p-2">
          <span>Latest</span>
          <span className="font-medium">
            {data.latest?.toFixed(multiplier)}
            <sub>{sub}</sub>
          </span>
        </div>
      </header>
      <div className="w-auto line-height-1 m-0 p-3">
        <Sparklines
          data={data.timeseries}
          limit={20}
          height={80}
          svgHeight={80}
        >
          <SparklinesBars style={{ fill: "#41c3f9", fillOpacity: ".25" }} />
          <SparklinesLine style={{ stroke: "#41c3f9", fill: "none" }} />
          <SparklinesReferenceLine type="mean" />
        </Sparklines>
      </div>
      <footer className="border-t border-primary-200 flex flex-row nowrap text-xs font-mono justify-between p-2">
        <div className="line-height-1 font-bold uppercase inline-flex flex-row gap-1">
          H:
          <span className="font-normal">
            {data.high?.toFixed(multiplier)}
            <sub>{sub}</sub>
          </span>
        </div>
        <div className="line-height-1 font-bold uppercase inline-flex flex-row gap-1">
          M:
          <span className="font-normal">
            {data.median?.toFixed(multiplier)}
            <sub>{sub}</sub>
          </span>
        </div>
        <div className="line-height-1 font-bold uppercase inline-flex flex-row gap-1">
          L:
          <span className="font-normal">
            {data.low?.toFixed(multiplier)}
            <sub>{sub}</sub>
          </span>
        </div>
      </footer>
    </div>
  );
};

export const Stats = React.memo(
  ({ statsAggregator, handleClose }: StatsProps) => {
    const [currentStats, setCurrentStats] = useState<StatsMap>(
      statsAggregator.statsMap
    );
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current!);
      }

      intervalRef.current = setInterval(async () => {
        // Get latest stats from aggregator
        const newStats = statsAggregator.getStats();
        if (newStats) {
          setCurrentStats({ ...newStats });
        }
      }, 2500);

      return () => clearInterval(intervalRef.current!);
    }, [statsAggregator]);

    //const numTurns = statsAggregator.turns;

    return (
      <div className="absolute w-[var(--layout-aside-width)] z-[9999] left-0 right-0 bottom-0 bg-white border-t border-primary-200 animate-appear text-left shadow-[theme(boxShadow.stats)] md:shadow-none md:z-1 md:h-full md:relative md:bg-transparent md:border-t-0 md:border-l border-primary-200">
        <div className="text-center md:text-right">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="m-3"
          >
            <X />
          </Button>
        </div>
        <div className="user-select-none p-4 pt-0 overflow-x-scroll flex flex-row nowrap gap-8 md:gap-8 md:h-full md:overflow-x-visible md:overflow-y-scroll md:flex-col md:wrap md:pb-[100px]">
          <section className="flex flex-row gap-6 md:flex-col md:wrap md:gap-6">
            {Object.entries(currentStats).length < 1 ? (
              <div>
                <Loader2 className="animate-spin mx-auto" />
              </div>
            ) : (
              Object.entries(currentStats).map(([service, data], index) => {
                return (
                  <div key={service} className="flex flex-row nowrap gap-2 md:flex-col md:wrap md:gap-6">
                    <StatsTile
                      key={`${service}-ttfb-${index}`}
                      metric="TTFB"
                      tip="Time to first byte"
                      service={service}
                      multiplier={3}
                      data={data.ttfb}
                    />
                    {currentStats[service].characters && (
                      <StatsTile
                        key={`${service}-chars-${index}`}
                        metric="Characters"
                        sub=""
                        service={service}
                        multiplier={0}
                        data={data.characters}
                      />
                    )}
                    {currentStats[service].processing && (
                      <StatsTile
                        key={`${service}-proc-${index}`}
                        metric="Processing"
                        service={service}
                        data={data.processing}
                      />
                    )}
                  </div>
                );
              })
            )}
          </section>
        </div>
      </div>
    );
  },
  () => true
);

Stats.displayName = "Stats";

export default Stats;

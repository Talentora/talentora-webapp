'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const timeRanges = [
  { label: "Day", value: "1 day" },
  { label: "Week", value: "1 week" },
  { label: "Month", value: "1 month" },
  { label: "Year", value: "1 year" }
];

const intervals = [
  { label: "1 Day", value: "1 day" },
  { label: "1 Week", value: "1 week" },
  { label: "1 Month", value: "1 month" }
];

const TimeRangeSelector = () => {
  const [timeRange, setTimeRange] = useState('1 week'); // Set default value to "1 week"
  const [interval, setInterval] = useState('1 week');

  return (
    <Card className="p-5 -mt-2 -ml-5 w-screen border-none">
      <CardHeader>
        <div className="flex justify-between items-center">
          {/* Time Range Selector Container */}
          <div className="bg-background text-gray-500 p-1 rounded-lg border border-input flex gap-2">
            <div className="flex gap-2 ">
              {timeRanges.map(({ label, value }) => (
                <Button
                  key={value}
                  variant="ghost"
                  className={timeRange === value ? "bg-[#5650F0] text-background" : ""}
                  onClick={() => setTimeRange(value)}
                >
                  {label}
                </Button>
              ))}
            </div>
          </div>

          {/* Interval Selector Container */}
          <div className="flex items-center gap-2 ">
            <span className="text-sm text-gray-600">Interval:</span>
            <Select value={interval} onValueChange={setInterval}>
              <SelectTrigger className="w-[120px]">
                <SelectValue placeholder="Select interval" />
              </SelectTrigger>
              <SelectContent>
                {intervals.map(({ label, value }) => (
                  <SelectItem key={value} value={value}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent />
    </Card>
  );
};

export default TimeRangeSelector;

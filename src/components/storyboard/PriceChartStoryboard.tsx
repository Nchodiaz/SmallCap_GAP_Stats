import React from "react";
import PriceChart from "../dashboard/PriceChart";

const PriceChartStoryboard = () => {
  return (
    <div className="p-4 bg-background">
      <PriceChart ticker="AAPL" minGap={2.0} maxGap={10} gapType="positive" />
    </div>
  );
};

export default PriceChartStoryboard;

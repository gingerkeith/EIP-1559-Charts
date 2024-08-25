//@ts-nocheck
import "./chartSetup";
import React from "react";
import { Line } from "react-chartjs-2";
import { ChartOptions } from "chart.js";
import { TooltipItem } from "chart.js";

interface ChartProps {
  data: any[];
  labels: string[];
  yAxisLabel: string;
}
interface GasMetricsChartProps {
  gasUsed: bigint[];
  gasLimit: bigint[];
  labels: string[];
  yAxisLabel: string;
}
// const convertToGwei = (wei: BigInt) => Number(wei) / 1e9;
// const convertToEth = (wei: BigInt) => Number(wei) / 1e18;

const options = {
  maintainAspectRatio: false,
  responsive: true,
  scales: {
    x: {
      beginAtZero: false,
      title: {
        display: true,
        text: "Block Number",
      },
    },
    y: {
      beginAtZero: false,
      grace: "5%",
      title: {
        display: true,
        text: "",
      },
      ticks: {},
      //   callback: function (
      //     tickValue: string | number,
      //     index: number,
      //     ticks: any[]
      //   ) {
      //     if (typeof tickValue === "number") {
      //       return `${tickValue}%`;
      //     }
      //     return tickValue.toString();
      //   },
      // },
    },
  },
  plugins: {
    tooltip: {
      enabled: true,
      callbacks: {
        //@ts-expect-error
        label: function (tooltipItem: TooltipItem<"line">) {
          //@ts-expect-error
          return tooltipItem.raw.toString(); // Display the value as a label
        },
      },
    },
  },
};

export const TotalTransactionVolumePerBlock: React.FC<ChartProps> = ({
  data,
  labels,
  yAxisLabel,
}) => {
  const _options: ChartOptions<"line"> = {
    ...options,
    scales: {
      ...options.scales,
      y: {
        ...options.scales.y,
        title: {
          ...options.scales.y.title,
          text: yAxisLabel,
        },
      },
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "Total Transaction Volume",
        data,
        fill: true,
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={_options} height={400} width={800} />;
    </div>
  );
};

// BASEFEE Per Block - Chart
export const BASEFEE_perBlock: React.FC<ChartProps> = ({
  data,
  labels,
  yAxisLabel,
}) => {
  const convertedBaseFees = data.map((fee) => Number(fee));

  const basefeeOptions = {
    ...options,
    scales: {
      ...options.scales,
      y: {
        ...options.scales.y,
        title: {
          ...options.scales.y.title,
          text: yAxisLabel,
        },
        ticks: {
          callback: function (value: string | number) {
            return `${Number(value) / 1e9} Gwei`; // Convert to Gwei
          },
        },
      },
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "BASEFEE per Block",
        data: convertedBaseFees,
        fill: true,
        backgroundColor: "rgba(255,99,132,0.4)",
        borderColor: "rgba(255,99,132,1)",
      },
    ],
  };

  return (
    <div className="chart-container">
      <Line
        data={chartData}
        options={basefeeOptions}
        height={400}
        width={800}
      />
      ;
    </div>
  );
};

// Gas Used vs Gas Limit Ratio - Chart
export const GasUsed_vs_GasLimit_Ratio: React.FC<ChartProps> = ({
  data,
  labels,
  yAxisLabel,
}) => {
  const ratioOptions = {
    ...options,
    scales: {
      ...options.scales,
      y: {
        ...options.scales.y,
        max: 100,
        title: {
          ...options.scales.y.title,
          text: yAxisLabel || "Gas Used vs Gas Limit (%)",
        },
        ticks: {
          callback: function (value: number) {
            return `${value}%`;
          },
        },
      },
    },
  };

  const chartData = {
    labels,
    datasets: [
      {
        label: "Gas Used vs Gas Limit Ratio",
        data,
        fill: true,
        backgroundColor: "rgba(54,162,235,0.4)",
        borderColor: "rgba(54,162,235,1)",
      },
      {
        label: "Gas Limit (100%)",
        data: Array(data.length).fill(100), // Constant line at 100%
        fill: false,
        backgroundColor: "rgba(255,159,64,0.4)",
        borderColor: "rgba(255,159,64,1)",
        // backgroundColor: "rgba(75,192,192,0.4)",
        // borderColor: "rgba(75,192,192,1)",
      },
    ],
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={ratioOptions} height={400} width={800} />;
    </div>
  );
};

export const GasMetrics_Chart: React.FC<GasMetricsChartProps> = ({
  gasUsed,
  gasLimit,
  labels,
  yAxisLabel,
}) => {
  const chartData = {
    labels,
    datasets: [
      {
        label: "Gas Used",
        data: gasUsed.map((value) => Number(value)),
        fill: true,
        backgroundColor: "rgba(54,162,235,0.4)",
        borderColor: "rgba(54,162,235,1)",
      },
      {
        label: "Gas Limit",
        data: gasLimit.map((value) => Number(value)),
        fill: false,
        backgroundColor: "rgba(255,159,64,0.4)",
        borderColor: "rgba(255,159,64,1)",
      },
    ],
  };

  const metricOptions = {
    ...options,
    scales: {
      ...options.scales,
      y: {
        ...options.scales.y,
        max: 30_000_000,
        title: {
          ...options.scales.y.title,
          text: yAxisLabel || "Gas Metrics",
        },
      },
    },
  };

  return (
    <div className="chart-container">
      <Line data={chartData} options={metricOptions} height={400} width={800} />
    </div>
  );
};

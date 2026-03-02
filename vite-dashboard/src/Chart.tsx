import React, { useEffect, useRef } from 'react';
import Plotly from 'plotly.js';

interface ChartProps {
  data: any[];
  column: string;
}

const Chart: React.FC<ChartProps> = ({ data, column }) => {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chartRef.current && data.length > 0) {
      const months = [...new Set(data.map(item => item.month))].sort();
      
      const traces = months.map(month => {
        const monthData = data.filter(item => item.month === month);
        return {
          x: monthData.map(item => item.EDIFICIO),
          y: monthData.map(item => item[column]),
          name: `Month ${month}`,
          type: 'bar',
        };
      });

      const layout: any = {
        title: {
          text: `Visualización para la columna: ${column}`,
        },
        barmode: 'group',
        xaxis: {
          title: {
            text: 'Edificio',
          },
        },
        yaxis: {
          title: {
            text: column,
          },
        },
        paper_bgcolor: '#1f2937', // bg-gray-800
        plot_bgcolor: '#1f2937', // bg-gray-800
        font: {
          color: '#ffffff'
        }
      };

      Plotly.newPlot(chartRef.current, traces as any, layout);
    }
  }, [data, column]);

  return <div ref={chartRef} />;
};

export default Chart;

import React, { useEffect, useState } from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';
import { Card, CardContent, CardHeader } from '../ui/card';

const MindShareChart: React.FC = () => {
  const [chartOptions, setChartOptions] = useState<any>(null);

  useEffect(() => {
    const generateMockData = () => {
      const priceData = [];
      const mindshareData = [];
      const categories = [];
      

      const startDate = new Date('2024-01-16');
      
      let price = 0.72;
      let mindshare = 8.0;
      
      for (let i = 0; i < 200; i++) {
        // Generate date
        const currentDate = new Date(startDate);
        currentDate.setHours(currentDate.getHours() + (i * 1.68)); // Spread over 7 days
        categories.push(currentDate.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          hour: '2-digit'
        }));

        const priceChange = (Math.random() - 0.5) * 0.02;
        price = Math.max(0.48, Math.min(0.96, price + priceChange));
        priceData.push(Number(price.toFixed(2)));

        const mindshareChange = (Math.random() - 0.48) * 0.15;
        mindshare = Math.max(7.5, Math.min(9.8, mindshare + mindshareChange));
        mindshareData.push(Number(mindshare.toFixed(2)));
      }

      priceData[priceData.length - 1] = 0.86;
      mindshareData[mindshareData.length - 1] = 9.57;

      return { categories, priceData, mindshareData };
    };

    const { categories, priceData, mindshareData } = generateMockData();

    const options = {
      chart: {
        backgroundColor: '#0A0D16',
        height: 400,
        style: {
          fontFamily: '-apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
        },
        spacingBottom: 20,
        spacingRight: 20
      },
      title: {
        text: '',
        align: 'left'
      },
      xAxis: {
        categories: categories,
        gridLineWidth: 0,
        labels: {
          step: 24,
          style: {
            color: '#ffffff',
            fontSize: '12px'
          }
        },
        lineColor: '#404040',
        tickLength: 0
      },
      yAxis: [{
        title: {
          text: ''
        },
        labels: {
          format: '${value}',
          align: 'left',
          x: 0,
          style: {
            color: '#ffffff',
            fontSize: '12px'
          }
        },
        gridLineColor: '#404040',
        min: 0.48,
        max: 0.96,
        tickAmount: 5
      }, {
        title: {
          text: ''
        },
        labels: {
          format: '{value}%',
          align: 'right',
          style: {
            color: '#ffffff',
            fontSize: '12px'
          }
        },
        opposite: true,
        min: 7.5,
        max: 9.8,
        tickAmount: 5
      }],
      legend: {
        align: 'left',
        verticalAlign: 'top',
        symbolRadius: 0,
        itemStyle: {
          color: '#ffffff',
          fontSize: '12px',
          fontWeight: 'normal'
        },
        itemDistance: 40
      },
      series: [{
        name: 'Mindshare',
        type: 'column',
        yAxis: 1,
        data: mindshareData,
        color: 'rgba(33, 150, 243, 0.5)',
        borderWidth: 0,
      }, {
        name: 'Price',
        type: 'line',
        data: priceData,
        color: '#2196f3',
        lineWidth: 2,
        marker: {
          enabled: true,
          radius: 0
        },
        states: {
          hover: {
            lineWidth: 2
          }
        }
      }],
      tooltip: {
        shared: true,
        backgroundColor: '#ffffff',
        borderColor: '#e6e6e6',
        borderRadius: 8,
        shadow: false,
        useHTML: true,
        headerFormat: '<div style="font-size: 12px">{point.key}</div>',
        pointFormat: '<div style="color: {series.color}">{series.name}: <b>{point.y:.2f}</b></div>',
        style: {
          color: '#333333'
        }
      },
      plotOptions: {
        series: {
          animation: {
            duration: 1000
          },
          states: {
            inactive: {
              opacity: 1
            }
          }
        },
        column: {
          borderRadius: 0,
          pointPadding: 0.2,
          groupPadding: 0.1,
          maxPointWidth: 3
        }
      },
      credits: {
        enabled: false
      }
    };

    setChartOptions(options);
  }, []);

  if (!chartOptions) {
    return <div>Loading...</div>;
  }

  return (
    <Card key="analytics-chart" className="rounded-lg">
      <CardHeader className='p-2 px-4 border-b border-gray-200'>
        <div className="space-y-2">
          <div className="flex items-center gap-10">
            <div>
              <div className="text-sm text-white text-sidebar-foreground">Mindshare</div>
              <div className="flex items-center gap-2">
                <span className="text-lg md:text-xl text-white font-semibold text-sidebar-foreground">9.57%</span>
                <span className="text-xs md:text-sm text-red-500">-1.76 7D</span>
              </div>
            </div>
            <div>
              <div className="text-sm text-white text-sidebar-foreground">Price</div>
              <div className="flex items-center gap-2">
                <span className="text-lg md:text-xl text-white font-semibold text-sidebar-foreground">$0.86</span>
                <span className="text-xs md:text-sm text-green-500">+28.44% 7D</span>
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className='p-0 md:p-3'>
        <HighchartsReact
          highcharts={Highcharts}
          options={chartOptions}
        />
      </CardContent>
    </Card>
  );
};

export default MindShareChart;
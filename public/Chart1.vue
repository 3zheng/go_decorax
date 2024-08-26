<template>
    <div id="chart" style="width: 600px; height: 400px;"></div>
</template>
  
  <script>
  //copilot给的示例
import * as echarts from 'echarts/core';
  import { CanvasRenderer } from 'echarts/renderers';
  import { PieChart, LineChart } from 'echarts/charts';
  import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
  
  echarts.use([CanvasRenderer, PieChart, LineChart, TitleComponent, TooltipComponent, LegendComponent]);
  
  export default {
    mounted() {
        alert('进入ChartView')
      this.initChart();
    },
    methods: {
      initChart() {
        const chartDom = document.getElementById('chart');
        const myChart = echarts.init(chartDom);
  
        const option = {
          title: {
            text: 'ECharts 示例'
          },
          tooltip: {
            trigger: 'item'
          },
          legend: {
            top: '5%',
            left: 'center'
          },
          series: [
            {
              name: '访问来源',
              type: 'pie',
              radius: '50%',
              data: [
                { value: 1048, name: '搜索引擎' },
                { value: 735, name: '直接访问' },
                { value: 580, name: '邮件营销' },
                { value: 484, name: '联盟广告' },
                { value: 300, name: '视频广告' }
              ],
              emphasis: {
                itemStyle: {
                  shadowBlur: 10,
                  shadowOffsetX: 0,
                  shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
              }
            }
          ]
        };
  
        myChart.setOption(option);
      }
    }
  };
  </script>
  
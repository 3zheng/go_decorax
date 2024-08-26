<template>
    <div>
        <div ref="pieChart" style="width: 600px; height: 400px;"></div>
        <div ref="trapezoidChart" style="width: 600px; height: 400px; margin-top: 30px;"></div>
    </div>
</template>

<script>
//chatpgt方法
import * as echarts from 'echarts';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart, LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';

echarts.use([CanvasRenderer, PieChart, LineChart, TitleComponent, TooltipComponent, LegendComponent]);

export default {
    name: "EChartsExample",
    mounted() {
        this.initPieChart();
        this.initTrapezoidChart();
    },
    methods: {
        initPieChart() {
            // 基于准备好的dom，初始化echarts实例
            const pieChart = echarts.init(this.$refs.pieChart);

            // 指定图表的配置项和数据
            const option = {
                title: {
                    text: '数据饼状图',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    //{a}, {b}, {c}, {d} 表示series.name、series.data.name、series.data.value、百分比
                    formatter: '{a} <br/>{b} : {c} ({d}%)'  
                    //或者使用formater:function (params)来达到效果
                    /*
                    formatter: function (params) {
                        return `
                        系列: ${params.seriesName}<br>
                        名称: ${params.name}<br>
                        值: ${params.value}<br>
                        百分比: ${params.percent || ''}%
                        `;
                    },
                    */
                },
                legend: {
                    orient: 'vertical',
                    left: 'left',
                    data: ['分类1', '分类2', '分类3', '分类4', '分类5']
                },
                series: [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '50%'],
                        data: [
                            { value: 335, name: '分类1' },
                            { value: 310, name: '分类2' },
                            { value: 234, name: '分类3' },
                            { value: 135, name: '分类4' },
                            { value: 1548, name: '分类5' }
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

            // 使用刚指定的配置项和数据显示图表
            pieChart.setOption(option);
        },
        initTrapezoidChart() {
            const trapezoidChart = echarts.init(this.$refs.trapezoidChart);

            const option = {
                title: {
                    text: '梯形图',
                    x: 'center'
                },
                tooltip: {},
                xAxis: {
                    type: 'category',
                    data: ['一', '二', '三', '四', '五']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        type: 'bar',
                        data: [10, 20, 15, 25, 30],
                        barWidth: [50],
                        itemStyle: {
                            color: function (params) {
                                // 通过判断值的大小实现梯形效果
                                const colors = ['#5470C6', '#91CC75', '#FAC858', '#EE6666', '#73C0DE'];
                                return colors[params.dataIndex];
                            }
                        }
                    }
                ]
            };

            trapezoidChart.setOption(option);
        }
    }
};
</script>

<style scoped></style>
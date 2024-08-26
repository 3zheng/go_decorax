<template>
    <div>
        <!--图表饼状图、条形图-->
        <div ref="pieChart" style="width: 800px; height: 400px;"></div>
        <div ref="trapezoidChart" style="width: 800px; height: 400px; margin-top: 30px;"></div>
        <!--表格1-->
        <h3>欠款概要</h3>
        <el-table :data="showDataDebt" border style="width: 100%" size="mini">
            <el-table-column label="序号" width="60">
                <template slot-scope="scope">{{ (currentPageDebt - 1) * pageSizeDebt + scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="Salesman" label="销售员" width="250"> </el-table-column>
            <el-table-column prop="DebtAmount" label="欠款总金额" width="100"></el-table-column>
            <el-table-column prop="DebtNum" label="欠款笔数" width="80"> </el-table-column>
        </el-table>
        <!--分页-->
        <el-form :inline="true">
            <el-row style="margin-top: 10px">
                <el-col :span="8" style="text-align: left; margin-top: 0px">
                    <el-button type="primary" icon="el-icon-back" @click="onPageUpDebt">上一页</el-button>
                    <el-button type="primary" icon="el-icon-right" @click="onPageDownDebt">下一页</el-button>
                </el-col>
                <el-col :span="10" style="text-align: right; margin-top: 0px">
                    <el-pagination @size-change="handleSizeChangeDebt" @current-change="handleCurrentChangeDebt"
                        :current-page="currentPageDebt" :page-sizes="[5, 10, 20, 50]" :page-size="5"
                        layout="total, sizes, prev, pager, next, jumper" :total="searchTotalDebt">
                    </el-pagination>
                </el-col>
                <el-col :span="2"> </el-col>
            </el-row>
        </el-form>
        <h3>销售员日销售数据</h3>
        <el-table :data="showDataSales" border style="width: 100%" size="mini">
            <el-table-column label="序号" width="60">
                <template slot-scope="scope">{{ (currentPageSales - 1) * pageSizeSales + scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="Name" label="销售员姓名" width="250"> </el-table-column>
            <el-table-column prop="SalesDate" label="销售日期" width="100"></el-table-column>
            <el-table-column prop="SalesAmount" label="销售金额" width="120"></el-table-column>            
            <el-table-column prop="OrderFormNum" label="订单数量" width="80"> </el-table-column>
        </el-table>
        <!--分页-->
        <el-form :inline="true">
            <el-row style="margin-top: 10px">
                <el-col :span="8" style="text-align: left; margin-top: 0px">
                    <el-button type="primary" icon="el-icon-back" @click="onPageUpSales">上一页</el-button>
                    <el-button type="primary" icon="el-icon-right" @click="onPageDownSales">下一页</el-button>
                </el-col>
                <el-col :span="10" style="text-align: right; margin-top: 0px">
                    <el-pagination @size-change="handleSizeChangeSales" @current-change="handleCurrentChangeSales"
                        :current-page="currentPageSales" :page-sizes="[5, 10, 20, 50]" :page-size="5"
                        layout="total, sizes, prev, pager, next, jumper" :total="searchTotalSales">
                    </el-pagination>
                </el-col>
                <el-col :span="2"> </el-col>
            </el-row>
        </el-form>
        <div style="margin-top: 10px;">
            <el-progress v-if="showProgress" :text-inside="true" :color="customColors" :stroke-width="20" :percentage="progress"></el-progress>
        </div>
    </div>
</template>

<script>
import table from '@/components/table.vue';
import * as echarts from 'echarts';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart, LineChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';

echarts.use([CanvasRenderer, PieChart, LineChart, TitleComponent, TooltipComponent, LegendComponent]);

export default {
    name:'Debt',
    data() {
        return {
            form: {  //表单
                fuzzyQuery: '',  //模糊查询条件
            },
            progress: 0,    //进度条进度 0-100
            showProgress: true, //是否显示进度条
            customColors: [
                {color: '#e6a23c', percentage: 80},  //橙色
                {color: '#67c23a', percentage: 100},    //绿色
            ],
            //欠款表变量
            totalDataDebt:[],      //所有数据
            searchDataDebt: [],  //根据条件筛选后数据集
            searchTotalDebt: 0,   //数据个数
            showDataDebt:[],    //当前显示的数据
            pageSizeDebt:5, //每页展示的数据个数
            currentPageDebt:1,  //当前页
            //日销售数据表变量
            totalDataSales:[],      //所有数据
            searchDataSales:[],  //根据条件筛选后数据集
            searchTotalSales: 0,   //数据个数
            showDataSales:[],    //当前显示的数据
            pageSizeSales:5, //每页展示的数据个数
            currentPageSales:1,  //当前页
        };
    },

    beforeRouteEnter: (to, from, next) => {
        next((vm) => {
            vm.startProgress();
            vm.getDataDebt();
            vm.getDataSales();
        });
    },
    /*
    mounted: ()=>{
        alert('mounted')
        this.getData()
    },
    */
    methods: {
        startProgress() {
            const interval = setInterval(() => {
                if (this.progress < 100) {
                    this.progress += 10;
                } else {
                    clearInterval(interval);
                    setTimeout(() => {
                        this.showProgress = false;
                    }, 1000); // 1秒后隐藏进度条
                }
            }, 1000); // 每秒增加10%
        },
        getDataDebt() {
            this.axios({
                method: "get",
                //url: "http://localhost:24686/api/debt_summary",   //后端服务器的实际端口
                //url: "http://35.203.42.244:31111/api/debt_summary", //通过ngnix反向代理
                url: "http://104.225.234.236:31111/api/debt_summary", //通过ngnix反向代理
            })
                .then((repos) => {
                    //console.log(repos.data);
                    this.totalDataDebt = repos.data;
                    this.searchDataDebt = repos.data;
                    this.searchTotalDebt = this.searchDataDebt.length;
                    this.changeShowPageDebt()
                    this.progress = this.progress+50;
                    this.initPieChart();
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        getDataSales() {
            this.axios({
                method: "get",
                //url: "http://localhost:24686/api/sales_record",   //后端服务器的实际端口
                //url: "http://35.203.42.244:31111/api/sales_record", //通过ngnix反向代理
                url: "http://104.225.234.236:31111/api/sales_record", //通过ngnix反向代理
            })
                .then((repos) => {
                    //console.log(repos.data);
                    this.totalDataSales = repos.data;
                    this.searchDataSales = repos.data;
                    this.searchTotalSales = this.searchDataSales.length;
                    this.changeShowPageSales()
                    this.progress = this.progress = this.progress+50;
                    this.initTrapezoidChart();
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        handleSizeChangeDebt(val) {
            console.log(`每页 ${val} 条`);
            this.pageSizeDebt = val;
            this.changeShowPageDebt()
        },
        handleSizeChangeSales(val) {
            console.log(`每页 ${val} 条`);
            this.pageSizeSales = val;
            this.changeShowPageSales()
        },
        handleCurrentChangeDebt(val) {
            console.log(`当前页: ${val}`);
            this.currentPageDebt = val;
            this.changeShowPageDebt()
        },
        handleCurrentChangeSales(val) {
            console.log(`当前页: ${val}`);
            this.currentPageSales = val;
            this.changeShowPageSales()
        },
        changeShowPageDebt(){
            var start = (this.currentPageDebt-1)*this.pageSizeDebt;
            var end = (this.currentPageDebt-1)*this.pageSizeDebt + this.pageSizeDebt;
            var str = "start="+ start+ " end="+ end
            console.log(str);
            this.showDataDebt = this.searchDataDebt.slice(start, end);
        },
        changeShowPageSales(){
            var start = (this.currentPageSales-1)*this.pageSizeSales;
            var end = (this.currentPageSales-1)*this.pageSizeSales + this.pageSizeSales;
            var str = "start="+ start+ " end="+ end
            console.log(str);
            this.showDataSales = this.searchDataSales.slice(start, end);
        },
        onPageUpDebt(){
            if (this.currentPageDebt > 1){
                this.handleCurrentChangeDebt(this.currentPageDebt-1)
            }           
        },
        onPageUpSales(){
            if (this.currentPageSales > 1){
                this.handleCurrentChangeSales(this.currentPageSales-1)
            }           
        },
        onPageDownDebt(){
            alert(`currentPageDebt=${this.currentPageDebt}, pageSizeDebt=${this.pageSizeDebt}`)
            if (this.currentPageDebt * this.pageSizeDebt < this.searchTotalDebt){
                this.handleCurrentChangeDebt(this.currentPageDebt+1)
            }
        },
        onPageDownSales(){
            if (this.currentPageSales * this.pageSizeSales < this.searchTotalSales){
                this.handleCurrentChangeSales(this.currentPageSales+1)
            }
        },
        initPieChart() {
            // 基于准备好的dom，初始化echarts实例
            const pieChart = echarts.init(this.$refs.pieChart);

            let radiusValue = '55%';
let centerValue = ['50%', '50%'];
let chartTitle = '动态饼图';
let data = [
  { value: 335, name: '直接访问' },
  { value: 310, name: '邮件营销' }
];
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
        },
    },
}
</script>

<style></style>
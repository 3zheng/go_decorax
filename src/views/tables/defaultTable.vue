<template>
    <div>
        <!--图表饼状图、条形图-->
        <div ref="pieChart" style="width: 800px; height: 400px;"></div>
        <div ref="trapezoidChart" style="width: 800px; height: 400px; margin-top: 30px;"></div>
        <div ref="trapezoidChartCBB" style="width: 800px; height: 400px; margin-top: 30px;"></div>
        <div ref="trapezoidChartLPZ" style="width: 800px; height: 400px; margin-top: 30px;"></div>
        <div ref="trapezoidChartSCZ" style="width: 800px; height: 400px; margin-top: 30px;"></div>
        <!--表格1-->
        <h3>Resumen de Atrasos</h3>
        <el-table :data="showDataDebt" border style="width: 100%" size="mini">
            <el-table-column width="70">
                <template slot="header">Número<br>de Serie</template>
                <template slot-scope="scope">{{ (currentPageDebt - 1) * pageSizeDebt + scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="Salesman" label="Nombre del Vendedor" width="250"> </el-table-column>
            <el-table-column prop="DebtAmount" width="100">
                <template slot="header">Monto Total<br>Adeudado</template>
            </el-table-column>
            <el-table-column prop="DebtNum" width="160">
                <template slot="header">Número de<br>Facturas Adeudadas</template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-form :inline="true">
            <el-row style="margin-top: 10px">
                <el-col :span="8" style="text-align: left; margin-top: 0px">
                    <el-button type="primary" icon="el-icon-back" @click="onPageUpDebt">Página Arriba</el-button>
                    <el-button type="primary" icon="el-icon-right" @click="onPageDownDebt">Página Abajo</el-button>
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
        <h3>Datos de Ventas Diarias del Vendedor</h3>
        <el-table :data="showDataSales" border style="width: 100%" size="mini">
            <el-table-column width="70">
                <template slot="header">Número<br>de Serie</template>
                <template slot-scope="scope">{{ (currentPageSales - 1) * pageSizeSales + scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="Name" label="Nombre del Vendedor" width="250"></el-table-column>
            <el-table-column prop="SalesDate" label="Fecha de Venta" width="100">
                <template slot="header">Fecha de<br> Venta</template>
            </el-table-column>
            <el-table-column prop="SalesAmount" label="Monto de Ventas" width="120"></el-table-column>            
            <el-table-column prop="OrderFormNum" label="Número de Pedidos" width="90">
                <template slot="header">Número de<br> Pedidos</template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-form :inline="true">
            <el-row style="margin-top: 10px">
                <el-col :span="8" style="text-align: left; margin-top: 0px">
                    <el-button type="primary" icon="el-icon-back" @click="onPageUpSales">Página Arriba</el-button>
                    <el-button type="primary" icon="el-icon-right" @click="onPageDownSales">Página Abajo</el-button>
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
import moment from 'moment';

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
                //url: "http://104.225.234.236:31111/api/debt_summary", //通过ngnix反向代理
                url: "/api/debt_summary", //通过ngnix反向代理
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
                //url: "http://104.225.234.236:31111/api/sales_record", //通过ngnix反向代理
                url: "/api/sales_record", //通过ngnix反向代理
            })
                .then((repos) => {
                    //console.log(repos.data);
                    this.totalDataSales = repos.data;
                    this.searchDataSales = repos.data;
                    this.searchTotalSales = this.searchDataSales.length;
                    this.changeShowPageSales()
                    this.progress = this.progress = this.progress+50;
                    this.initTrapezoidChart();
                    this.initTrapezoidChartCBB();
                    this.initTrapezoidChartLPZ();
                    this.initTrapezoidChartSCZ();
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
            /*
            [
                { value: 335, name: '分类1' },
                { value: 310, name: '分类2' },
                { value: 234, name: '分类3' },
                { value: 135, name: '分类4' },
                { value: 1548, name: '分类5' }
            ],
            */
            // 基于准备好的dom，初始化echarts实例
            const pieChart = echarts.init(this.$refs.pieChart);
            //欠款
            
            let salesman = [];  //销售员姓名
            let salesData =[];
            this.totalDataDebt.forEach(item => {
                const obj = {value:item['DebtAmount'], name:item['Salesman']};
                salesman.push(item['Salesman']);
                salesData.push(obj)
            })
            // 指定图表的配置项和数据
            const option = {
                title: {
                    text: 'Resumen de Atrasos',
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    //{a}, {b}, {c}, {d} 表示series.name、series.data.name、series.data.value、百分比
                    formatter: '{a} <br/>{b} : {c}bs ({d}%)'  
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
                    data: salesman,
                    //data: ['分类1', '分类2', '分类3', '分类4', '分类5']
                },
                series: [
                    {
                        name: 'Vendedor',   //销售员
                        type: 'pie',
                        radius: '65%',
                        center: ['68%', '50%'],
                        data: salesData,
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
            const current = moment().format('YYYY-MM-DD');
            const titleName = 'Datos de Ventas de Hoy '+ current;
            const salesName = [];
            const salesAmount = [];
            this.totalDataSales.forEach(item => {
                if (item['SalesDate'] == current){
                    salesName.push(item['Name']);
                    salesAmount.push(item['SalesAmount'])
                }
            })

            const option = {
                title: {
                    text: titleName,
                    x: 'center'
                },
                tooltip: {},
                xAxis: {
                    type: 'category',
                    data: salesName
                },
                yAxis: {
                    type: 'value',
                    //max: 'dataMax', // 根据数据最大值自动调整
                },
                series: [
                    {
                        type: 'bar',
                        data: salesAmount,
                        barWidth: 27,
                        itemStyle: {
                            color: params => {
                                // 通过判断值的大小实现梯形效果
                                //const colors = this.getRandColors;    //随机颜色
                                const colors = []; //固定颜色
                                //字符串的includes函数查找子字符串
                                if (params.name.includes('CBB')){
                                    return '#4397d9';   //蓝
                                }else if (params.name.includes('LPZ')){
                                    return '#51d47f'   //绿
                                }else if (params.name.includes('SCZ')){
                                    return '#de3da3'    //红
                                }else{
                                    return '#000000' //黑
                                }

                                //return colors[params.dataIndex];
                            }
                        }
                    }
                ]
            };
            //刷新条形图显示
            trapezoidChart.setOption(option);
        },
        initTrapezoidChartCBB() {
            //Cochabamba的当月销售额
            const trapezoidChart = echarts.init(this.$refs.trapezoidChartCBB);
            const current = moment().format('YYYY-MM');
            const titleName = 'Cochabamba ' + 'ingresos por ventas del mes actual ' + current;
            const salesDates = [];
            const salesAmount = [];
            let salesDayAmount = 0;
            const mapSales = new Map()  //存放当月的每日销售额数据
            this.totalDataSales.forEach(item => {
                //当前月并且是对应城市
                const itemDate =  item['SalesDate'];
                const itemName =  item['Name'];
                if (itemDate.includes(current) && itemName.includes('CBB')){
                    //把符合条件的数据进行累加，当天的所有销售额都加在一起
                    if (mapSales.has(itemDate)){ //存在键值对
                        salesDayAmount = mapSales.get(itemDate);
                        if (typeof(item['SalesAmount']) !== 'number'){
                            alert(`type is ${typeof(item['SalesAmount'])}, value = ${item['SalesAmount']}`)
                        }
                        salesDayAmount = salesDayAmount + (item['SalesAmount']);   //保留小数点后两位
                        mapSales.set(itemDate, (salesDayAmount));
                    }else{  //不存在键值对
                        mapSales.set(itemDate, (item['SalesAmount']));
                    }
                }
            })
            //把mapSales转成数组后进行排序
            let arrSales = [...mapSales.entries()]
            arrSales.sort((a,b)=>a[0].localeCompare(b[0]))
            arrSales.forEach(item => {
                salesDates.push(item[0]);
                salesAmount.push(item[1].toFixed(2));
            })

            const option = {
                title: {
                    text: titleName,
                    x: 'center'
                },
                tooltip: {},
                xAxis: {
                    type: 'category',
                    data: salesDates
                },
                yAxis: {
                    type: 'value',
                    //max: 'dataMax', // 根据数据最大值自动调整
                },
                series: [
                    {
                        type: 'bar',
                        data: salesAmount,
                        barWidth: 20,
                        itemStyle: {
                            color: params => {
                                // 通过判断值的大小实现梯形效果
                                //const colors = this.getRandColors;    //随机颜色
                                //固定颜色,使用字符串的includes函数查找子字符串
                                return '#4397d9';   //蓝
                                //return colors[params.dataIndex];
                            }
                        }
                    }
                ]
            };
            //刷新条形图显示
            trapezoidChart.setOption(option);
        },
        initTrapezoidChartLPZ() {
            //LPZ的当月销售数据
            const trapezoidChart = echarts.init(this.$refs.trapezoidChartLPZ);
            const current = moment().format('YYYY-MM');
            const titleName = 'La Paz ' + 'ingresos por ventas del mes actual ' + current;
            const salesDates = [];
            const salesAmount = [];
            let salesDayAmount = 0;
            const mapSales = new Map()  //存放当月的每日销售额数据
            this.totalDataSales.forEach(item => {
                //当前月并且是对应城市
                const itemDate =  item['SalesDate'];
                const itemName =  item['Name'];
                if (itemDate.includes(current) && itemName.includes('LPZ')){
                    //把符合条件的数据进行累加，当天的所有销售额都加在一起
                    if (mapSales.has(itemDate)){ //存在键值对
                        salesDayAmount = mapSales.get(itemDate);
                        if (typeof(item['SalesAmount']) !== 'number'){
                            alert(`type is ${typeof(item['SalesAmount'])}, value = ${item['SalesAmount']}`)
                        }
                        salesDayAmount = salesDayAmount + (item['SalesAmount']);   //保留小数点后两位
                        mapSales.set(itemDate, (salesDayAmount));
                    }else{  //不存在键值对
                        mapSales.set(itemDate, (item['SalesAmount']));
                    }
                }
            })
            //把mapSales转成数组后进行排序
            let arrSales = [...mapSales.entries()]
            arrSales.sort((a,b)=>a[0].localeCompare(b[0]))
            arrSales.forEach(item => {
                salesDates.push(item[0]);
                salesAmount.push(item[1].toFixed(2));
            })
            //条形图
            const option = {
                title: {
                    text: titleName,
                    x: 'center'
                },
                tooltip: {},
                xAxis: {
                    type: 'category',
                    data: salesDates
                },
                yAxis: {
                    type: 'value',
                    //max: 'dataMax', // 根据数据最大值自动调整
                },
                series: [
                    {
                        type: 'bar',
                        data: salesAmount,
                        barWidth: 20,
                        itemStyle: {
                            color: params => {
                                // 通过判断值的大小实现梯形效果
                                //const colors = this.getRandColors;    //随机颜色
                                return '#51d47f'   //绿
                                //return colors[params.dataIndex];
                            }
                        }
                    }
                ]
            };
            //刷新条形图显示
            trapezoidChart.setOption(option);
        },
        initTrapezoidChartSCZ() {
            const trapezoidChart = echarts.init(this.$refs.trapezoidChartSCZ);
            const current = moment().format('YYYY-MM');
            const titleName = 'Santa Cruz ' + 'ingresos por ventas del mes actual ' + current;
            const salesDates = [];
            const salesAmount = [];
            let salesDayAmount = 0;
            const mapSales = new Map()  //存放当月的每日销售额数据
            this.totalDataSales.forEach(item => {
                //当前月并且是对应城市
                const itemDate =  item['SalesDate'];
                const itemName =  item['Name'];
                if (itemDate.includes(current) && itemName.includes('SCZ')){
                    //把符合条件的数据进行累加，当天的所有销售额都加在一起
                    if (mapSales.has(itemDate)){ //存在键值对
                        salesDayAmount = mapSales.get(itemDate);
                        if (typeof(item['SalesAmount']) !== 'number'){
                            alert(`type is ${typeof(item['SalesAmount'])}, value = ${item['SalesAmount']}`)
                        }
                        salesDayAmount = salesDayAmount + (item['SalesAmount']);   //保留小数点后两位
                        mapSales.set(itemDate, (salesDayAmount));
                    }else{  //不存在键值对
                        mapSales.set(itemDate, (item['SalesAmount']));
                    }
                }
            })
            //把mapSales转成数组后进行排序
            let arrSales = [...mapSales.entries()]
            arrSales.sort((a,b)=>a[0].localeCompare(b[0]))
            arrSales.forEach(item => {
                salesDates.push(item[0]);
                salesAmount.push(item[1].toFixed(2));
            })
            //条形图
            const option = {
                title: {
                    text: titleName,
                    x: 'center'
                },
                tooltip: {},
                xAxis: {
                    type: 'category',
                    data: salesDates
                },
                yAxis: {
                    type: 'value',
                    //max: 'dataMax', // 根据数据最大值自动调整
                },
                series: [
                    {
                        type: 'bar',
                        data: salesAmount,
                        barWidth: [20],
                        itemStyle: {
                            color: params => {
                                // 通过判断值的大小实现梯形效果
                                //const colors = this.getRandColors;    //随机颜色
                                //字符串的includes函数查找子字符串
                                return '#de3da3'    //红
                                //return colors[params.dataIndex];
                            }
                        }
                    }
                ]
            };
            //刷新条形图显示
            trapezoidChart.setOption(option);
        },
    },

    computed: {
        getRandColors() {
            const colors = [];
            let randcolor = '';
            for (let i = 0; i < 50; i++) {
                randcolor = [
                    Math.round(Math.random() * 90),
                    Math.round(Math.random() * 255),
                    Math.round(Math.random() * 255),
                ].join('');
                randcolor = '#' + randcolor;
                colors.push(randcolor)
            }
            return colors
        },
    },
}
</script>

<style></style>
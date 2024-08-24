<template>
    <div>
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
                url: "http://35.203.42.244:31111/api/debt_summary", //通过ngnix反向代理
            })
                .then((repos) => {
                    //console.log(repos.data);
                    this.totalDataDebt = repos.data;
                    this.searchDataDebt = repos.data;
                    this.searchTotalDebt = this.searchDataDebt.length;
                    this.changeShowPageDebt()
                    this.progress = this.progress+50;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        getDataSales() {
            this.axios({
                method: "get",
                //url: "http://localhost:24686/api/sales_record",   //后端服务器的实际端口
                url: "http://35.203.42.244:31111/api/sales_record", //通过ngnix反向代理
            })
                .then((repos) => {
                    //console.log(repos.data);
                    this.totalDataSales = repos.data;
                    this.searchDataSales = repos.data;
                    this.searchTotalSales = this.searchDataSales.length;
                    this.changeShowPageSales()
                    this.progress = this.progress = this.progress+50;
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
    },
}
</script>

<style></style>
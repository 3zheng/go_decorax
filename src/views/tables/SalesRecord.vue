<template>
    <div>
        <!--查询按钮-->
        <el-form :inline="true" ref="form" :model="form">
            <!--el-row :gutter="20"-->
            <el-row>
                <el-col :span="8">
                    <el-form-item label="Buscar:">
                        <el-input placeholder="Palabras Clave" v-model="form.fuzzyQuery" @keyup.enter.native="onSubmit"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" icon="el-icon-search" @click="onSubmit">Buscar</el-button>
                    <el-button type="primary" icon="el-icon-s-order" @click="onReset">Reiniciar</el-button>
                </el-col>
                <el-col :span="10">
                    <!--日期选择器-->
                    <div class="block">
                        <!--span class="demonstration">带快捷选项</span-->
                        <el-date-picker v-model="dateValue" value-format="yyyy-MM-dd" type="daterange" align="right" unlink-panels
                            range-separator="a" start-placeholder="Inicio Fecha" end-placeholder="Finalización Fecha"
                            :picker-options="pickerOptions" @change="onSubmitDate">
                        </el-date-picker>
                    </div>
                </el-col>
            </el-row>
        </el-form>
        <!--表格-->
        <el-table :data="showData" border style="width: 100%" size="mini">
            <el-table-column label="Número De Serie" width="70">
                <template slot="header">Número<br>de Serie</template>
                <template slot-scope="scope">{{ (currentPage - 1) * pageSize + scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="Name" label="销售员姓名" width="250">
                <template slot="header">Nombre del Vendedor</template>
            </el-table-column>
            <el-table-column prop="SalesDate" label="销售日期" width="100">
                <template slot="header">Fecha de<br>Venta</template>
            </el-table-column>
            <el-table-column prop="SalesAmount" label="Monto de Ventas" width="120"></el-table-column>
            <el-table-column prop="OrderFormNum" label="Número de Pedidos" width="90">
                <template slot="header">Número de<br>Pedidos</template>
            </el-table-column>
        </el-table>
        <!--分页-->
        <el-form :inline="true">
            <el-row style="margin-top: 10px">
                <el-col :span="8" style="text-align: left; margin-top: 0px">
                    <el-button type="primary" icon="el-icon-back" @click="onPageUp">Página Arriba</el-button>
                    <el-button type="primary" icon="el-icon-right" @click="onPageDown">Página Abajo</el-button>
                </el-col>
                <el-col :span="10" style="text-align: right; margin-top: 0px">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page="currentPage" :page-sizes="[5, 10, 20, 50]" :page-size="5"
                        layout="total, sizes, prev, pager, next, jumper" :total="searchTotal">
                    </el-pagination>
                </el-col>
                <el-col :span="2"> </el-col>
            </el-row>
        </el-form>
        <!--进度条-->
        <div style="margin-top: 10px;">
            <el-progress v-if="showProgress" :text-inside="true" :color="customColors" :stroke-width="20"
                :percentage="progress"></el-progress>
        </div>
    </div>
</template>

<script>
import table from '@/components/table.vue';
export default {
    name:'SalesRecord',
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
            totalData:[],   //所有数据
            searchData: [],  //根据条件筛选后获得的数据集，和showData直接关联
            searchTotal: 0,   //数据个数
            showData:[],    //当前显示的数据
            pageSize:5, //每页展示的数据个数
            currentPage:1,  //当前页
            //日期选择器
            pickerOptions: {    //快捷选项
                shortcuts: [{
                    text: 'la última semana',   //最近一周
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
                        picker.$emit('pick', [start, end]);
                    }
                }, 
                {
                    text: 'el ultimo mes', //最近一个月
                    onClick(picker) {
                        const end = new Date();
                        const start = new Date();
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
                        picker.$emit('pick', [start, end]);
                    }
                },]
            },
            dateValue:[],
        };
    },

    beforeRouteEnter: (to, from, next) => {
        //alert("进入SalesRecord路由");
        next((vm) => {
            vm.isGetall = false
            vm.startProgress();
            //vm.getData();
            vm.getPartialData();
            vm.getAllData();
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
        getPartialData() {
            this.axios({
                method: "get",
                //url: "http://localhost:24686/api/sales_record",//后端服务器的实际端口
                //url: "http://35.203.42.244:31111/api/sales_record",  //通过ngnix反向代理
                //url: "http://104.225.234.236:31111/api/sales_record", //通过ngnix反向代理
                url: "/api/sales_record", //通过ngnix反向代理
                params: {
                    volume: 'partial',
                }
            })
                .then((repos) => {
                    //如果已经获取了全部数据就直接返回
                    if (this.isGetall){
                        return
                    }
                    //console.log(repos.data);
                    this.currentPage = 1;
                    this.totalData = repos.data;
                    this.searchData = repos.data;    //条件查询数据也是总数据，因为此时没有查询条件
                    this.searchTotal = this.searchData.length;
                    this.changeShowPage();
                    this.progress = this.progress+20;
                })
                .catch((error) => {
                    //alert('axios错误')
                    console.log(error);
                });
        },
        getAllData(){
            this.axios({
                method: "get",
                //url: "http://localhost:24686/api/sales_record",//后端服务器的实际端口
                //url: "http://35.203.42.244:31111/api/sales_record",  //通过ngnix反向代理
                //url: "http://104.225.234.236:31111/api/sales_record", //通过ngnix反向代理
                url:"/api/sales_record",
                params: {
                    volume: 'all',
                }
            })
                .then((repos) => {
                    //console.log(repos.data);
                    this.totalData = repos.data;
                    this.searchData = repos.data;    //条件查询数据也是总数据，因为此时没有查询条件
                    this.searchTotal = this.searchData.length;
                    this.changeShowPage();
                    this.progress = 100;
                    this.isGetall = true    //已经获取所有数据
                    //异步执行去空格函数,数据量大使用异步函数
                    (async () => {
                        this.totalData = await this.$removeArrayExtraSpaces(this.totalData);
                        console.log('已执行异步去空格函数')
                    })();
                })
                .catch((error) => {
                    //alert('axios错误')
                    console.log(error);
                });
        },
        getData() {
            this.axios({
                method: "get",
                //url: "http://localhost:24686/api/sales_record",   //后端服务器的实际端口
                //url: "http://35.203.42.244:31111/api/sales_record",  //通过ngnix反向代理
                url: "http://104.225.234.236:31111/api/sales_record", //通过ngnix反向代理
            })
                .then((repos) => {
                    //console.log(repos.data);
                    this.totalData = this.$removeExtraSpaces(repos.data);   //去两个以上的重复空格
                    this.searchData = this.$removeExtraSpaces(repos.data);   //去两个以上的重复空格
                    this.searchTotal = this.searchData.length;
                    this.changeShowPage();
                    this.progress = 100;
                })
                .catch((error) => {
                    console.log(error);
                });
        },
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pageSize = val;
            this.changeShowPage()
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
            this.changeShowPage()
        },
        changeShowPage(){
            var start = (this.currentPage-1)*this.pageSize;
            var end = (this.currentPage-1)*this.pageSize + this.pageSize;
            var str = "start="+ start+ " end="+ end
            console.log(str);
            this.showData = this.searchData.slice(start, end);
        },
        onSubmit() {
            //alert("提交搜索表单")
            var fuzzy = this.form.fuzzyQuery.trim().toLowerCase()
            if (fuzzy != '') {
                //模糊查询
                this.searchData = [];
                this.totalData.forEach(item => {
                    for (let key in item){
                        let value = item[key];
                        if (typeof value == 'string'){
                            value = value.trim().toLowerCase();
                        }
                        if (value == fuzzy) {
                            this.searchData.push(item);
                            break;
                        }
                    }
                })
            } else {
                //全部条件都为空，那么把
                this.searchData = this.totalData;
            }
            this.searchTotal = this.searchData.length
            this.currentPage = 1;
            this.changeShowPage();
        },
        onReset() {
            this.searchData = this.totalData;
            this.searchTotal = this.searchData.length
            this.currentPage = 1;
            this.changeShowPage();
        },
        onPageUp(){
            if (this.currentPage > 1){
                this.handleCurrentChange(this.currentPage-1)
            }           
        },
        onPageDown(){
            if (this.currentPage * this.pageSize < this.searchTotal){
                this.handleCurrentChange(this.currentPage+1)
            }
        },
        onSubmitDate() {
            if (this.dateValue.length < 2) {
                console.log("日期选择器获取的日期元素小于2");
                return;
            }
            const start = this.dateValue[0], end = this.dateValue[1];
            this.searchData = [];
            this.totalData.forEach(item => {
                if (item['SalesDate'] >= start  && item['SalesDate'] <= end) {
                    console.log("找到了")
                    this.searchData.push(item);
                }
            })
            this.searchTotal = this.searchData.length
            this.currentPage = 1;
            this.changeShowPage();
        },
    },
}
</script>

<style></style>
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
            </el-row>
        </el-form>
        <!--表格-->
        <el-table :data="showData" border style="width: 100%" size="mini">
            <el-table-column label="Número De Serie" width="70">
                <template slot="header">Número<br>de Serie</template>
                <template slot-scope="scope">{{ (currentPage - 1) * pageSize + scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="Salesman" label="销售员姓名" width="250">
                <!--使用template slot="header" 可以覆盖el-table-column label里的内容-->
                <template slot="header">Nombre del Vendedor</template>
            </el-table-column>
            <el-table-column prop="SalesAmount" label="销售总额" width="120">
                <template slot="header">Ventas Totales</template>
            </el-table-column>            
            <el-table-column prop="OrderFormNum" label="Número de Pedidos" width="90"> 
                <template slot="header">Número de<br> Pedidos</template>
            </el-table-column>
            <el-table-column prop="SalesMonth" label="Mes" width="100"> </el-table-column>
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
            <el-progress v-if="showProgress" :text-inside="true" :color="customColors" :stroke-width="20" :percentage="progress"></el-progress>
        </div>
    </div>
</template>

<script>
import table from '@/components/table.vue';
export default {
    name:'SalesSummary',
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
        };
    },

    beforeRouteEnter: (to, from, next) => {
        //alert("进入SalesSummary路由");
        next((vm) => {
            vm.startProgress();
            vm.getData();
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
        getData() {
            this.axios({
                method: "get",
                //url: "http://localhost:24686/api/sales_summary",   //后端服务器的实际端口
                //url: "http://35.203.42.244:31111/api/sales_summary",  //通过ngnix反向代理
                //url: "http://104.225.234.236:31111/api/sales_summary", //通过ngnix反向代理
                url: "/api/sales_summary", //通过ngnix反向代理
            })
                .then((repos) => {
                    //console.log(repos.data);
                    this.totalData = repos.data;   //去两个以上的重复空格
                    this.searchData = repos.data;   //去两个以上的重复空格
                    this.searchTotal = this.searchData.length;
                    this.changeShowPage();
                    this.progress = 100;
                    //异步执行去多余空格函数
                    /*
                    (async () => {
                        await this.$removeArrayExtraSpaces(this.totalData)
                    })();
                    */
                })
                .catch((error) => {
                    //alert('axios错误')
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
                //全部条件都为空
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
    },
}
</script>

<style></style>
<template>
    <div>
        <!--查询按钮-->
        <el-form :inline="true" ref="form" :model="form">
            <el-row>
                <el-col :span="8">
                    <!--模糊搜索 @keyup.enter.native表示响应回车键-->
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
            <!--数据序号-->
            <el-table-column width="70">
                <template slot="header">Número<br>de Serie</template>
                <template slot-scope="scope">{{ (currentPage - 1) * pageSize + scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="DebtorID" label="Deudor ID" width="80"> </el-table-column>
            <el-table-column prop="DebtorName" label="Nombre del Deudor" width="280"></el-table-column>
            <el-table-column prop="DebtAmount" width="80">
                <template slot="header">Monto <br>Adeudado</template>
            </el-table-column>
            <el-table-column prop="OrderFormDate" width="100">
                <template slot="header">Fecha del<br>Pedido</template>
            </el-table-column>
            <el-table-column prop="DebtDuration" width="80">
                <template slot="header">Días de<br>Mora</template>
            </el-table-column>
            <el-table-column prop="SalesmanID" label="Vendedor ID" width="80"> </el-table-column>
            <el-table-column prop="Salesman" label="Nombre del Vendedor" width="195"> </el-table-column>       
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
            totalData:[],      //所有数据
            searchData: [],  //根据条件筛选后数据集
            searchTotal: 0,   //数据个数
            showData:[],    //当前显示的数据
            pageSize:5, //每页展示的数据个数
            currentPage:1,  //当前页
        };
    },

    beforeRouteEnter: (to, from, next) => {
        //alert("进入Debt路由");
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
                //url: "http://localhost:24686/api/debt_daily",   //后端服务器的实际端口
                //url: "http://35.203.42.244:31111/api/debt_daily", //通过ngnix反向代理
                //url: "http://104.225.234.236:31111/api/debt_daily", //通过ngnix反向代理
                url:"/api/debt_daily",
            })
                .then((repos) => {
                    //console.log(repos.data);
                    this.totalData = repos.data;
                    this.searchData = repos.data;
                    this.searchTotal = this.searchData.length;
                    this.changeShowPage()
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
            var fuzzy = this.form.fuzzyQuery.trim()
            if (fuzzy != '') {
                //模糊查询
                this.searchData = [];
                this.totalData.forEach(item => {
                    for (let key in item){
                        if(item[key] == fuzzy){
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
    },
}
</script>

<style></style>
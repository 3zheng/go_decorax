<template>
    <div>
        <!--查询按钮-->
        <el-form :inline="true" ref="form" :model="form">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="模糊查询:">
                        <el-input placeholder="输入条件" v-model="form.fuzzyQuery"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="5">
                    <el-button type="primary" icon="el-icon-search" @click="onSubmit">搜索</el-button>
                    <el-button type="primary" icon="el-icon-s-order" @click="onReset">重置</el-button>
                </el-col>
            </el-row>
        </el-form>
        <!--表格-->
        <el-table :data="showData" border style="width: 100%" size="mini">
            <el-table-column label="序号" width="60">
                <template slot-scope="scope">{{ (currentPage - 1) * pageSize + scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="ID" label="ID" width="100"></el-table-column>
            <el-table-column prop="Name" label="类名" width="400"></el-table-column>
            <el-table-column prop="ProductSuperClass" label="大类" width="200"> </el-table-column>
            <el-table-column prop="ResidualNum" label="库存量(pza)" width="100"> </el-table-column>
            <!--el-table-column prop="InventoryCost" label="库存价值"> </el-table-column>
            <el-table-column prop="SalesQuantity30days" label="近30天销量"> </el-table-column-->
        </el-table>
        <!--分页-->
        <el-form :inline="true">
            <el-row style="margin-top: 10px">
                <el-col :span="8" style="text-align: left; margin-top: 0px">
                    <el-button type="primary" icon="el-icon-back" @click="onPageUp">上一页</el-button>
                    <el-button type="primary" icon="el-icon-right" @click="onPageDown">下一页</el-button>
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
    </div>
</template>

<script>
import table from '@/components/table.vue';
export default {
    name:'InventorySummary',
    data() {
        return {
            form: {  //表单
                fuzzyQuery: '',  //模糊查询条件
            },
            totalData:[],   //所有数据
            searchData: [],  //根据条件筛选后数据集
            searchTotal: 0,   //根据条件筛选后的数据个数
            showData:[],    //当前显示的数据
            pageSize:5, //每页展示的数据个数
            currentPage:1,  //当前页
        };
    },

    beforeRouteEnter: (to, from, next) => {
        alert("进入InventorySummary路由");
        next((vm) => {
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
        getData() {
            this.axios({
                method: "get",
                url: "http://localhost:24686/api/inventory_summary",   //后端服务器的实际端口
                //url: "http://localhost:31111/api/inventory_summary",  //通过ngnix反向代理
            })
                .then((repos) => {
                    console.log(repos.data);
                    this.totalData = repos.data;
                    this.searchData = repos.data;
                    this.searchTotal = this.searchData.length;
                    this.currentPage = 1;
                    this.changeShowPage()
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
            alert("提交搜索表单")
            if (this.form.fuzzyQuery != '') {
                //模糊查询
                this.searchData = [];
                this.totalData.forEach(item => {
                    for (let key in item){
                        if(item[key] == this.form.fuzzyQuery){
                            this.searchData.push(item);
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
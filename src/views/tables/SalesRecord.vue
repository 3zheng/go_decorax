<template>
    <div>
        <!--查询按钮-->
        <el-form :inline="true">
            <el-row :gutter="20">
                <el-col :span="10">
                    <el-form-item label="请输入查询条件:">
                        <el-input placeholder="输入条件"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" icon="el-icon-search">搜索</el-button>
                    <el-button type="primary" icon="el-icon-s-order">重置</el-button>
                </el-col>
                <el-col :span="2">
                    <div class="grid-content bg-purple"></div>
                </el-col>
            </el-row>
        </el-form>
        <!--表格-->
        <el-table :data="showData" border style="width: 100%" size="mini">
            <el-table-column label="序号" width="60">
                <template slot-scope="scope">{{ (currentPage - 1) * pageSize + scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="Name" label="销售员姓名"> </el-table-column>
            <el-table-column prop="SalesDate" label="销售日期" width="80"></el-table-column>
            <el-table-column prop="SalesAmount" label="销售金额" width="80"></el-table-column>            
            <el-table-column prop="OrderFormNum" label="订单数量"> </el-table-column>
        </el-table>
        <!--分页-->
        <el-form :inline="true">
            <el-row style="margin-top: 10px">
                <el-col :span="8" style="text-align: left; margin-top: 0px">
                    <el-button type="primary" icon="el-icon-back" @click="pageUp">上一页</el-button>
                    <el-button type="primary" icon="el-icon-right" @click="pageDown">下一页</el-button>
                </el-col>
                <el-col :span="10" style="text-align: right; margin-top: 0px">
                    <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
                        :current-page="currentPage" :page-sizes="[5, 10, 20, 50]" :page-size="5"
                        layout="total, sizes, prev, pager, next, jumper" :total="total">
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
    name:'SalesRecord',
    data() {
        return {
            tableData: [],  //所有数据
            total: 0,   //数据个数
            showData:[],    //当前显示的数据
            pageSize:5, //每页展示的数据个数
            currentPage:1,  //当前页
        };
    },

    beforeRouteEnter: (to, from, next) => {
        alert("进入SalesRecord路由");
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
                url: "http://localhost:24686/XS1",
            })
                .then((repos) => {
                    console.log(repos.data);
                    this.tableData = repos.data;
                    this.total = this.tableData.length;
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
            this.showData = this.tableData.slice(start, end);
        }
    },
}
</script>

<style></style>
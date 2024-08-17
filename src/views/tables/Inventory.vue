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
            <el-table-column type="index" label="序号" width="60"></el-table-column>
            <el-table-column prop="ID" label="ID" width="80"></el-table-column>
            <el-table-column prop="Name" label="类名" width="80"></el-table-column>
            <el-table-column prop="ProductSuperClass" label="大类"> </el-table-column>
            <el-table-column prop="ProductUnitName" label="单位"> </el-table-column>
            <el-table-column prop="ResidualNum" label="库存量"> </el-table-column>
            <el-table-column prop="InventoryCost" label="库存价值"> </el-table-column>
            <el-table-column prop="SalesQuantity30days" label="近30天销量"> </el-table-column>
            <el-table-column prop="UnsalableScale" label="预计去化月数"> </el-table-column>
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
                        :current-page="currentPage4" :page-sizes="[5, 10, 20, 50]" :page-size="5"
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
    props:['pr1','pr2'],
    name:'inventory',
    data() {
        return {
            pr1:0,
            pr2:'',
            tableData: [],  //所有数据
            total: 0,   //数据个数
            showData:[],    //当前显示的数据
            dataSize:5, //每页展示的数据个数
            currentPage:1,  //当前页
        };
    },

    beforeRouteEnter: (to, from, next) => {
        alert("进入bg1路由");
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
                url: "http://localhost:24686/KC",
            })
                .then((repos) => {
                    alert(repos.data);
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
            this.dataSize = val;
            this.changeShowPage()
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val;
            this.changeShowPage()
        },
        changeShowPage(){
            var start = (this.currentPage-1)*this.dataSize;
            var end = (this.currentPage-1)*this.dataSize + this.dataSize;
            var str = "start="+ start+ " end="+ end
            console.log(str);
            this.showData = this.tableData.slice(start, end);
        }
    },
}
</script>

<style></style>
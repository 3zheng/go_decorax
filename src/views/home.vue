<template>
    <div class="home">
        <el-container>
            <el-header>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item><a href="/">待定</a></el-breadcrumb-item>
                </el-breadcrumb>
            </el-header>
            <el-container>
                <el-aside width="200px">
                    <el-menu default-active="2" class="el-menu-vertical-demo" @open="" @close=""
                        background-color="#545c64" text-color="#fff" active-text-color="#ffd04b">
                        <el-menu-item index="2">
                            <i class="el-icon-menu"></i>
                            <span slot="title">销售情况</span>
                        </el-menu-item>
                        <el-menu-item index="4">
                            <i class="el-icon-menu"></i>
                            <span slot="title">导航四</span>
                        </el-menu-item>
                        <el-submenu index="1">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>重要客户</span>
                            </template>
                            <el-menu-item-group>
                                <template slot="title">分组一</template>
                                <el-menu-item index="1-1">选项1</el-menu-item>
                                <el-menu-item index="1-2">选项2</el-menu-item>
                            </el-menu-item-group>
                            <el-menu-item-group title="分组2">
                                <el-menu-item index="1-3">选项3</el-menu-item>
                            </el-menu-item-group>
                            <el-submenu index="1-4">
                                <template slot="title">选项4</template>
                                <el-menu-item index="1-4-1">选项1</el-menu-item>
                            </el-submenu>
                        </el-submenu>
                        <el-menu-item index="3" disabled>
                            <i class="el-icon-document"></i>
                            <span slot="title">占位</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-container>
                    <el-main>
                        <!---->
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
                        <el-table :data="tableData" border="true" style="width: 100%" size="mini">
                            <el-table-column type="index" label="行号" width="60">
                            </el-table-column>
                            <el-table-column prop="date" label="日期" width="180">
                            </el-table-column>
                            <el-table-column prop="name" label="姓名" width="180">
                            </el-table-column>
                            <el-table-column prop="address" label="地址">
                            </el-table-column>
                        </el-table>
                        <!--分页-->
                        <el-form :inline="true" >
                            <el-row style="margin-top:10px">
                                <el-col :span="10" style="text-align:left; margin-top:0px;">
                                    <el-button type="primary" icon="el-icon-back">上一页</el-button>
                                    <el-button type="primary" icon="el-icon-right">下一页</el-button>
                                </el-col>
                                <el-col :span="12">
                                    <el-pagination background="true" @size-change="handleSizeChange" @current-change="handleCurrentChange"
                                        :current-page.sync="currentPage3" :page-size="100"
                                        layout="prev, pager, next, jumper" :total="1000">
                                    </el-pagination>
                                </el-col>
                            </el-row>
                        </el-form>
                    </el-main>
                    <el-footer style="line-height: 30px; height: 30px;">Footer</el-footer>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>

<script>
// @ is an alias to /src
export default {
    name: 'home',
    data() {
      return {
        tableData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1517 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1519 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1516 弄'
        }]
      }
    },
}
</script>

<style>
.el-breadcrumb {
    padding: 15px;
}

.el-header {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 30px;
    padding: 10px;
}

.el-footer {
    background-color: #B3C0D1;
    color: #333;
    text-align: center;
    line-height: 10px;
}

.el-aside {
    background-color: #545c64;
    color: #333;
    text-align: center;
    line-height: 200px;
}

.el-main {
    background-color: #E9EEF3;
    color: #333;
    /*
    text-align: center;
    line-height: 160px;
    */
}

body>.el-container {
    margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
    line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
    line-height: 320px;
}
</style>
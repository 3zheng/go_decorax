<template>
    <div class="home">
        <el-container>
            <el-header>
                <h1 style="text-align: left;margin-bottom: 10px;">数据查询系统</h1>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
                    <el-breadcrumb-item><a href="/"></a></el-breadcrumb-item>
                </el-breadcrumb>
            </el-header>
            <el-container>
                <el-aside width="230px">
                    <el-menu default-active="1" class="el-menu-vertical-demo" background-color="#545c64"
                        text-color="#fff" active-text-color="#ffd04b">
                        <el-submenu index="1">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>库存</span>
                            </template>
                            <template slot="title"></template>
                            <el-menu-item index="1-2">
                                <i class="el-icon-menu"></i>
                                <span slot="title">
                                    <router-link :to="{ name: 'InventorySummary' }" class = "custom-link" active-class="active-link">库存概要</router-link>
                                </span>
                            </el-menu-item>
                            <el-menu-item index="1-1">
                                <i class="el-icon-menu"></i>
                                <router-link :to="{ name: 'Inventory' }" class = "custom-link" active-class="active-link">按ID仓库排序</router-link>
                                <!--span slot="title">
                                    <router-link :to="{ name: 'Inventory', params: { pr1: 114514, pr2: 'zhendema' } }">按ID仓库排序</router-link>
                                </span-->
                            </el-menu-item>
                        </el-submenu>
                        <el-menu-item index="3">
                            <i class="el-icon-menu"></i>
                            <span slot="title">
                                <router-link :to="{ name: 'Debt' }" class = "custom-link" active-class="active-link">欠款数据</router-link>
                            </span>
                        </el-menu-item>
                        <el-submenu index="4">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>销售</span>
                            </template>
                            <template slot="title"></template>
                            <el-menu-item index="4-1">
                                <i class="el-icon-menu"></i>
                                <span slot="title">
                                    <router-link :to="{ name: 'SalesRecord' }" class = "custom-link" active-class="active-link">销售员日销售数据</router-link>
                                </span>
                            </el-menu-item>
                            <el-menu-item index="4-2">
                                <i class="el-icon-menu"></i>
                                <span slot="title">
                                    <router-link :to="{ name: 'SalesSummary' }" class = "custom-link" active-class="active-link">销售员总销售数据</router-link>
                                </span>
                            </el-menu-item>
                            <el-menu-item index="4-3">
                                <i class="el-icon-menu"></i>
                                <span slot="title">
                                    <router-link :to="{ name: 'InventorySales' }" class = "custom-link" active-class="active-link">产品近30天销量</router-link>
                                </span>
                            </el-menu-item>
                            
                        </el-submenu>
                        <el-submenu index="9">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>重要客户</span>
                            </template>
                            <template slot="title"></template>
                            <el-menu-item index="9-1">重要客户</el-menu-item>
                            <el-menu-item index="9-2">新增的重要客户</el-menu-item>
                            <el-menu-item index="9-3">丢失的重要客户</el-menu-item>
                        </el-submenu>
                        <el-menu-item index="99" disabled>
                            <i class="el-icon-document"></i>
                            <span slot="title">占位</span>
                        </el-menu-item>
                    </el-menu>
                </el-aside>
                <el-container>
                    <el-main>
                        <router-view></router-view>
                    </el-main>
                    <el-footer style="line-height: 30px; height: 30px">Created by Vue</el-footer>
                </el-container>
            </el-container>
        </el-container>
    </div>
</template>


<script>
import table from '@/components/table.vue'
// @ is an alias to /src
export default {
    name: "home",
};
</script>

<style>
.el-breadcrumb {
    padding: 15px;
}

.el-header {
    background-color: #b3c0d1;
    color: #333;
    text-align: center;
    line-height: 30px;
    padding: 10px;
}

.el-footer {
    background-color: #b3c0d1;
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
    background-color: #e9eef3;
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

.custom-link {
    color: white; /* 修改链接颜色 */
    text-decoration: none; /* 去掉下划线 */
}

.active-link {
    color: rgb(25, 244, 36); /* 修改链接颜色 */
    text-decoration: none; /* 去掉下划线 */
}

</style>
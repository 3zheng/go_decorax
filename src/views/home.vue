<template>
    <div class="home">
        <el-container>
            <el-header>
                <!--数据查询系统-->
                <h1 style="text-align: left;margin-bottom: 10px;">Sistema de consulta de datos</h1>
                <el-breadcrumb separator="/">
                    <el-breadcrumb-item :to="{ path: '/' }">Inicio</el-breadcrumb-item>
                    <el-breadcrumb-item><a href="/"></a></el-breadcrumb-item>
                </el-breadcrumb>
            </el-header>
            <el-container>
                <el-aside width="265px">
                    <el-menu default-active="1" class="el-menu-vertical-demo" background-color="#545c64"
                        text-color="#fff" active-text-color="#ffd04b" style="text-align: left;">
                        <el-submenu index="1">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>Inventario</span>
                            </template>
                            <template slot="title"></template>
                            <el-menu-item index="1-2">
                                <i class="el-icon-menu"></i>
                                <span slot="title">
                                    <!--库存总览-->
                                    <router-link :to="{ name: 'InventorySummary' }" class="custom-link" active-class="active-link">
                                        Resumen De Inventario&nbsp;
                                    </router-link>
                                </span>
                            </el-menu-item>
                            <el-menu-item index="1-1">
                                <i class="el-icon-menu"></i>
                                <!--各个仓库库存-->
                                <router-link :to="{ name: 'Inventory' }" class="custom-link" active-class="active-link">
                                    Inventario De Cada Almacén
                                </router-link>
                                <!--span slot="title">
                                    <router-link :to="{ name: 'Inventory', params: { pr1: 114514, pr2: 'zhendema' } }">按ID仓库排序</router-link>
                                </span-->
                            </el-menu-item>
                            <el-menu-item index="1-3">
                                <i class="el-icon-menu"></i>
                                <!--Santa Cruz库存-->
                                <span slot="title">
                                    <router-link :to="{ name: 'InventorySCZ' }" class="custom-link" active-class="active-link">
                                        Santa Cruz Inventario&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    </router-link>
                                </span>
                            </el-menu-item>
                            <el-menu-item index="1-4">
                                <i class="el-icon-menu"></i>
                                <span slot="title">
                                    <router-link :to="{ name: 'InventoryLPZ' }" class="custom-link"
                                        active-class="active-link">
                                        La Paz Inventario&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    </router-link>
                                </span>
                            </el-menu-item>
                            <el-menu-item index="1-5">
                                <i class="el-icon-menu"></i>
                                <span slot="title">
                                    <router-link :to="{ name: 'InventoryCBB' }" class="custom-link"
                                        active-class="active-link">
                                        Cochabamba Inventario&nbsp;&nbsp;
                                    </router-link>
                                </span>
                            </el-menu-item>
                        </el-submenu>
                        <el-menu-item index="3">
                            <i class="el-icon-menu"></i>
                            <span slot="title">
                                <router-link :to="{ name: 'Debt' }" class="custom-link" active-class="active-link">
                                    Detalle De La Deuda&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                </router-link>
                            </span>
                        </el-menu-item>
                        <el-submenu index="4">
                            <template slot="title">
                                <i class="el-icon-location"></i>
                                <span>Venta</span>
                            </template>
                            <template slot="title"></template>
                            <el-menu-item index="4-1">
                                <i class="el-icon-menu"></i>
                                <span slot="title" class="menu-title">
                                    <!--销售员日销售数据-->
                                    <router-link :to="{ name: 'SalesRecord' }" class="custom-link" active-class="active-link">
                                        Datos De Ventas <br>Diarias Del Vendedor
                                    </router-link>
                                </span>
                            </el-menu-item>
                            <el-menu-item index="4-2">
                                <i class="el-icon-menu"></i>
                                <span slot="title" class="menu-title">
                                    <!--销售员月销售数据-->
                                    <router-link :to="{ name: 'SalesSummary' }" class="custom-link" active-class="active-link">
                                        Datos De Ventas <br>Mensuales Del Vendedor
                                    </router-link>
                                </span>
                            </el-menu-item>
                            <el-menu-item index="4-3">
                                <i class="el-icon-menu"></i>
                                <span slot="title">
                                    <!--各产品最近30日销售数据-->
                                    <router-link :to="{ name: 'InventorySales' }" class="custom-link" active-class="active-link">
                                        Ventas De Productos En<br>Los últimos 30 Días
                                    </router-link>
                                </span>
                            </el-menu-item>
                        </el-submenu>
                        <el-submenu index="9" disabled>
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
                            <span slot="title"></span>
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

<style scoped>
.el-breadcrumb {
    padding: 15px;
}

/*从el-submenu__title到el-menu-item的样式是为了文本内容过长时换行*/

.el-submenu__title {
  display: flex;
  align-items: center;
}
.el-submenu__title span{
  white-space: normal;
  word-break: break-all;
  line-height: 20px;
  flex: 1;
  padding-right: 20px;
}
 
.el-menu-item {
  display: flex;
  align-items: center;
  padding-right: 20px!important;
}
.el-menu-item span {
  white-space: normal;
  word-break: break-all;
  line-height: 20px;
  flex: 1;
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
    line-height: 1; /* 根据需要调整行高 */
}

.active-link {
    color: rgb(25, 244, 36); /* 修改链接颜色 */
    text-decoration: none; /* 去掉下划线 */
}

</style>
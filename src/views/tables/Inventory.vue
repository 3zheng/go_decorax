<template>
    <div>
        <!--查询按钮-->
        <el-form :inline="true" ref="form" :model="form">
            <el-row>
                <el-col :span="8">
                    <el-form-item label="Buscar:">
                        <el-input placeholder="Palabras Clave De Entrada" v-model="form.fuzzyQuery" @keyup.enter.native="onSubmit"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="6">
                    <el-button type="primary" icon="el-icon-search" @click="onSubmit">Buscar</el-button>
                    <el-button type="primary" icon="el-icon-s-order" @click="onReset">Reiniciar</el-button>
                </el-col>
                <el-col :span="10">
                    <el-form-item label="Búsqueda Precisa:">
                        <el-input placeholder="Producto ID" v-model="form.ID" style="width: 105px;"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-input placeholder="Almacén Nombre" class="custom-input" v-model="form.WarehouseName" style="width: 140px;"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!--表格-->
        <el-table :data="showData" border style="width: 100%" size="mini">
            <el-table-column label="Número De Serie" width="70">
                <template slot="header">Número<br>de Serie</template>
                <template slot-scope="scope">{{ (currentPage - 1) * pageSize + scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="ID" label="ID" width="160"></el-table-column>
            <el-table-column prop="Name" label="Subcategoría" width="300"></el-table-column>
            <el-table-column prop="ProductSuperClass" label="Categoría" width="150"> </el-table-column>
            <el-table-column prop="ResidualNum" width="110">
                <template slot="header">Cantidad de<br>Inventario(pza)</template>
            </el-table-column>
            <el-table-column prop="WarehouseName" label="Almacén Nombre" width="180"> </el-table-column>
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
    //props: ['pr1', 'pr2'],
    name: 'inventory',
    data() {
        return {
            form: {  //表单
                fuzzyQuery: '',  //模糊查询条件
                ID: '',  //产品ID
                WarehouseName: '',//仓库名称
            },
            progress: 0,    //进度条进度 0-100
            showProgress: true, //是否显示进度条
            customColors: [
                {color: '#e6a23c', percentage: 80},  //橙色
                {color: '#67c23a', percentage: 100},    //绿色
            ],
            //pr1: 0,
            //pr2: '',
            isGetall: false,   //是否已经获取了全部数据，避免全部获取的数据先到，部分获取的数据覆盖了全部获取
            totalData: [],  //从后台获取的所有数据
            searchData: [],  //根据查询条件筛选后获得的数据
            searchTotal: 0,   //数据个数
            searchData: [],  //根据搜索条件获得的数据
            showData: [],    //当前显示的数据
            pageSize: 5, //每页展示的数据个数
            currentPage: 1,  //当前页
        };
    },

    beforeRouteEnter: (to, from, next) => {
        //alert("进入bg1路由");
        next((vm) => {
            vm.isGetall = false
            vm.startProgress();
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
                //url: "http://localhost:24686/api/inventory_warehouse",//后端服务器的实际端口
                //url: "http://35.203.42.244:31111/api/inventory_warehouse",  //通过ngnix反向代理
                //url: "http://104.225.234.236:31111/api/inventory_warehouse", //通过ngnix反向代理
                url:"/api/inventory_warehouse",
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
                    this.progress += 20;
                })
                .catch((error) => {
                    //alert('axios错误')
                    console.log(error);
                });
        },
        getAllData(){
            this.axios({
                method: "get",
                //url: "http://localhost:24686/api/inventory_warehouse",//后端服务器的实际端口
                //url: "http://35.203.42.244:31111/api/inventory_warehouse",  //通过ngnix反向代理
                //url: "http://104.225.234.236:31111/api/inventory_warehouse", //通过ngnix反向代理
                url:"/api/inventory_warehouse",
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
        changeShowPage() {
            var start = (this.currentPage - 1) * this.pageSize;
            var end = (this.currentPage - 1) * this.pageSize + this.pageSize;
            var str = "start=" + start + " end=" + end
            console.log(str);
            this.showData = this.searchData.slice(start, end);
        },
        onSubmit() {
            //alert("提交搜索表单")
            var fuzzy = this.form.fuzzyQuery.trim()
            var ID = this.form.ID.trim()
            var WarehouseName = this.form.WarehouseName.trim()
            if (ID != '' || WarehouseName != '') {
                //alert(`进入精准搜索：ID=${ID},WarehouseName=${WarehouseName}`)
                //优先精准查询
                var keyArr = new Array();
                var obj = {};
                //把查询条件放入数组中
                if (ID != '') {
                    obj['ID'] = ID;
                    keyArr.push(obj);
                }
                if (WarehouseName != '') {
                    obj['WarehouseName'] = WarehouseName;
                    keyArr.push(obj);
                }
                var output = '';
                for (const [key, value] of Object.entries(obj)) {
                    output = output + `${key}:${value}`;
                }
                //alert(`条件数组：${output}`);
                //先清空条件筛选的所有数据
                this.searchData = [];
                this.totalData.forEach(item => {
                    var isFound = true;
                    //根据输入的查询条件进行逐一比对，如果输入了多项条件就必须同时符合多项条件时才算找到
                    keyArr.forEach(condition => {
                        for (let key in condition) {
                            if (condition[key] != item[key]) {
                                //一假全假，只要有一项不匹配直接跳出循环
                                isFound = false;
                                break;
                            }
                        }
                    })
                    //如果找到了数据
                    if (isFound) {
                        output = '';
                        for (const [key, value] of Object.entries(item)) {
                            output = output + `${key}:${value}`
                        }
                        console.log(`找到了数据:${output}`);
                        this.searchData.push(item);
                    }
                });
            } else if (fuzzy != '') {
                //模糊查询
                this.searchData = [];
                this.totalData.forEach(item => {
                    for (let key in item) {
                        if (item[key] == fuzzy) {
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
        onPageUp() {
            if (this.currentPage > 1) {
                this.handleCurrentChange(this.currentPage - 1)
            }
        },
        onPageDown() {
            if (this.currentPage * this.pageSize < this.searchTotal) {
                this.handleCurrentChange(this.currentPage + 1)
            }
        },
    },
}
</script>

<style scoped>

.custom-input.el-input__inner {
  font-size: 14px; /* 根据需要调整字体大小 */
}

</style>
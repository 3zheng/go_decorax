<template>
  
</template>

<script>
export default {
    name:'table',
    data() {
        return {
            pr1:0,
            pr2:'',
            searchData: [],  //所有数据
            total: 0,   //数据个数
            showData:[],    //当前显示的数据
            pageSize:5, //每页展示的数据个数
            currentPage:1,  //当前页
        };
    },

    beforeRouteEnter: (to, from, next) => {
        //alert("进入bg1路由");
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
                    //alert(repos.data);
                    console.log(repos.data);
                    this.searchData = repos.data;
                    this.total = this.searchData.length;
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
        }
    },
}
</script>

<style>

</style>
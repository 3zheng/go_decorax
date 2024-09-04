<template>
    <div>
        <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" class="login-box">
            <el-form-item label="User Name" prop="userName">
                <!--el-input v-model.number="ruleForm.age"></el-input-->
                <el-input v-model.number="ruleForm.userName"></el-input>
            </el-form-item>
            <el-form-item label="Password" prop="passwd">
                <el-input type="password" v-model="ruleForm.passwd" autocomplete="off"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" class="my-button" @click="submitForm('ruleForm')">
                  &nbsp;&nbsp;&nbsp;LOGIN&nbsp;&nbsp;&nbsp;
                </el-button>
                <!--el-button @click="resetForm('ruleForm')">重置</el-button-->
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
export default {
    name: 'login',
    data(){
        var checkAge = (rule, value, callback) => {
        if (!value) {
          return callback(new Error('年龄不能为空'));
        }
        setTimeout(() => {
          if (!Number.isInteger(value)) {
            callback(new Error('请输入数字值'));
          } else {
            if (value < 18) {
              callback(new Error('必须年满18岁'));
            } else {
              callback();
            }
          }
        }, 1000);
      };
      var validatePass = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请输入密码'));
        } else {
          if (this.ruleForm.checkPass !== '') {
            this.$refs.ruleForm.validateField('checkPass');
          }
          callback();
        }
      };
      return {
        ruleForm: {
          pass: '',
          userName: '',
        },
        rules: {
          pass: [
            { validator: validatePass, trigger: 'blur' }
          ],
          age: [
            { validator: checkAge, trigger: 'blur' }
          ]
        }
      };
    },
    methods:{
        submitForm(formName) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            alert('submit!');
          } else {
            console.log('error submit!!');
            return false;
          }
        });
      },
      resetForm(formName) {
        this.$refs[formName].resetFields();
      },
    },
}
</script>

<style scoped>
.login-box {
    width: 400px;
    margin: 100px auto;
    border: 1px solid #DCDFE6;
    padding: 20px;
    border-radius: 5px;
    box-shadow: 0 0 30px #EBEEF5;
}

.login-title {
    text-align: center;
}

.my-button {
  width: 250px;
}
</style>
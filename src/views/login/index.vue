<template>
    <div class="login">
        <div class="login-box">
            <!-- 头像 -->
            <div class="avatar-box">
                <img src="./mentos.jpg" alt="">
            </div>

            <el-form :model="loginForm" :rules="rules" label-width="0px" class="login_form" ref="loginRef">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-user"  autofocus="true" v-model="loginForm.username"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input prefix-icon="iconfont icon-3702mima" type="password" v-model="loginForm.password"></el-input>
                </el-form-item>
                <!-- 按钮区域 -->
                <el-form-item class="btns">
                    <el-button type="primary">登录</el-button>
                    <el-button type="info" @click="resetForm">重置</el-button>
                </el-form-item>
            </el-form>

        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                 loginForm: {
                     username: '王诛魔',
                     password: '123456'
                 },
                 rules: {
                      username: [
                        { required: true, message: '请输入用户名', trigger: 'blur' },
                        { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                      ],
                      password: [
                        { required: true, message: '请输入密码', trigger: 'blur' },
                        { min: 6, max: 16, message: '长度在 6 到 16 个字符', trigger: 'blur' }
                      ]
                 }
            }
        },
        methods: {
            resetForm() {
                this.$refs.loginRef.resetFields();
                this.loginForm.username = this.loginForm.password = '';
            }
        }
    }
</script>

<style lang="less" scoped>
    .login {
        height: 100%;
        background-color: #2b4b6b;

        .login-box {
            background-color: white;
            width: 450px;
            height: 300px;
            border-radius: 3px;
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);

            .avatar-box {
                height: 130px;
                width: 130px;
                border: 1px solid #eee;
                border-radius: 50%;
                padding: 10px;
                box-shadow: 0 0 10px #ddd;
                position: absolute;
                left: 50%;
                transform: translate(-50%, -50%);
                background-color: #fff;

                img {
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background-color: #eee;
                }
            }

            .login_form {
                position: absolute;
                bottom: 0;
                width: 100%;
                padding: 0 20px;
                box-sizing: border-box;
            }

            .btns {
                display: flex;
                justify-content: flex-end;
            }
        }
    }
</style>

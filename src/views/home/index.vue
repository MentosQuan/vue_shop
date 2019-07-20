<template>
  <el-container class="home">
    <el-header><img src="../login/mentos.jpg" alt="" width="50px" @click="changeColl"><span>管理中心</span>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <el-container>
      <el-aside :width="width">
        <el-menu :default-active="activePath" background-color="#333744" text-color="#fff" active-text-color="skyblue"
          unique-opened :collapse="isCollapse" :collapse-transition="false" router>
          <el-submenu :index="menu.id + ''" v-for="menu in menus" :key="menu.id">
            <template slot="title">
              <i :class="icoList[menu.id]"></i>
              <span>{{ menu.authName }}</span>
            </template>
            <el-menu-item :index="'/' + subMenu.path" v-for="subMenu in menu.children" :key="subMenu.id" @click="saveNavPath('/' + subMenu.path)">
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{ subMenu.authName }}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
  export default {
    data() {
      return {
        menus: [],
        icoList: {
          '125': 'iconfont icon-user',
          '103': 'iconfont icon-users',
          '101': 'iconfont icon-shangpin',
          '102': 'iconfont icon-danju',
          '145': 'iconfont icon-baobiao'
        },
        isCollapse: false,
        activePath: '/user'
      }
    },
    created() {
      this.getMenus()
      this.comeIn()
      this.activePath = sessionStorage.getItem('activePath')
    },
    methods: {
      logout() {
        this.$confirm('确定需要退出登录吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$message({
            type: 'success',
            message: '退出成功!'
          });
          // 退出登录之后清除本地存储的token以及用户名，并同时跳转到登录界面
          sessionStorage.clear();
          this.$router.push('/login')
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消退出'
          });
        });
      },
      async getMenus() {
        const {
          data: {
            data,
            meta
          }
        } = await this.$http.get('menus')
        if (meta.status !== 200) return this.$message.error(meta.msg)
        this.menus = data;
      },
      changeColl() {
        this.isCollapse = !this.isCollapse
      },
      comeIn() {
        // 从sessionstorage中取出用户名给予登录提示
        const uernameSs = sessionStorage.getItem('username');
        // this.$message.success('欢迎' + uernameSs + '用户登录');
        this.$message({
          message: '欢迎' + uernameSs + '用户登录',
          center: true,
          type: 'success'
        });
      },
      saveNavPath(path) {
        sessionStorage.setItem('activePath', path)
      }
    },
    computed: {
      width() {
        return this.isCollapse ? '64px' : '200px'
      }
    }
  }
</script>

<style lang="less" scoped>
  .home {
    height: 100%;

    .el-header {
      background-color: #373d41;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 7px;

      .el-button {
        transition: all .5s;
      }

      .el-button:hover {
        background-color: rgba(255, 0, 0, 1);
      }

      img {
        cursor: pointer;
      }

      span {
        color: #E9EEEA;
        font-size: 26px;
        font-weight: bold;
      }
    }

    .el-aside {
      background-color: #333744;
      transition: all 0.5s;

      .el-menu {
        border-right: none;
      }
    }

    .el-main {
      background-color: #eaedfe;
    }
  }

  .iconfont {
    margin-right: 10px;
    margin-left: 2px;
  }

  .changBtn {
    width: 200px;
    height: 30px;
    background-color: #333744;
    border: 1px solid white;
    box-sizing: border-box;
  }
</style>

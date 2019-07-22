<template>
  <div class="users">
    <!-- 面包屑导航 -->
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</a></el-breadcrumb-item>
      <el-breadcrumb-item :to="{ path: '/users' }">用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 页面卡片区内容 -->
    <el-card class="box-card">
      <el-row :gutter="20">
        <el-col :span="10">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUsers">
            <el-button slot="append" icon="el-icon-search" @click="getUsers"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisible = true">添加</el-button>
        </el-col>
      </el-row>
      <!-- 用户信息表格 -->
      <el-table :data="users" stripe border>
        <el-table-column type="index">
        </el-table-column>
        <el-table-column prop="username" label="姓名" width="180">
        </el-table-column>
        <el-table-column prop="email" label="邮箱" width="180">
        </el-table-column>
        <el-table-column prop="mobile" label="电话">
        </el-table-column>
        <el-table-column prop="role_name" label="角色">
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.mg_state" @change="changeState(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" :id="scope.row.id" @click="showEditDialog(scope.row.id)"></el-button>
            <el-button type="danger" icon="el-icon-delete" :id="scope.row.id" @click="deleteUser(scope.row.id)"></el-button>
            <el-tooltip class="item" effect="dark" content="权限设置" placement="top" :enterable="false">
              <el-button type="warning" icon="el-icon-setting" @click="changeRight(scope.row)">
              </el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 4, 6]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="total">
      </el-pagination>
    </el-card>
    <!-- 弹出框 -->
    <el-dialog title="提示" :visible.sync="addDialogVisible" width="50%" @close="clearDialogVisible">
      <el-form :model="register" :rules="rules" label-width="70px" class="login_form" ref="addFormRef">
        <!-- 用户名 -->
        <el-form-item prop="username" label="名称">
          <el-input autofocus="true" v-model="register.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password" label="密码">
          <el-input type="password" v-model="register.password"></el-input>
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="register.email"></el-input>
        </el-form-item>
        <el-form-item prop="mobile" label="电话">
          <el-input v-model="register.mobile" maxlength="11"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUsers">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改用户 -->
    <el-dialog title="提示" :visible.sync="editDialogVisible" width="50%" @close="editDialogClose">
      <el-form :model="editForm" :rules="rules" label-width="70px" class="login_form" ref="editFormRef">
        <!-- 用户名 -->
        <el-form-item prop="username" label="名称">
          <el-input autofocus="true" v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <!-- 邮箱 -->
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <!-- 电话 -->
        <el-form-item prop="mobile" label="电话">
          <el-input v-model="editForm.mobile" maxlength="11"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUsers(editForm.id)">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 修改权限 -->
    <el-dialog title="提示" :visible.sync="rightsDialog" width="50%">
      <div>
        <p>当前的用户：{{ userInfo.username }}</p>
        <p>当前的角色：{{ userInfo.role_name }}</p>
        <p>分配新角色：
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option v-for="item in rolesList" :key="item.id" :label="item.roleName" :value="item.id">
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer">
        <el-button >取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      // 邮箱 电话的正则验证
      var checkEmail = (rule, value, cb) => {
        const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/

        if (regEmail.test(value)) {
          return cb()
        }
        cb(new Error('请输入合法的邮箱'))
      }
      var checkMobile = (rule, value, cb) => {
        const regMobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/

        if (regMobile.test(value)) {
          return cb()
        }

        cb(new Error('请输入合法的手机号'))
      }
      return {
        // 添加用户信息表单数据
        register: {
          username: '',
          password: '',
          email: '',
          mobile: ''
        },
        // 定义验证表单规则
        rules: {
          username: [{
              required: true,
              message: '请输入用户名',
              trigger: 'blur'
            },
            {
              min: 3,
              max: 5,
              message: '长度在 3 到 5 个字符',
              trigger: 'blur'
            }
          ],
          password: [{
              required: true,
              message: '请输入密码',
              trigger: 'blur'
            },
            {
              min: 6,
              max: 16,
              message: '长度在 6 到 16 个字符',
              trigger: 'blur'
            }
          ],
          email: [{
              required: true,
              message: '请输入邮箱',
              trigger: 'blur'
            },
            {
              validator: checkEmail,
              trigger: 'blur'
            }
          ],
          mobile: [{
              required: true,
              message: '请输入电话',
              trigger: 'blur'
            },
            {
              validator: checkMobile,
              trigger: 'blur'
            }
          ]
        },
        users: [],
        total: 0,
        // 分页的数据对象
        queryInfo: {
          // 查询当前页
          query: '',
          // 当前页
          pagenum: 1,
          // 页面显示最大条数
          pagesize: 2
        },
        // 控制添加用户弹出框的显示隐藏
        addDialogVisible: false,
        // 控制修改用户信息弹出框的显示隐藏
        editDialogVisible: false,
        // 修改用户信息的表单数据
        editForm: {},
        // 修改权限弹出框显示隐藏
        rightsDialog: false,
        userInfo: {},
        rolesList: [],
        selectedRoleId: ''
      }
    },
    created() {
      // 数据创建是调用获取用户的数据
      this.getUsers()
    },
    methods: {
      // 获取用户数据
      async getUsers() {
        const {
          data: {
            data,
            meta
          }
        } = await this.$http.get('users', {
          params: this.queryInfo
        })
        if (meta.status !== 200) return this.$message({
            message: meta.msg,
            center: true,
            type: 'error'
          })
        this.users = data.users
        this.total = data.total
      },
      // 改变页面显示条数
      handleSizeChange(newPage) {
        this.queryInfo.pagesize = newPage
        this.getUsers()
      },
      // 切换到指定页面
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getUsers()
      },
      // 改变用户状态
      async changeState(info) {
        const {
          data: {
            data,
            meta
          }
        } = await this.$http.put(`users/${info.id}/state/${info.mg_state}`)
        if (meta.status !== 200) {
          info.mg_state = !info.mg_state
          return this.$message({
            message: meta.msg,
            center: true,
            type: 'error'
          });
        }
        this.$message({
          message: meta.msg,
          center: true,
          type: 'success'
        });
      },
      // 关闭添加用户弹出框时清除对应表单数据
      clearDialogVisible() {
        this.$refs.addFormRef.resetFields()
      },
      // 添加用户
      addUsers() {
        this.$refs.addFormRef.validate(async vail => {
          if (!vail) return
          const {
            data: {
              data,
              meta
            }
          } = await this.$http.post('users', this.register)
          if (meta.status !== 201) return this.$message({
            message: meta.msg,
            center: true,
            type: 'error'
          })
          this.$message({
            message: meta.msg,
            center: true,
            type: 'success'
          })
          this.addDialogVisible = false
          this.getUsers()
        })
      },
      // 点击弹出修改用户信息弹出框，并获取对应的用户信息填入表单
      async showEditDialog(id) {
        this.editDialogVisible = true
        const {
          data: {
            data,
            meta
          }
        } = await this.$http.get(`users/${ id }`)
        if (meta.status !== 200) return this.$message({
          message: meta.msg,
          center: true,
          type: 'error'
        })
        this.editForm = data
      },
      // 根据表单id将表单的数据提交后台，修改用户信息
      async editUsers(id) {
        this.$refs.editFormRef.validate(async vail => {
          if (!vail) return
          const {
            data: {
              data,
              meta
            }
          } = await this.$http.put(`users/${ id }`, this.editForm)
          if (meta.status !== 200) return this.$message({
            message: meta.msg,
            center: true,
            type: 'error'
          })
          this.$message({
            message: meta.msg,
            center: true,
            type: 'success'
          })
          this.getUsers()
          this.editDialogVisible = false
        })
      },
      // 修改用户弹出框隐藏时清除对应表单内容
      editDialogClose() {
        this.$refs.editFormRef.resetFields()
      },
      // 删除用户
      deleteUser(id) {
        this.$confirm('确定需要删除吗', '警告', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {
            data: {
              meta
            }
          } = await this.$http.delete(`users/${id}`)
          if (meta.status !== 200) return this.$message({
            message: meta.msg,
            center: true,
            type: 'error'
          })
          this.$message({
            message: meta.msg,
            center: true,
            type: 'success'
          })
          this.getUsers()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除',
            center: true
          });
        });
      },
      // 点击显示权限分配弹出框
      async changeRight(row) {
        this.userInfo = row
        this.rightsDialog = true
        const { data: { data, meta } } = await this.$http.get('roles')
        if (meta.status !== 200) {
          return this.$message.error('获取角色列表失败！')
        }
        console.log(data)
        this.rolesList = data
        console.log(this.rolesList)
      },
      }
  }
</script>

<style>
</style>

<template>
  <div class="roles">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加角色</el-button>
        </el-col>
      </el-row>
      <el-table :data="roles" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row v-for="(item1,index1) in scope.row.children" :key="item1.id" :class="['bdborder',index1 === 0 ? 'btborder' : '','row-center']">
              <el-col :span="5">
                <el-tag closable @close="removeRights(scope.row,item1.id)">{{ item1.authName }}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <el-col :span="19">
                <el-row v-for="(item2,index2) in item1.children" :key="item2.id" :class="[index2 !== 0 ? 'btborder' : '','row-center']">
                  <el-col :span="6">
                    <el-tag type="success" closable @close="removeRights(scope.row,item2.id)">{{ item2.authName }}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <el-col :span="18">
                    <el-tag type="warning" v-for="(item3,index3) in item2.children" :key="item3.id" closable @close="removeRights(scope.row,item3.id)">{{ item3.authName }}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>
        <el-table-column type="index"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" @click="showRightList(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <el-dialog title="提示" :visible.sync="showDialog" width="50%" @close="resetRightlist">
      <!-- 如果需要默认点选一部分复选框的时候 需要通过绑定node-key="id" 来区别每一个复选框 ref=""用来暴露当前的组件-->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" :default-checked-keys="rightsId"
        default-expand-all ref="treeRef"></el-tree>
      <span slot="footer">
        <el-button @click="showDialog = false">取 消</el-button>
        <el-button type="primary" @click="addRights(roleId)">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 所有角色列表
        roles: [],
        showDialog: false,
        // 获取所有权限的列表
        rightsList: [],
        // 树形控件的属性绑定对象
        treeProps: {
          label: 'authName',
          children: 'children'
        },
        // 权限ID数组
        rightsId: [],
        roleId: 0
      }
    },
    created() {
      this.getRoles()
    },
    methods: {
      // 获取所有角色列表
      async getRoles() {
        const {
          data: {
            data,
            meta
          }
        } = await this.$http.get('roles')
        if (meta.status !== 200) return this.$message({
          message: meta.msg,
          center: true,
          type: 'error'
        })
        this.roles = data
      },
      removeRights(role, rightId) {
        // const = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
        this.$confirm('确定需要删除吗', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(async () => {
          const {
            data: {
              data,
              meta
            }
          } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
          if (meta.status !== 200) return this.$message({
            type: 'error',
            message: '删除失败!',
            center: true
          });
          this.$message({
            type: 'success',
            message: '删除成功!',
            center: true
          });
          role.children = data
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除!',
            center: true
          });
        });
      },
      // 获取所有的权限
      async showRightList(row) {
        this.roleId = row.id
        this.showDialog = true
        const {
          data: {
            data,
            meta
          }
        } = await this.$http.get('rights/tree')
        if (meta.status !== 200) return this.$message({
          type: 'error',
          message: meta.msg,
          center: true
        });
        this.rightsList = data
        this.getOwnRights(row, this.rightsId)
      },
      // 递归将所有拥有的权限push进去数组
      getOwnRights(row, arr) {
        if (!row.children) return arr.push(row.id)
        row.children.forEach(item => this.getOwnRights(item, arr))
      },
      // 关闭弹出框的时候将原本数组清空 防止数据累积
      resetRightlist() {
        this.rightsId = []
      },
      // 点选添加权限
      async addRights(id) {
        const key = [
          ...this.$refs.treeRef.getCheckedKeys(),
          ...this.$refs.treeRef.getHalfCheckedKeys()
        ]
        const rids = key.join(',')
        const {
          data: {
            data,
            meta
          }
        } = await this.$http.post(`roles/${this.roleId}/rights`, {
          rids: rids
        })
        if (meta.status !== 200) return this.$message({
          type: 'error',
          message: meta.msg,
          center: true
        });
        this.$message({
          type: 'success',
          message: meta.msg,
          center: true
        });
        this.showDialog = false
        this.getRoles()
      }
    }
  }
</script>

<style scoped>
  .el-tag {
    margin: 7px;
  }

  .bdborder {
    border-bottom: 1px solid #ccc;
  }

  .btborder {
    border-top: 1px solid #ccc;
  }

  .row-center {
    display: flex;
    align-items: center;
  }
</style>

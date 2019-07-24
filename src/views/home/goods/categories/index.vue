<template>
  <!-- 面包屑导航 -->
  <div class="categories">
    <el-breadcrumb separator="/">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</a></el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showClassDialog">添加分类</el-button>
        </el-col>
      </el-row>
      <tree-table :data="catelist" :columns="columns" :selection-type="false" :expand-type="false" show-index
        index-text="#" border>
        <!-- 是否有效 -->
        <template slot="isok" slot-scope="scope">
          <i class="el-icon-circle-check" v-if="scope.row.cat_deleted === false"></i>
          <i class="el-icon-circle-check" v-else></i>
        </template>
        <!-- 排序 -->
        <template slot="order" slot-scope="scope">
          <el-tag v-if="scope.row.cat_level === 0">一级</el-tag>
          <el-tag type="success" v-else-if="scope.row.cat_level === 1">二级</el-tag>
          <el-tag type="warning" v-else>三级</el-tag>
        </template>
        <!-- 操作 -->
        <template slot="todo" slot-scope="scope">
          <el-button type="primary">
            <i class="el-icon-edit"></i>
            编辑</el-button>
          <el-button type="danger">
            <i class="el-icon-delete"></i>
            删除</el-button>
        </template>
      </tree-table>
      <!-- 分页 -->
      <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="queryInfo.pagenum"
      :page-sizes="[3, 5, 10, 15]"
      :page-size="queryInfo.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
    <!-- 添加分类 -->
    <el-dialog title="提示" :visible.sync="classDialog" width="50%">
      <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
          <el-input v-model="addCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：">
          <!-- options 用来指定数据源 -->
          <!-- props 用来指定配置对象 -->
          <el-cascader expand-trigger="hover" :options="parentCateList" :props="cascaderProps" v-model="selectedKeys" @change="parentCateChanged" clearable change-on-select>
          </el-cascader>
        </el-form-item>
      </el-form>
      <span slot="footer">
        <el-button>取 消</el-button>
        <el-button type="primary">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        catelist: [],
        // 请求列表参数
        queryInfo: {
          type: 3,
          pagenum: 1,
          pagesize: 5
        },
        // 总数据条数
        total: 0,
        columns: [{
            label: '分类名称',
            prop: 'cat_name',
          },
          {
            label: '是否有效',
            type: 'template',
            template: 'isok'
          },
          {
            label: '排序',
            type: 'template',
            template: 'order'
          },
          {
            label: '操作',
            type: 'template',
            template: 'todo'
          }
        ],
        // 控制添加分类的显示
        classDialog: false,
        // 添加分类的表单数据
        addCateForm: {
          // 将要添加的分类的名称
          cat_name: '',
          // 父级分类的Id
          cat_pid: 0,
          // 分类的等级，默认要添加的是1级分类
          cat_level: 0
        },
        // 父级分类列表
        parentCateList: [],
        // 添加分类表单的验证规则对象
        addCateFormRules: {
          cat_name: [{ required: true, message: '请输入分类名称', trigger: 'blur' }]
        },
        // 指定级联选择器的配置对象
        cascaderProps: {
          value: 'cat_id',
          label: 'cat_name',
          children: 'children'
        },
        // 选中的父级分类的Id数组
        selectedKeys: []
      }
    },
    created() {
      this.getCateList()
    },
    methods: {
      async getCateList() {
        const {
          data: {
            data,
            meta
          }
        } = await this.$http.get('categories', {
          params: this.queryInfo
        })
        if (meta.status !== 200) return this.$message({
          message: meta.msg,
          center: true,
          type: 'error'
        })
        this.total = data.total
        this.catelist = data.result
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getCateList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getCateList()
      },
      // 点击按钮，展示添加分类的对话框
      showClassDialog() {
        // 先获取父级分类的数据列表
        this.getParentCateList()
        // 再展示出对话框
        this.classDialog = true
      },
      // 获取父级分类的数据列表
      async getParentCateList() {
        const { data: res } = await this.$http.get('categories', {
          params: { type: 2 }
        })
      
        if (res.meta.status !== 200) {
          return this.$message({
          message: meta.msg,
          center: true,
          type: 'error'
        })
        }
        this.parentCateList = res.data
      },
      parentCateChanged() {
        console.log(this.selectedKeys)
      }
    }
  }
</script>

<style scoped>

</style>

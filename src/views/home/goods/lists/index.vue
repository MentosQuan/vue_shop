<template>
  <div class="goods">
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 在组件上想直接绑定事情需要通过.native绑定到原生对象中 -->
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList" @keydown.enter.native="getGoodsList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区域 -->
      <el-table :data="goodslist" border stripe>
        <el-table-column type="index" align="center"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name" align="center"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="95px" align="center"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="70px" align="center"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="140px" align="center">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130px" align="center">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页区域 -->
      <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="queryInfo.pagenum"
        :page-sizes="[5, 10, 15, 20]" :page-size="queryInfo.pagesize" layout="total, sizes, prev, pager, next, jumper"
        :total="total" background>
      </el-pagination>
    </el-card>

  </div>
</template>

<script>
  export default {
    data() {
      return {
        // 查询参数对象
        queryInfo: {
          query: '',
          pagenum: 1,
          pagesize: 10
        },
        // 商品列表
        goodslist: [],
        // 总数据条数
        total: 0
      }
    },
    created() {
      this.getGoodsList()
    },
    methods: {
      // 根据分页获取对应的商品列表
      async getGoodsList() {
        const {
          data: {
            data,
            meta
          }
        } = await this.$http.get('goods', {
          params: this.queryInfo
        })

        if (meta.status !== 200) {
          return this.$message({
            message: meta.msg,
            center: true,
            type: 'error'
          })
        }

        this.$message({
          message: meta.msg,
          center: true,
          type: 'success'
        })
        console.log(data)
        this.goodslist = data.goods
        this.total = data.total
      },
      handleSizeChange(newSize) {
        this.queryInfo.pagesize = newSize
        this.getGoodsList()
      },
      handleCurrentChange(newPage) {
        this.queryInfo.pagenum = newPage
        this.getGoodsList()
      },
      async removeById(id) {
        try {
          const confirmResult = await this.$confirm(
            '此操作将永久删除该商品, 是否继续?',
            '提示', {
              confirmButtonText: '确定',
              cancelButtonText: '取消',
              type: 'warning'
            })
          const {
            data: {
              data,
              meta
            }
          } = await this.$http.delete(`goods/${id}`)

          if (meta.status !== 200) {
            return this.$message({
              message: meta.msg,
              center: true,
              type: 'error'
            })
          }
          this.$message({
            message: meta.msg,
            center: true,
            type: 'success'
          })
          this.getGoodsList()
        } catch (err) {
          this.$message({
            message: '撤销删除',
            center: true,
            type: 'info'
          })
        }
      },
      goAddpage() {
        this.$router.push('/goods/add')
      }
    }
  }
</script>

<style scoped>

</style>

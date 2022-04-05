<template>
  <div>
    <div>
      <el-input
          class="addPosInput"
          size="small"
          placeholder="添加职位..."
          suffix-icon="el-icon-plus"
          v-model="pos.name"
          @keydown.enter.native="addPosition"><!--对于组件上的原生事件，必须要有native修饰符，不然就会当成自定义事件-->
      </el-input>
      <el-button
          size="small"
          icon="el-icon-plus"
          type="primary"
          @click="addPosition">
        添加
      </el-button>
    </div>
    <div class="pasManaMain">
      <el-table
          @selection-change="handleSelectionChange"
          size="small"
          :data="positions"
          style="width: 70%"
          stripe border><!--斑马纹和边框-->
        <el-table-column
            type="selection"
            width="55">
        </el-table-column><!--复选框的改变事件是绑定在table上的-->
        <el-table-column
            prop="id"
            label="编号"
            width="55">
        </el-table-column>
        <el-table-column
            prop="name"
            label="职位"
            width="120">
        </el-table-column>
        <el-table-column
            prop="createDate"
            label="创建时间"
            width="200">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
                size="mini"
                @click="showEditView(scope.$index, scope.row)">编辑
            </el-button>
            <el-button
                size="mini"
                type="danger"
                @click="handleDelete(scope.$index, scope.row)">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-button
        type="danger"
        style="margin-top: 8px"
        size="small"
        :disabled="!multipleSelection.length"
        @click="deleteMany">批量删除
    </el-button>
    <el-dialog
        title="编辑职位"
        :visible.sync="dialogVisible"
        width="30%">
      <div>
        <el-tag>职位名称</el-tag>
        <el-input
            class="updatePosInput"
            size="small"
            v-model="updatePos.name"><!--对于el-input来说，如果不用v-model，输入框中的内容就无法修改了-->
        </el-input>
      </div>
      <span slot="footer" class="dialog-footer">
    <el-button size="small" @click="dialogVisible = false">取 消</el-button>
    <el-button size="small" type="primary" @click="doUpdate">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "PosMana",
  data() {
    return {
      pos: {
        name: ''
      },
      updatePos: {
        name: ''
      },
      positions: [],
      dialogVisible: false,
      multipleSelection: []
    }

  },
  mounted() {
    this.initPositions()
  },
  methods: {
    initPositions() {
      this.getRequest('/system/basic/pos').then(resp => {
        if (resp) {
          this.positions = resp
        }
      })
    },
    //多选框事件
    //子组件可以通过自定义事件给父组件传递参数的，这个val就是（默认的event是针对原生事件的）
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    deleteMany() {
      this.$confirm(`此操作将永久删除这${this.multipleSelection.length}条职位, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let ids = '?'
        this.multipleSelection.forEach(item => {
          ids += `ids=${item.id}&`
        })
        this.deleteRequest(`/system/basic/pos/${ids}`).then(resp => {
          if (resp) {
            this.initPositions()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    //展示编辑框
    showEditView(index, data) {
      //this.updatePos = data //直接赋值会导致原数据被误修改，因为拿到的是同一个地址
      Object.assign(this.updatePos, data)
      this.updatePos.createDate = ''//如果不设置为空串会出现 400 bad input，因为后端的createDate类型是LocalDateTime
      this.dialogVisible = true
    },
    //处理职位更新
    doUpdate() {
      this.putRequest('/system/basic/pos', this.updatePos).then(resp => {
        if (resp) {
          this.initPositions()
          this.dialogVisible = false
        }
      })
    },
    handleDelete(index, data) {
      this.$confirm(`此操作将永久删除${data.name}职位, 是否继续?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.deleteRequest(`/system/basic/pos/${data.id}`).then(resp => {
          if (resp) {
            this.initPositions()
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    addPosition() {
      if (this.pos.name) {
        this.postRequest('/system/basic/pos', this.pos).then(resp => {
          if (resp) {
            this.initPositions()
            this.pos.name = ''
          }
        })
      } else {
        this.$message.error('职位名称不能为空')
      }
    }
  }
}
</script>

<style scoped>
.addPosInput {
  width: 300px;
  margin-right: 8px;
}

.pasManaMain {
  margin-top: 10px;
}

.updatePosInput {
  width: 200px;
  margin-left: 8px;
}
</style>
<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 搜索与添加区域 -->
      <el-row :gutter="20">
        <el-col :span="7">
          <el-input
            placeholder="请输入内容"
            v-model="queryInfo.query"
            clearable
            @clear="getUserList"
          >
            <el-button
              slot="append"
              icon="el-icon-search"
              @click="getUserList"
            ></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="dialogVisible = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userList" stripe border>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="姓名" prop="username"></el-table-column>
        <el-table-column label="邮箱" prop="email"></el-table-column>
        <el-table-column label="电话" prop="mobile"></el-table-column>
        <el-table-column label="角色" prop="role_name"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- scope.row保存了这一行的信息 -->
            <!-- {{scope.row}} -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="userStateChange(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              effect="dark"
              content="分配角色"
              placement="top"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部分页区域 -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 5, 10]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </el-card>

    <!-- 添加用户对话框 -->
    <el-dialog
      title="提示"
      :visible.sync="dialogVisible"
      width="50%"
      @close="addFormClosed"
    >
      <!-- 内容主体 -->
      <el-form
        :model="addForm"
        :rules="addFormrules"
        ref="addFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="addForm.username"></el-input>
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input v-model="addForm.password"></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="addForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机" prop="mobile">
          <el-input v-model="addForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addUser">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改用户对话框 -->
    <el-dialog
      title="修改用户"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!-- 内容主体 -->
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="70px"
      >
        <el-form-item label="用户名" prop="username">
          <el-input v-model="editForm.username" disabled></el-input>
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="editForm.email"></el-input>
        </el-form-item>
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="editForm.mobile"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editUserInfo">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 分配角色对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisible"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前的用户是:{{ userInfo.username }}</p>
        <p>当前的角色是:{{ userInfo.role_name }}</p>
        <p>
          分配新角色:
          <el-select v-model="selectRoleId" placeholder="请选择">
            <el-option
              v-for="item in roleList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="savaRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 注意位置，没有在data的return内
    // 验证手机号规则
    var checkMobile = (rule, value, cb) => {
      const regMobile =
        /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/;
      if (regMobile.test(value)) {
        return cb();
      }
      cb(new Error("手机号码格式错误"));
    };
    var checkEmail = (rule, value, cb) => {
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
      if (regEmail.test(value)) {
        return cb();
      }
      cb(new Error("邮箱格式错误"));
    };
    return {
      userList: [],
      // 获取用户列表需要发的参数对象
      queryInfo: {
        query: "",
        // 当前主页
        pagenum: 1,
        // 一共有几页
        pagesize: 2,
      },
      total: 0,
      // 控制添加用户的对话框显示？隐藏？
      dialogVisible: false,
      // 添加用户 数据对象
      addForm: {
        username: "",
        password: "",
        email: "",
        mobile: "",
      },
      addFormrules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
          { min: 3, max: 6, message: "长度在 3 到 6 个字符", trigger: "blur" },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 11,
            message: "长度在 6 到 11 个字符",
            trigger: "blur",
          },
        ],
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 控制修改用户对话框
      editDialogVisible: false,
      // 修改用户对话框数据
      editForm: {},
      // 修改用户验证规则
      editFormRules: {
        email: [
          { required: true, message: "请输入邮箱", trigger: "blur" },
          { validator: checkEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          { validator: checkMobile, trigger: "blur" },
        ],
      },
      // 控制分配角色对话框
      setRoleDialogVisible: false,
      // 需要被分配角色的用户信息
      userInfo: {},
      // 所有角色的数据列表
      roleList: [],
      // 已选择的角色ID
      selectRoleId: "",
    };
  },
  created() {
    this.getUserList();
  },
  methods: {
    // 获取用户列表，刚加载就调用
    async getUserList() {
      const { data: res } = await this.$http.get("users", {
        params: this.queryInfo,
      });
      if (res.meta.status !== 200) {
        return this.$message.error("user获取失败了");
      }
      console.log(res);
      this.$message.success("user获取成功了");
      this.userList = res.data.users;
      this.total = res.data.total;
      // console.log(userList);
    },
    // 监听 pagesize 改变
    // size改变，重新发送请求，因为每次请求的都是当前页面的当前数据，不会把后面所有页的数据都请求过来
    handleSizeChange(newSize) {
      // console.log(newSize);
      this.queryInfo.pagesize = newSize;
      this.getUserList();
    },
    // 监听页码值改变
    // 有两部分，前往几页也监听
    handleCurrentChange(newPage) {
      // console.log(newPage);
      this.queryInfo.pagenum = newPage;
      this.getUserList();
    },
    // 监听 switch 开关状态
    async userStateChange(infoObj) {
      console.log(infoObj);
      const { data: res } = await this.$http.put(
        `users/${infoObj.id}/state/${infoObj.mg_state}`
      );
      if (res.meta.status !== 200) {
        infoObj.mg_state = !infoObj.mg_state;
        return this.$message.error("user获取失败了");
      }
      this.$message.success("用户状态更新成功");
    },
    // 监听添加用户对话框的close事件
    addFormClosed() {
      // console.log(this.$refs);
      this.$refs.addFormRef.resetFields();
    },
    // 添加用户
    addUser() {
      // 先对表单预验证，所有都对了会返回一个true
      this.$refs.addFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;
        const { data: res } = await this.$http.post("users", this.addForm);
        if (res.meta.status !== 201) {
          return this.$message.error("添加用户失败");
        }
        this.$message.success("添加用户成功");
        this.dialogVisible = false;
        // 重新加载用户数据
        this.getUserList();
      });
    },
    // 修改用户对话框展示
    async showEditDialog(id) {
      const { data: res } = await this.$http.get("users/" + id);
      if (res.meta.status !== 200) {
        return this.$message.error("修改用户数据获取失败");
      }
      this.editForm = res.data;
      this.editDialogVisible = true;
    },
    // 监听事件，修改用户对话框的关闭
    editDialogClosed() {
      // 让上一次的结果，下一次看不见
      this.$refs.editFormRef.resetFields();
    },
    // 修改用户并提交
    editUserInfo() {
      // 发送服务器之前，先预验证
      this.$refs.editFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) return;
        // 发送请求
        const { data: res } = await this.$http.put(
          "users/" + this.editForm.id,
          { email: this.editForm.email, mobile: this.editForm.mobile }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("修改用户失败");
        }
        // 先关闭对话框
        // 获取数据
        // 最后提示成功
        this.editDialogVisible = false;
        this.getUserList();
        this.$message.success("修改用户成功");
      });
    },
    // 删除用户
    async removeUserById(id) {
      const result = await this.$confirm(
        "此操作将永久删除该用户, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      ).catch((error) => error);
      // 点确认，返回 confirm
      // 点取消，如果不加catch捕获error，会报错，加了 返回cancel
      // console.log(res);
      if (result !== "confirm") {
        return this.$message.info("已取消删除");
      }
      const { data: res } = await this.$http.delete("users/" + id);
      console.log(res);
      if (res.meta.status !== 200) {
        console.log(res.meta.msg);
        return this.$message.error("删除用户失败");
      }
      this.$message.success("删除用户成功");
      this.getUserList();
    },
    // 点击分配角色按钮触发
    async setRole(userInfo) {
      this.userInfo = userInfo;
      const { data: res } = await this.$http.get("/roles");
      if (res.meta.status !== 200) {
        return this.$message.error("分配角色失败");
      }
      this.roleList = res.data;
      this.setRoleDialogVisible = true;
    },
    // 点击确定按钮，分配角色
    async savaRoleInfo() {
      if (!this.selectRoleId) {
        return this.$message.error("请选择角色");
      }
      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectRoleId,
        }
      );
      if (res.meta.status !== 200) {
        console.log(res.meta.msg);
        return this.$message.error("分配角色失败");
      }
      this.$message.success("分配成功");
      this.getUserList();
      this.setRoleDialogVisible = false;
    },
    // 对话框关闭时，清空所有
    setRoleDialogClosed() {
      // 上面只用到了这两个
      this.userInfo = {};
      this.selectRoleId = "";
    },
  },
};
</script>

<style></style>

<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 提示框 -->
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      >
      </el-alert>
      <!-- 步骤条 -->
      <el-steps
        :space="200"
        :active="activeIndex - 0"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>

      <el-form
        :model="addForm"
        :rules="addRules"
        ref="addFormRef"
        label-position="top"
      >
        <!-- el-tabs子节点只能是el-tab-pane -->
        <!-- tab标签 -->
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类">
              <!-- 级联选择器 -->
              <el-cascader
                v-model="addForm.goods_cat"
                :options="catelist"
                :props="cateProps"
                @change="handleChange"
                style="width: 200px"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <!-- 发送的是动态 -->
            <el-form-item
              v-for="item in manyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <!-- 复选框 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  :label="cb"
                  v-for="(cb, i) in item.attr_vals"
                  :key="i"
                  border
                ></el-checkbox> </el-checkbox-group
            ></el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              v-for="item in onlyTableData"
              :key="item.attr_id"
              :label="item.attr_name"
            >
              <el-input v-model="item.attr_vals"></el-input>
            </el-form-item>
          </el-tab-pane>

          <el-tab-pane label="商品图片" name="3">
            <!-- action表示图片要上传到的后台API地址 -->
            <!-- 上传组件并没有调用axios，他是自己封装了 -->
            <el-upload
              action="http://127.0.0.1:8888/api/private/v1/upload"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headerObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>

          <el-tab-pane label="商品内容" name="4">
            <quill-editor v-model="addForm.goods_introduce"> </quill-editor>
            <el-button type="primary" style="margin-top: 15px" @click="add"
              >添加商品</el-button
            >
          </el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>
    <!-- 预览图片对话框 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewDialogVisible"
      width="50%"
    >
      <img :src="previewUrl" alt="" class="previewImg" />
    </el-dialog>
  </div>
</template>

<script>
import _ from "lodash";
export default {
  data() {
    return {
      activeIndex: "0",
      addForm: {
        goods_name: "",
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        goods_cat: [],
        pics: [],
        goods_introduce: "",
        attrs: [],
      },
      addRules: {
        goods_name: [
          { required: true, message: "请输入名称", trigger: "blur" },
        ],
        goods_price: [
          { required: true, message: "请输入价格", trigger: "blur" },
        ],
        goods_weight: [
          { required: true, message: "请输入重量", trigger: "blur" },
        ],
        goods_number: [
          { required: true, message: "请输入数量", trigger: "blur" },
        ],
        // goods_cat: [{ required: true, message: "请选择分类", trigger: "blur" }],
      },
      // 商品分类数据
      catelist: [],
      // 分类的配置对象
      cateProps: {
        label: "cat_name",
        value: "cat_id",
        children: "children",
        expandTrigger: "hover",
      },
      // 动态参数列表数据
      manyTableData: [],
      // 静态属性列表数据
      onlyTableData: [],
      // 上传图片请求头
      headerObj: {
        Authorization: window.sessionStorage.getItem("token"),
      },
      // 预览图片url
      previewUrl: "",
      previewDialogVisible: false,
    };
  },
  created() {
    this.getCateList();
  },
  computed: {
    // 选中的三级分类id
    cateId() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2];
      }
      return null;
    },
  },
  methods: {
    // 获取所有商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get("categories");
      if (res.meta.status !== 200) {
        return this.$message.error("获取分类数据失败");
      }
      this.$message.success("获取分类数据成功");
      this.catelist = res.data;
    },
    // 级联选择器选中项变化
    handleChange() {
      console.log(this.addForm.goods_cat);
      if (this.addForm.goods_cat.length !== 3) {
        this.addForm.goods_cat = [];
      }
    },
    // 切换tab前触发
    beforeTabLeave(activeName, oldActiveName) {
      if (oldActiveName === "0" && this.addForm.goods_cat.length !== 3) {
        this.$message.error("请先选择商品分类");
        // 返回false就阻止tab页切换
        return false;
      }
    },
    async tabClicked() {
      // 证明进入动态面板
      if (this.activeIndex === "1") {
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: "many" } }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("请求动态参数失败");
        }
        console.log(res.data);
        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.trim().length === 0 ? [] : item.attr_vals.split(" ");
        });
        this.manyTableData = res.data;
      } else if (this.activeIndex === "2") {
        // 静态属性
        const { data: res } = await this.$http.get(
          `categories/${this.cateId}/attributes`,
          { params: { sel: "only" } }
        );
        if (res.meta.status !== 200) {
          return this.$message.error("请求静态属性失败");
        }
        console.log(res.data);
        this.onlyTableData = res.data;
      }
    },
    // 处理图片预览效果
    handlePreview(file) {
      this.previewUrl = file.response.data.url;
      this.previewDialogVisible = true;
    },
    // 处理移除图片的操作
    handleRemove(file) {
      console.log(file);
      // 1.先获取要删除的图片的path
      // 2.由path找到所在对象，并找到在所在数组里的index
      // 3.删除一个对象 {pic:path}
      const picPath = file.response.data.tmp_path;
      const i = this.addForm.pics.findIndex((item) => {
        item.pic === picPath;
      });
      this.addForm.pics.splice(i, 1);
      console.log(this.addForm);
    },
    // 图片上传成功 触发
    handleSuccess(response) {
      const picObj = { pic: response.data.tmp_path };
      this.addForm.pics.push(picObj);
      console.log(this.addForm);
    },
    // 添加商品
    add() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error("请填写必要的参数项");
        }
        console.log(this.onlyTableData);
        // 处理动态参数
        this.manyTableData.forEach((item) => {
          const newInfo = {
            attr_id: item.attr_id,
            attr_value: item.attr_vals.join(" "),
          };
          this.addForm.attrs.push(newInfo);
        });
        // 处理静态属性
        this.onlyTableData.forEach((item) => {
          const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals };
          this.addForm.attrs.push(newInfo);
        });
        // v-model用到goods_cat，且必须是数组；但请求必须是字符串
        const form = _.cloneDeep(this.addForm);
        form.goods_cat = form.goods_cat.join(",");
        console.log(form);
        // 发起请求
        const { data: res } = await this.$http.post("goods", form);
        if (res.meta.status !== 201) {
          return this.$message.error("添加商品失败");
        }
        this.$message.success("添加商品成功");
        this.$router.push("/goods");
      });
    },
  },
};
</script>

<style>
.el-checkbox {
  margin: 0 10px 0 0 !important;
}
.previewImg {
  width: 100%;
}
</style>

<template>
  <div class="login">
    <canvas ref="canvas"></canvas>
    <div class="login-box">
      <!-- 头像 -->
      <div class="avatar-box">
        <img src="./mentos.jpg" alt="">
      </div>
      <el-form :model="loginForm" :rules="rules" label-width="0px" class="login_form" ref="loginRef">
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input prefix-icon="iconfont icon-user" autofocus="true" v-model="loginForm.username"></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input prefix-icon="iconfont icon-3702mima" type="password" v-model="loginForm.password"></el-input>
        </el-form-item>
        <!-- 按钮区域 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="loginBtn" :disabled="loginForm.flag">登录</el-button>
          <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>
  export default {
    props: {
      point: {
        type: Number,
        default: 100 // 生成的星星（点）的个数, 默认25个
      },
      lineColor: {
        type: String,
        default: 'rgba(45,140,210,0.2)' // 线的颜色
        // default: 'rgba(255,255,255,1)'
      },
      roundColor: {
        type: String,
        default: 'rgba(45,140,210,0.1)' // 星星的颜色
        // default: 'rgba(255,255,255,0.2)'
      },
    },
    data() {
      return {
        loginForm: {
          username: 'admin',
          password: '123456',
          flag: false
        },
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
          ]
        },
        docWidth: 0, // 画布宽
        docHeight: 0, // 画布高
        context: null, // canvasDom的执行上下文
        circleArr: [], // 圆点数组
        timer: null, // 定时器对象
      }
    },
    mounted() {
      const canvasDom = this.$refs.canvas

      // 取画布的高宽来设置显示分辨率
      this.docWidth = canvasDom.offsetWidth
      this.docHeight = canvasDom.offsetHeight

      // 设置画布分辨率
      canvasDom.width = canvasDom.offsetWidth
      canvasDom.height = canvasDom.offsetHeight

      // 初始化canvas上下文
      this.context = canvasDom.getContext('2d')

      // 设置线条和星星颜色
      this.context.strokeStyle = this.lineColor;
      this.context.lineWidth = 1;
      this.context.fillStyle = this.roundColor;

      // 初始化
      this.createCircleArr() // 设置星星数组
      this.draw() // 首屏绘制
      this.cycleDraw() // 循环绘制
    },
    methods: {
      resetForm() {
        this.$refs.loginRef.resetFields()
        this.loginForm.username = this.loginForm.password = ''
      },
      loginBtn() {
        this.loginForm.flag = !this.loginForm.flag
        this.$refs.loginRef.validate(async valid => {
          if (!valid) return;
          const {
            data,
            data: {
              data: res,
              meta,
              meta: {
                status
              }
            }
          } = await this.$http.post('login', this.loginForm)
          if (status != 200) {
            setTimeout(() => {
              this.loginForm.flag = !this.loginForm.flag
            }, 2000)
            return this.$message({
              message: '登录失败',
              center: true,
              type: 'error'
            });
          } else {
            // this.$message.success('登录成功')
            sessionStorage.setItem('token', res.token)
            sessionStorage.setItem('username', this.loginForm.username)
            this.$router.push('/home')
          }
        })
      },
      rangeRadom(max, min) {
        return Math.floor(Math.random() * (max - min + 1) + min)
      },
      /**
       * 绘制原点
       */
      drawCircle(context, x, y, r, moveX, moveY) {
        let circle = {
          x,
          y,
          r,
          moveX,
          moveY,
        }
        context.beginPath()
        context.arc(circle.x, circle.y, circle.r, 0, 2 * Math.PI)
        context.closePath()
        context.fill()
        return circle
      },
      /**
       * 绘制线条
       */
      drawLine(context, beginX, beginY, closeX, closeY, opacity) {
        context.beginPath()
        context.strokeStyle = `rgba(0, 0, 0, ${opacity})`
        context.moveTo(beginX, beginY)
        context.lineTo(closeX, closeY)
        context.closePath()
        context.stroke()
      },
      /**
       * 生成圆点数组
       */
      createCircleArr() {
        for (let i = 0; i < this.point; i++) {
          this.circleArr.push(this.drawCircle(
            this.context,
            this.rangeRadom(this.docWidth, 0),
            this.rangeRadom(this.docHeight, 0),
            this.rangeRadom(15, 2),
            this.rangeRadom(10, -10) / 40,
            this.rangeRadom(10, -10) / 40
          ))
        }
      },
      /**
       * 每一帧绘制
       */
      draw() {
        const circleArr = this.circleArr
        this.context.clearRect(0, 0, this.docWidth, this.docHeight)
        // 循环绘制点
        for (let i = 0; i < this.point; i++) {
          this.drawCircle(this.context, circleArr[i].x, circleArr[i].y, circleArr[i].r)
        }
        // 循环绘制线
        for (let i = 0; i < this.point; i++) {
          for (let j = 0; j < this.point; j++) {
            if (i + j < this.point) {
              let A = Math.abs(circleArr[i + j].x - circleArr[i].x)
              let B = Math.abs(circleArr[i + j].y - circleArr[i].y)
              let lineLength = Math.sqrt(A * A + B * B)
              let C = 1 / lineLength * 7 - 0.009
              let lineOpacity = C > 0.03 ? 0.03 : C;
              if (lineOpacity > 0) {
                this.drawLine(
                  this.context,
                  circleArr[i].x,
                  circleArr[i].y,
                  circleArr[i + j].x,
                  circleArr[i + j].y,
                  lineOpacity,
                )
              }
            }
          }
        }
      },
      /**
       * 循环绘制
       */
      cycleDraw() {
        this.timer = setInterval(() => {
          for (let i = 0; i < this.point; i++) {
            let cir = this.circleArr[i]
            cir.x += cir.moveX
            cir.y += cir.moveY
            if (cir.x > this.docWidth) {
              cir.x = 0
            } else if (cir.x < 0) {
              cir.x = this.docWidth
            }
            if (cir.y > this.docHeight) {
              cir.y = 0
            } else if (cir.y < 0) {
              cir.y = this.docHeight
            }
          }
          this.draw()
        }, 10)
      },
    },
    beforeDestory() {
      // 记得摧毁定时器
      clearInterval(this.timer)
    }
  }
</script>

<style lang="less" scoped>
  .login {
    height: 100%;
    // background-color: #2b4b6b;
    background-color: white;

    canvas {
      width: 100%;
      height: 99%;
    }

    .login-box {
      background-color: rgba(0, 0, 0, 0.05);
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

      .el-button--info {
        background-color: rgba(255, 0, 0, 0.4);
        border-color: rgba(0, 0, 0, 0.1);
        transition: all .5s;
      }

      .el-button--info:hover {
        color: gray;
        background-color: rgba(255, 0, 0, 0.5);
        border-color: rgba(0, 0, 0, 0.1);
      }

      .el-button--primary {
        background-color: rgba(0, 255, 0, 0.4);
        border-color: rgba(0, 0, 0, 0.1);
        transition: all .5s;
      }

      .el-button--primary:hover {
        color: gray;
        background-color: rgba(0, 255, 0, 0.5);
        border-color: rgba(0, 0, 0, 0.1);
      }
    }
  }
</style>

<template>
  <section :style="heroHeight" class="hero">
    <div class="container text-center">
      <div class="row">
        <div class="col-md-12">
          <!-- <a class="hero-brand" title="Home"><img alt="广告投放平台" ></a> -->
        </div>
      </div>

      <div class="col-md-12" >
        <h1 >
          乐课堂互动系统
        </h1>

        <p class="tagline">
          给你一个实时互动的平台
        </p>
        <a class="btn btn-full" @click="toPutAD">从这里开始</a>
        <!-- <video autoplay loop muted>
        <source src="img/highway-loop.mp4" type="video/mp4" />
        </video> -->
      </div>
    </div>

  </section>
</template>

<script>
export default {
  data() {
    return {
      heroHeight: {
        height: ''
      }
    }
  },
  created() {
    this.autodivheight()
  },
  methods: {
    toPutAD() {
      // console.log("???")
      this.$router.push({
        name: 'studentmane'
      })
    },
    autodivheight() {
      this.heroHeight.height = (window.innerHeight - 90) + 'px'
    },
    submitUpload() {
      this.$refs.upload.submit()
    },
    handleChange(file, fileList) {
      // this.fileList3 = fileList.slice(-3);
      // this.fileList.unshift()
      this.fileList = []
      this.fileList.push(file)
      console.log(fileList)
      // this.fileList.splice(0,file);
      // this.fileList = []
    },
    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    handlePreview(file) {
      console.log(file)
    }
  }
}
</script>

<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    width: 480px;
  }

  .hero {
  display: table;
   height: 100%;
  width: 100%;
  /* position: relative; */
  background-image: url(../../assets/images/cover.jpg);
 background-size:100% 100%;
  background-repeat: no-repeat;
  background-color: #fff;
  /* background-size: cover; */
  /* padding: 320px 0; */
  color: #fff;
  width: 100%;
}
.hero:after {
  content: '';
  z-index: 0;
  position: absolute;
  background: rgba(0, 0, 0, 0.65);
  width: 100%;
  height: 100%;
  left: 0;
  top: 0;
}

.hero .container {
  position: relative;
  z-index: 1;
  text-align: center;
  display: table-cell;
  vertical-align: middle;
  width: 100%;
}

.text-center {
  text-align: center !important;
}
  .col-md-12 {
    -ms-flex: 0 0 100%;
        flex: 0 0 100%;
    max-width: 100%;
  }
  .tagline {
  font-family: "Raleway", Helvetica, Arial, sans-serif;
  font-size: 26px;
  margin: 45px 0 75px 0;
  color: #fff;
}
          .btn {
  background-color: #199EB8;
  font-family: "Roboto", Helvetica, Arial, sans-serif;
  font-weight: 800;
  color: #fff;
  padding: 15px 45px;
  border-radius: 50px;
}
.btn:hover {
  background-color: #E04F00;
  color: #fff;
}

.btn:focus {
  color: #fff;
}

.btn-ghost {
  border: 3px solid #fff;
  background-color: transparent;
}

.btn-ghost:hover {
  background-color: #fff;
  color: #199EB8;
}
</style>

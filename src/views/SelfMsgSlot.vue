<template>
  <div class="bg">
    <div class="overlay">
      <div>
        米娜桑麻 欢迎来到<span class="madoka">圆</span><span class="homura">焰</span>之庭！
      </div>
      <div>
        友链:
        <a target="_blank" href="https://madohomu.love/">madohomu.love(圆焰圆)</a></div>
      <div>
        后续会开放留言功能
      </div>
      <div>
        想说什么都可以哦~
      </div>
      <div>
        禁止拆cp、对角色发电等不雅言论 不然会被圆环之理制裁的哦
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.bg {
  background: url("@/assets/images/selfbg.jpg") no-repeat center;
  background-size: cover;
  font-size: 12px;
  color: white;
  width: 100%;
  height: 100%;
  display: flex;
  /* ✨ 半透明遮罩容器 */
  .overlay {
    background-color: rgba(0, 0, 0, 0.5); /* 半透明黑底 */
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    &:hover {
      backdrop-filter: blur(4px); /* 🌸加点梦幻感 */
    }
  }

}
.madoka {
  color: #ffbbdd;
}

.homura {
  color: #d5a2ff;
}
a {
  color: #ff00fb;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
}

</style>

<template>
  <div class="bg w-full h-full flex">
    <div class="overlay flex w-full h-full justify-center flex-col">
      <div>
        米娜桑麻 欢迎来到<span class="madoka">圆</span><span class="homura">焰</span>之庭！
      </div>
      <div>
        友链:
        <a target="_blank" href="https://madohomu.love/">madohomu.love(圆焰圆)</a></div>
      <div>
        禁止拆cp、对角色发电 不然会被圆环之理制裁的哦
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
  /* ✨ 半透明遮罩容器 */
  .overlay {
    background-color: rgba(0, 0, 0, 0.5); /* 半透明黑底 */
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

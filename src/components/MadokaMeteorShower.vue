<template>
  <div class="madoka">
    <section class="bg-stars">
      <span class="star"></span>
      <span class="star"></span>
      <span class="star"></span>
      <span class="star"></span>
      <span class="star"></span>
      <span class="star"></span>
    </section>
  </div>
</template>
<script setup lang="ts">
</script>
<style scoped>
.madoka {
  pointer-events: none;
  display: block;
  padding: 2.2rem;
  inset: 0;
  position: fixed;
  background: linear-gradient(14deg, rgba(255, 192, 203, 0.8) 0%, rgba(255, 192, 203, 0.7) 66%, rgb(255, 105, 180) 100%), radial-gradient(circle, rgba(255, 192, 203, 0.5) 0%, rgba(255, 192, 203, 0.2) 65%, rgba(255, 20, 147, 0.9) 100%);
  -webkit-box-shadow: rgba(0, 212, 255) 0px 0px 50px -15px;
  box-shadow: rgba(0, 212, 255) 0px 0px 50px -15px;
  overflow: hidden;
  z-index: -1;
}

/*--------header section-----------*/

.form-title {
  font-size: 1.25rem;
  line-height: 1.75rem;
  font-family: monospace;
  font-weight: 600;
  text-align: center;
  color: #fff;
  text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.7);
  animation-duration: 1.5s;
  overflow: hidden;
  transition: 0.12s;
}

.form-title span {
  animation: flickering 2s linear infinite both;
}

.title-2 {
  display: block;
  margin-top: -0.5rem;
  font-size: 2.1rem;
  font-weight: 800;
  font-family: ysbth, sans-serif;
  text-align: center;
  -webkit-text-stroke: #fff 0.05rem;
  letter-spacing: 0.2rem;
  color: transparent;
  position: relative;
  text-shadow: 0px 0px 16px #cecece;
}

.title-2 span::before,
.title-2 span::after {
  content: "—";
}

@keyframes flickering {
  0%,
  100% {
    opacity: 1;
  }

  41.99% {
    opacity: 1;
  }

  42% {
    opacity: 0;
  }

  43% {
    opacity: 0;
  }

  43.01% {
    opacity: 1;
  }

  47.99% {
    opacity: 1;
  }

  48% {
    opacity: 0;
  }

  49% {
    opacity: 0;
  }

  49.01% {
    opacity: 1;
  }
}

/*---------shooting stars-----------*/

.bg-stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
  background-size: cover;
  animation: animateBg 50s linear infinite;
}

@keyframes animateBg {
  0%,
  100% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.2);
  }
}

.star {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 4px;
  background: #fff;
  border-radius: 50%;
  box-shadow: 0 0 0 4px rgba(255, 255, 255, 0.1),
  0 0 0 8px rgba(255, 255, 255, 0.1),
  0 0 20px rgba(255, 255, 255, 0.1);
  animation: animate 3s linear infinite;
}

.star::before {
  content: "";
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  width: 300px;
  height: 1px;
  background: linear-gradient(90deg, #fff, transparent);
}

@keyframes animate {
  0% {
    transform: rotate(315deg) translateX(0);
    opacity: 1;
  }

  70% {
    opacity: 1;
  }

  100% {
    transform: rotate(315deg) translateX(-1000px);
    opacity: 0;
  }
}

.star:nth-child(1) {
  top: 0;
  right: 0;
  left: initial;
  animation-delay: 0s;
  animation-duration: 1s;
}

.star:nth-child(2) {
  top: 0;
  right: 100px;
  left: initial;
  animation-delay: 0.2s;
  animation-duration: 3s;
}

.star:nth-child(3) {
  top: 0;
  right: 220px;
  left: initial;
  animation-delay: 2.75s;
  animation-duration: 2.75s;
}

.star:nth-child(4) {
  top: 0;
  right: -220px;
  left: initial;
  animation-delay: 1.6s;
  animation-duration: 1.6s;
}

.star:nth-child(5) {
  top: 0;
  right: -440px;
  animation-delay: 0s;
  animation-duration: 1.6s;
}

.star:nth-child(6) {
  top: 0;
  right: -470px;
  margin-left: -200px;
  animation-delay: 0s;
  animation-duration: 1.3s;
}
</style>

<template>
  <div class="loader" :class="$vuetify.theme.dark ? 'dark' : ''">
    <div class="spinner" />
  </div>
</template>

<style lang="scss">
  .loader {
    width: 100vw;
    height: 100vh;
    position: fixed;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.5);
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
  }
  .dark {
    background: rgba(0, 0, 0, 0.5);
  }
  .spinner {
    width: 40px;
    height: 40px;
    background-color: #207e9b;
    margin: 100px auto;
    -webkit-animation: sk-rotateplane 1.2s infinite ease-in-out;
    animation: sk-rotateplane 1.2s infinite ease-in-out;
  }

  @-webkit-keyframes sk-rotateplane {
    0% { -webkit-transform: perspective(120px) }
    50% { -webkit-transform: perspective(120px) rotateY(180deg) }
    100% { -webkit-transform: perspective(120px) rotateY(180deg)  rotateX(180deg) }
  }

  @keyframes sk-rotateplane {
    0% {
      transform: perspective(120px) rotateX(0deg) rotateY(0deg);
      -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg)
    } 50% {
      transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);
      -webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg)
    } 100% {
      transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
      -webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);
    }
  }
</style>

<template>
  <div id="app">

  <!--   <audio src="http://47.106.171.33:3000/music/code.mp3" controls="controls" preload='auto' style='visibility: hidden;height:0'></audio> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted: function(){
     function checkIE(){
      return '-ms-scroll-limit' in document.documentElement.style && '-ms-ime-align' in document.documentElement.style
    }
    if (checkIE()) {
      window.addEventListener('hashchange', () => {
        var currentPath = window.location.hash.slice(1);
        if (this.$route.path !== currentPath) {
        this.$router.push(currentPath)
      }
    }, false)
    }

  }
}
</script>

<style>
#app {
  width:100%;
  height:100%;
/*  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;*/
}
</style>

<template>
  <div id="app">

  <!--   <audio src="http://47.106.171.33:3000/music/code.mp3" controls="controls" preload='auto' style='visibility: hidden;height:0'></audio> -->
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
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

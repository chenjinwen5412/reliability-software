<template>
  <div id="app">
    <nav class="navbar">
      <h1>系统可靠性预计软件</h1>
      <div class="nav-links">
        <router-link to="/">首页</router-link>
        <router-link to="/calculator">可靠性计算</router-link>
        <router-link to="/results">结果分析</router-link>
      </div>
    </nav>
    
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f7fa;
}

.navbar {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.nav-links a {
  color: white;
  text-decoration: none;
  margin-left: 2rem;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-links a:hover, .nav-links a.router-link-active {
  background-color: rgba(255,255,255,0.2);
}

.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
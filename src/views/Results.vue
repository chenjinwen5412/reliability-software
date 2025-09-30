<template>
  <div class="results">
    <h2>历史分析结果</h2>
    
    <div v-if="analyses.length === 0" class="empty-state">
      <p>暂无保存的分析结果</p>
      <router-link to="/calculator" class="link-btn">
        去进行首次分析
      </router-link>
    </div>
    
    <div v-else class="analyses-list">
      <div v-for="(analysis, index) in analyses" :key="index" class="analysis-item">
        <h3>分析 {{ index + 1 }}</h3>
        <div class="analysis-details">
          <p><strong>失效率:</strong> {{ analysis.failureRate }}</p>
          <p><strong>任务时间:</strong> {{ analysis.missionTime }} 小时</p>
          <p><strong>组件数量:</strong> {{ analysis.numComponents }}</p>
          <p><strong>系统可靠度:</strong> {{ (analysis.reliability * 100).toFixed(2) }}%</p>
          <p><strong>MTBF:</strong> {{ analysis.mtbf.toFixed(2) }} 小时</p>
          <p><strong>分析时间:</strong> {{ new Date(analysis.timestamp).toLocaleString() }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const analyses = ref([])

onMounted(() => {
  // 从本地存储加载保存的分析结果
  const saved = localStorage.getItem('reliabilityAnalyses')
  if (saved) {
    analyses.value = JSON.parse(saved)
  }
})
</script>

<style scoped>
.results {
  max-width: 800px;
  margin: 0 auto;
}

.empty-state {
  text-align: center;
  padding: 4rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.link-btn {
  display: inline-block;
  margin-top: 1rem;
  padding: 10px 20px;
  background: #667eea;
  color: white;
  text-decoration: none;
  border-radius: 5px;
}

.analyses-list {
  display: grid;
  gap: 1rem;
}

.analysis-item {
  background: white;
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.analysis-details {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 0.5rem;
  margin-top: 1rem;
}
</style>
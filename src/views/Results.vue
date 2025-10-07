<template>
  <div class="results">
    <header class="tool-header">
      <h1>可靠性工程工具</h1>
      <div class="tool-tabs">
        <button class="tab" @click="$router.push('/calculator')">可靠性预计</button>
        <button class="tab active">结果分析</button>
      </div>
    </header>

    <div class="analyses-container">
      <h2>历史分析结果</h2>
      
      <div v-if="analyses.length === 0" class="empty-state">
        <p>暂无保存的分析结果</p>
        <router-link to="/calculator" class="link-btn">
          去进行首次分析
        </router-link>
      </div>
      
      <div v-else class="analyses-list">
        <div v-for="analysis in analyses" :key="analysis.id" class="analysis-item">
          <div class="analysis-header">
            <h3>{{ analysis.systemName }}</h3>
            <button @click="deleteAnalysis(analysis.id)" class="delete-btn">删除</button>
          </div>
          
          <div class="analysis-meta">
            <span class="env-badge">环境: {{ analysis.environmentLabel }}</span>
            <span class="time-badge">分析时间: {{ analysis.timestamp }}</span>
          </div>

          <div class="analysis-content">
            <div class="params-section">
              <h4>系统参数</h4>
              <div class="param-grid">
                <div class="param-item">
                  <label>任务时间:</label>
                  <span>{{ analysis.missionTime }} 小时</span>
                </div>
                <div class="param-item">
                  <label>环境因子:</label>
                  <span>{{ analysis.environmentFactor }}</span>
                </div>
              </div>
            </div>

            <div class="components-section">
              <h4>元器件配置</h4>
              <div class="components-grid">
                <div v-for="(comp, index) in analysis.components" :key="index" class="component-badge">
                  {{ comp.type }} × {{ comp.quantity }}
                  <small>(λ={{ comp.failureRate.toFixed(6) }}/h)</small>
                </div>
              </div>
            </div>

            <div class="results-section">
              <h4>可靠性结果</h4>
              <div class="results-grid">
                <div class="result-badge primary">
                  <label>系统可靠度</label>
                  <span class="value">{{ (analysis.systemReliability * 100).toFixed(2) }}%</span>
                </div>
                <div class="result-badge secondary">
                  <label>总失效率</label>
                  <span class="value">{{ analysis.totalFailureRate.toFixed(8) }}/h</span>
                </div>
                <div class="result-badge tertiary">
                  <label>MTBF</label>
                  <span class="value">{{ analysis.mtbf.toFixed(2) }} h</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <footer class="tool-footer">
      可靠性工程工具 © 2025
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useReliabilityCalc } from '../composables/useReliabilityCalc'

const { getSavedAnalyses, deleteAnalysis } = useReliabilityCalc()
const analyses = ref([])

// 加载保存的分析结果
const loadAnalyses = () => {
  analyses.value = getSavedAnalyses()
  console.log('加载的分析结果:', analyses.value)
}

// 删除分析结果
const handleDeleteAnalysis = (id) => {
  if (confirm('确定要删除这个分析结果吗？')) {
    if (deleteAnalysis(id)) {
      loadAnalyses() // 重新加载列表
      alert('删除成功！')
    } else {
      alert('删除失败！')
    }
  }
}

onMounted(() => {
  loadAnalyses()
})
</script>

<style scoped>
.analyses-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.empty-state {
  text-align: center;
  padding: 4rem;
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
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
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.analysis-item {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
}

.analysis-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.analysis-header h3 {
  margin: 0;
  font-size: 1.3rem;
}

.delete-btn {
  background: rgba(255,255,255,0.2);
  color: white;
  border: 1px solid rgba(255,255,255,0.3);
  padding: 5px 10px;
  border-radius: 4px;
  cursor: pointer;
}

.analysis-meta {
  display: flex;
  gap: 1rem;
  padding: 1rem 1.5rem;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.env-badge, .time-badge {
  background: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.8rem;
  border: 1px solid #dee2e6;
}

.analysis-content {
  padding: 1.5rem;
}

.analysis-content h4 {
  margin: 0 0 1rem 0;
  color: #2c3e50;
  border-bottom: 2px solid #3498db;
  padding-bottom: 0.5rem;
}

.param-grid, .components-grid, .results-grid {
  display: grid;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.param-grid {
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
}

.components-grid {
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
}

.results-grid {
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
}

.param-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.component-badge {
  background: #e3f2fd;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  text-align: center;
  border: 1px solid #bbdefb;
}

.result-badge {
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  color: white;
}

.result-badge.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.result-badge.secondary {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
}

.result-badge.tertiary {
  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
}

.result-badge label {
  display: block;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.result-badge .value {
  display: block;
  font-size: 1.5rem;
  font-weight: bold;
}
</style>

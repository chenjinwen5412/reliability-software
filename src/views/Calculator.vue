<template>
  <div class="calculator">
    <h2>可靠性参数设置</h2>
    
    <div class="input-section">
      <div class="input-group">
        <label>组件失效率 (λ):</label>
        <input 
          v-model.number="failureRate" 
          type="number" 
          step="0.0001"
          min="0"
        >
        <span> failures/hour</span>
      </div>
      
      <div class="input-group">
        <label>任务时间:</label>
        <input 
          v-model.number="missionTime" 
          type="number" 
          step="1"
          min="0"
        >
        <span> hours</span>
      </div>
      
      <div class="input-group">
        <label>组件数量:</label>
        <input 
          v-model.number="numComponents" 
          type="number" 
          step="1"
          min="1"
        >
      </div>
    </div>
    
    <div class="results-preview">
      <h3>实时计算结果</h3>
      <div class="result-cards">
        <div class="result-card">
          <h4>系统可靠度</h4>
          <p class="value">{{ (reliability * 100).toFixed(2) }}%</p>
        </div>
        <div class="result-card">
          <h4>平均无故障时间</h4>
          <p class="value">{{ mtbf.toFixed(2) }} hours</p>
        </div>
      </div>
    </div>
    
    <ReliabilityChart :data="curveData" />
    
    <button @click="saveAnalysis" class="save-btn">
      保存分析结果
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useReliabilityCalc } from '../composables/useReliabilityCalc'
import ReliabilityChart from '../components/ReliabilityChart.vue'

const {
  failureRate,
  missionTime,
  numComponents,
  reliability,
  mtbf,
  generateCurveData
} = useReliabilityCalc()

const curveData = ref(generateCurveData())

// 当参数变化时更新曲线数据
watch([failureRate, numComponents], () => {
  curveData.value = generateCurveData()
})

const saveAnalysis = () => {
  const analysis = {
    failureRate: failureRate.value,
    missionTime: missionTime.value,
    numComponents: numComponents.value,
    reliability: reliability.value,
    mtbf: mtbf.value,
    timestamp: new Date().toISOString()
  }
  
  // 保存到本地存储
  const savedAnalyses = JSON.parse(localStorage.getItem('reliabilityAnalyses') || '[]')
  savedAnalyses.push(analysis)
  localStorage.setItem('reliabilityAnalyses', JSON.stringify(savedAnalyses))
  
  alert('分析结果已保存！')
}
</script>

<style scoped>
.calculator {
  max-width: 800px;
  margin: 0 auto;
}

.input-section {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.input-group {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
}

.input-group label {
  width: 150px;
  font-weight: bold;
}

.input-group input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 120px;
  margin-right: 10px;
}

.results-preview {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
}

.result-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.result-card {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.result-card .value {
  font-size: 2rem;
  font-weight: bold;
  margin-top: 0.5rem;
}

.save-btn {
  background: #4CAF50;
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 1.1rem;
  border-radius: 25px;
  cursor: pointer;
  display: block;
  margin: 2rem auto;
}

.save-btn:hover {
  background: #45a049;
}
</style>
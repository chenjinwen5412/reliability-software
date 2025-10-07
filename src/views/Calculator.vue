<template>
  <div class="calculator">
    <header class="tool-header">
      <h1>可靠性工程工具</h1>
      <div class="tool-tabs">
        <button class="tab active">可靠性预计</button>
        <button class="tab">可靠性分配</button>
      </div>
    </header>

    <div class="system-params">
      <h2>系统参数</h2>
      <div class="param-group">
        <label>系统名称:</label>
        <input v-model="systemName" placeholder="例如：电源控制系统">
      </div>
      <div class="param-group">
        <label>任务时间:</label>
        <input v-model.number="missionTime" type="number" min="0">
        <span>小时</span>
      </div>
      <div class="param-group">
        <label>环境因子:</label>
        <select v-model="environmentFactor">
          <option v-for="env in environmentOptions" :key="env.value" :value="env.value">
            {{ env.label }} ({{ env.value }})
          </option>
        </select>
      </div>
    </div>

    <div class="components-section">
      <h2>元器件配置</h2>
      <div class="components-list">
        <div v-for="(comp, index) in selectedComponents" :key="index" class="component-item">
          <select v-model="comp.type">
            <option v-for="type in Object.keys(componentTypes)" :key="type" :value="type">
              {{ type }}
            </option>
          </select>
          <input v-model.number="comp.quantity" type="number" min="1">
          <span>个</span>
          <button @click="removeComponent(index)" class="remove-btn">删除</button>
        </div>
      </div>
      <button @click="addComponent()" class="add-btn">+ 添加元器件</button>
    </div>

    <div class="results-section">
      <button @click="calculateReliability" class="calculate-btn">计算可靠性</button>
      
      <div v-if="calculationResults.systemReliability > 0" class="results">
        <h3>可靠性分析结果</h3>
        <div class="result-grid">
          <div class="result-item">
            <label>系统总失效率:</label>
            <span>{{ calculationResults.totalFailureRate.toFixed(8) }} failures/hour</span>
          </div>
          <div class="result-item">
            <label>系统可靠度:</label>
            <span>{{ (calculationResults.systemReliability * 100).toFixed(2) }}%</span>
          </div>
          <div class="result-item">
            <label>平均无故障时间:</label>
            <span>{{ calculationResults.mtbf.toFixed(2) }} hours</span>
          </div>
        </div>

        <!-- 可靠性曲线图表 -->
        <ReliabilityChart :data="calculationResults.curveData" />
      </div>
    </div>

    <footer class="tool-footer">
      可靠性工程工具 © 2025
    </footer>
  </div>
</template>

<script setup>
import { useReliabilityCalc } from '../composables/useReliabilityCalc'
import ReliabilityChart from '../components/ReliabilityChart.vue'

const {
  systemName,
  missionTime,
  environmentFactor,
  environmentOptions,
  componentTypes,
  selectedComponents,
  calculationResults,
  calculateReliability,
  addComponent,
  removeComponent
} = useReliabilityCalc()
</script>

<style scoped>
.calculator {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
}

.tool-header {
  text-align: center;
  margin-bottom: 2rem;
}

.tool-header h1 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.tool-tabs {
  display: flex;
  justify-content: center;
  gap: 1rem;
}

.tab {
  padding: 10px 20px;
  border: 2px solid #3498db;
  background: white;
  color: #3498db;
  border-radius: 5px;
  cursor: pointer;
  transition: all 0.3s;
}

.tab.active {
  background: #3498db;
  color: white;
}

.system-params {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.param-group {
  display: flex;
  align-items: center;
  margin-bottom: 1rem;
  gap: 10px;
}

.param-group label {
  width: 100px;
  font-weight: bold;
}

.param-group input, .param-group select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  flex: 1;
}

.components-section {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.components-list {
  margin-bottom: 1rem;
}

.component-item {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 1rem;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 5px;
}

.component-item select, .component-item input {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.component-item select {
  width: 150px;
}

.component-item input {
  width: 80px;
}

.remove-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 5px 10px;
  border-radius: 3px;
  cursor: pointer;
}

.add-btn {
  background: #27ae60;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
}

.results-section {
  background: white;
  padding: 2rem;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.calculate-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 1.1rem;
  border-radius: 25px;
  cursor: pointer;
  display: block;
  margin: 0 auto 2rem;
  transition: transform 0.3s;
}

.calculate-btn:hover {
  transform: translateY(-2px);
}

.results {
  margin-top: 2rem;
}

.result-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.result-item {
  background: linear-gradient(135deg, #74b9ff 0%, #0984e3 100%);
  color: white;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.result-item label {
  display: block;
  font-weight: bold;
  margin-bottom: 0.5rem;
}

.result-item span {
  font-size: 1.2rem;
}

.tool-footer {
  text-align: center;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid #eee;
  color: #7f8c8d;
}
</style>

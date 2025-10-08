<template>
  <div class="calculator">
    <header class="tool-header">
      <h1>可靠性工程工具</h1>
      <div class="tool-tabs">
        <button class="tab active">可靠性预计</button>
        <button class="tab" @click="$router.push('/results')">可靠性分配</button>
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
      <div class="param-group">
        <label>工作温度:</label>
        <input v-model.number="workingTemperature" type="number" min="-100" max="200" placeholder="℃">
        <span>℃</span>
      </div>
    </div>

    <div class="components-section">
      <h2>元器件配置</h2>
      <div class="components-list">
        <div v-for="(comp, index) in selectedComponents" :key="index" class="component-item">
          <div class="component-row">
            <div class="comp-field">
              <label>类型:</label>
              <select v-model="comp.type">
                <option v-for="type in componentTypeOptions" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>

            <div class="comp-field">
              <label>数量:</label>
              <input v-model.number="comp.quantity" type="number" min="1">
            </div>

            <div class="comp-field">
              <label>失效率:</label>
              <input v-model.number="comp.failureRate" type="number" step="0.000001" min="0">
              <span class="unit">/小时</span>
            </div>

            <div class="comp-field">
              <label>描述:</label>
              <input v-model="comp.description" placeholder="组件描述">
            </div>

            <button @click="removeComponent(index)" class="remove-btn">删除</button>
          </div>
        </div>
      </div>
      <button @click="addComponent()" class="add-btn">+ 添加元器件</button>
    </div>

    <div class="results-section">
      <div class="action-buttons">
        <button @click="calculateReliability" class="calculate-btn">计算可靠性</button>
        <button @click="saveAndView" class="save-btn" :disabled="!calculationResults.hasResults">
          保存并查看结果
        </button>
      </div>

      <div v-if="calculationResults.hasResults" class="results">
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
import { useRouter } from 'vue-router'

const router = useRouter()

const {
  systemName,
  missionTime,
  environmentFactor,
  environmentOptions,
  componentTypeOptions,
  selectedComponents,
  calculationResults,
  calculateReliability,
  saveAnalysis,
  addComponent,
  removeComponent
} = useReliabilityCalc()

// 保存并跳转到结果页面
const saveAndView = () => {
  if (saveAnalysis()) {
    alert('分析结果已保存！')
    router.push('/results')
  }
}
</script>

<style scoped>
/* 之前的样式保持不变，只添加新样式 */

.action-buttons {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 2rem;
}

.calculate-btn {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 1.1rem;
  border-radius: 25px;
  cursor: pointer;
  transition: transform 0.3s;
}

.save-btn {
  background: linear-gradient(135deg, #4CAF50 0%, #45a049 100%);
  color: white;
  border: none;
  padding: 12px 30px;
  font-size: 1.1rem;
  border-radius: 25px;
  cursor: pointer;
  transition: transform 0.3s;
}

.save-btn:disabled {
  background: #cccccc;
  cursor: not-allowed;
  transform: none;
}

.calculate-btn:hover, .save-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.component-item {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1rem;
  border: 1px solid #e9ecef;
}

.component-row {
  display: grid;
  grid-template-columns: 1fr 1fr 1.5fr 2fr auto;
  gap: 10px;
  align-items: end;
}

.comp-field {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.comp-field label {
  font-size: 0.8rem;
  font-weight: bold;
  color: #555;
}

.comp-field input, .comp-field select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
}

.unit {
  font-size: 0.8rem;
  color: #666;
  margin-left: 5px;
}

.remove-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  height: fit-content;
}

.add-btn {
  background: #27ae60;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  margin-top: 1rem;
}
</style>

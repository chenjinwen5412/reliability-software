<template>
  <div class="calculator">
    <header class="tool-header">
      <h1>可靠性工程工具</h1>
      <div class="tool-tabs">
        <button class="tab" :class="{active: showMain}" @click="showMain = true">基本可靠性</button>
        <button class="tab" :class="{active: !showMain}" @click="showMain = false">系统可靠性</button>
      </div>
    </header>

    <template v-if="showMain">
      <div class="card-section">
        <!-- 系统参数卡片 -->
        <div class="card">
          <div class="card-title">系统参数</div>
          <div class="card-content">
            <div class="param-grid">
              <div class="param-item">
                <label>系统名称：</label>
                <input v-model="systemName" placeholder="请输入系统名称" />
              </div>
              <div class="param-item">
                <label>任务时间：</label>
                <div class="input-with-unit">
                  <input v-model.number="missionTime" type="number" min="0" />
                  <span class="unit">小时</span>
                </div>
              </div>
              <div class="param-item">
                <label>环境名称：</label>
                <input
                  v-model="environmentName"
                  type="text"
                  placeholder="例如：高温环境、潮湿环境等"
                  required
                >
              </div>
              <div class="param-item">
                <label>环境因子：</label>
                <input
                  v-model.number="environmentFactor"
                  type="number"
                  min="0.1"
                  step="0.1"
                  placeholder="请输入环境因子数值"
                  required
                >
              </div>
            </div>
          </div>
        </div>

        <!-- 元器件配置卡片 -->
        <div class="card">
          <div class="card-title">元器件配置</div>
          <div class="card-content">
            <!-- Excel导入区域 -->
            <div class="excel-import-section">
              <div class="upload-area" @click="triggerFileInput" @drop="handleDrop" @dragover="handleDragOver">
                <input 
                  ref="fileInput"
                  type="file" 
                  accept=".xlsx,.xls,.csv" 
                  @change="handleFileUpload"
                  style="display: none"
                >
                <div class="upload-content">
                  <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4c2.svg" alt="Excel" style="width: 48px; margin-bottom: 12px;">
                  <p>点击或拖拽Excel文件到此区域</p>
                  <small>支持 .xlsx, .xls, .csv 格式</small>
                </div>
              </div>
              
              <!-- Excel模板说明 -->
              <div class="template-info">
                <h4>Excel模板格式：</h4>
                <table class="template-table">
                  <thead>
                    <tr>
                      <th>类型</th>
                      <th>数量</th>
                      <th>失效率</th>
                      <th>描述</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>电阻</td>
                      <td>10</td>
                      <td>0.000001</td>
                      <td>10kΩ碳膜电阻</td>
                    </tr>
                    <tr>
                      <td>集成电路</td>
                      <td>2</td>
                      <td>0.00001</td>
                      <td>运算放大器</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
            
            <!-- 手动添加元器件（保留原有功能） -->
            <div class="manual-add-section">
              <h4>手动添加元器件</h4>
              <div class="add-controls">
                <select v-model="newComponentType" class="type-select">
                  <option v-for="type in componentTypeOptions" :key="type" :value="type">
                    {{ type }}
                  </option>
                </select>
                <button @click="addManualComponent" class="add-manual-btn">+ 添加</button>
              </div>
            </div>

            <!-- 元器件列表展示 -->
            <div v-if="selectedComponents.length > 0" class="components-display">
              <h4>当前元器件 ({{ selectedComponents.length }}个)</h4>
              <div class="components-list">
                <div v-for="(comp, index) in selectedComponents" :key="index" class="component-chip">
                  <span class="chip-main">{{ comp.type }} × {{ comp.quantity }}</span>
                  <span class="chip-detail">λ={{ comp.failureRate }}/h</span>
                  <span class="chip-desc">{{ comp.description }}</span>
                  <button @click="removeComponent(index)" class="remove-btn">删除</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 可靠性结果卡片 -->
        <div class="card">
          <div class="card-title">可靠性结果</div>
          <div class="card-content result-row">
            <div class="result-box purple">
              <div class="result-label">系统可靠度</div>
              <div class="result-value">{{ calculationResults.hasResults ? (calculationResults.systemReliability * 100).toFixed(2) : '--' }}%</div>
            </div>
            <div class="result-box pink">
              <div class="result-label">总失效率</div>
              <div class="result-value">{{ calculationResults.hasResults ? calculationResults.totalFailureRate.toFixed(8) : '--' }}/h</div>
            </div>
            <div class="result-box blue">
              <div class="result-label">MTBF</div>
              <div class="result-value">{{ calculationResults.hasResults ? calculationResults.mtbf.toFixed(2) : '--' }} h</div>
            </div>
          </div>
          <div class="action-buttons">
            <button @click="calculateReliability" class="calculate-btn">计算可靠性</button>
            <button @click="saveAndView" class="save-btn" :disabled="!calculationResults.hasResults">
              保存并查看结果
            </button>
          </div>
          <div v-if="calculationResults.hasResults" class="chart-box">
            <ReliabilityChart :data="calculationResults.curveData" />
          </div>
        </div>
      </div>
    </template>

    <template v-else>
      <div class="blank-section">
        <h2>系统可靠性分析</h2>
        <div class="blank-content">
          <img src="https://cdn.jsdelivr.net/gh/twitter/twemoji@14.0.2/assets/svg/1f4c8.svg" alt="系统可靠性" style="width:64px;margin-bottom:16px;">
          <p>请选择或配置系统参数后进行系统级可靠性分析。</p>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useReliabilityCalc } from '../composables/useReliabilityCalc'
import ReliabilityChart from '../components/ReliabilityChart.vue'
import { useRouter } from 'vue-router'

const showMain = ref(true)
const router = useRouter()
const fileInput = ref(null)
const newComponentType = ref('电阻')

// 从 composable 中获取所有需要的变量和方法
const {
  systemName,
  missionTime,
  environmentName,
  environmentFactor,
  componentTypeOptions,
  selectedComponents,
  calculationResults,
  calculateReliability,
  saveAnalysis,
  addComponent,
  removeComponent,
  importComponentsFromExcel
} = useReliabilityCalc()

// 手动添加元器件
const addManualComponent = () => {
  addComponent(newComponentType.value)
}

// 文件上传相关功能
const triggerFileInput = () => {
  fileInput.value?.click()
}

const handleFileUpload = async (event) => {
  const file = event.target.files[0]
  if (!file) return
  
  await processExcelFile(file)
  // 清空文件输入，允许重复选择同一文件
  event.target.value = ''
}

const handleDrop = (event) => {
  event.preventDefault()
  const file = event.dataTransfer.files[0]
  if (file) {
    processExcelFile(file)
  }
}

const handleDragOver = (event) => {
  event.preventDefault()
}

// 处理Excel文件
const processExcelFile = async (file) => {
  try {
    const result = await importComponentsFromExcel(file)
    
    if (result.success) {
      alert(result.message)
    } else {
      alert(`导入失败: ${result.message}`)
    }
    
  } catch (error) {
    alert('文件处理失败: ' + error.message)
  }
}

// 保存并查看结果
const saveAndView = () => {
  // 验证环境信息是否已输入
  if (!environmentName.value.trim()) {
    alert('请输入环境名称')
    return
  }
  
  if (!environmentFactor.value || isNaN(environmentFactor.value) || environmentFactor.value <= 0) {
    alert('请输入有效的环境因子（大于0的数字）')
    return
  }
  
  if (saveAnalysis()) {
    alert('分析结果已保存！')
    router.push('/results')
  }
}
</script>

<style scoped>
/* 保持原有所有样式不变，只添加新样式 */

.card-section {
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.card {
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(102,126,234,0.10);
  padding: 24px 32px;
  margin-bottom: 0;
}
.card-title {
  font-size: 1.2rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 18px;
}
.card-content {
  margin-bottom: 12px;
}

/* 系统参数网格布局 */
.param-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.param-item {
  display: flex;
  align-items: center;
}

.param-item label {
  color: #764ba2;
  font-weight: 600;
  margin-right: 12px;
  display: inline-block;
  width: 90px;
  text-align: right;
  white-space: nowrap;
}

.input-with-unit {
  display: flex;
  align-items: center;
  flex: 1;
}

.unit {
  margin-left: 8px;
  color: #666;
  white-space: nowrap;
}

/* Excel导入区域样式 */
.excel-import-section {
  margin-bottom: 2rem;
}

.upload-area {
  border: 2px dashed #667eea;
  border-radius: 12px;
  padding: 3rem 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: #f8f9ff;
}

.upload-area:hover {
  background: #eef1ff;
  border-color: #764ba2;
}

.upload-content p {
  margin: 0.5rem 0;
  color: #667eea;
  font-weight: 500;
}

.upload-content small {
  color: #888;
}

.template-info {
  margin-top: 2rem;
  padding: 1rem;
  background: #f5f7fa;
  border-radius: 8px;
}

.template-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 0.5rem;
}

.template-table th,
.template-table td {
  border: 1px solid #ddd;
  padding: 0.5rem;
  text-align: center;
}

.template-table th {
  background: #667eea;
  color: white;
}

/* 手动添加区域 */
.manual-add-section {
  margin: 2rem 0;
  padding: 1rem;
  background: #f9f9f9;
  border-radius: 8px;
}

.manual-add-section h4 {
  margin-bottom: 1rem;
  color: #667eea;
}

.add-controls {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.type-select {
  padding: 8px 12px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: white;
}

.add-manual-btn {
  background: #27ae60;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
}

/* 元器件列表展示 */
.components-display {
  margin-top: 2rem;
}

.components-display h4 {
  margin-bottom: 1rem;
  color: #667eea;
}

.components-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.component-chip {
  display: flex;
  align-items: center;
  background: #e3e8ff;
  border-radius: 8px;
  padding: 8px 16px;
  gap: 12px;
  font-size: 0.95rem;
}

.chip-main {
  font-weight: 600;
  color: #667eea;
}

.chip-detail {
  color: #666;
  font-size: 0.9rem;
}

.chip-desc {
  color: #888;
  font-size: 0.9rem;
  flex: 1;
}

/* 结果展示区域 */
.result-row {
  display: flex;
  gap: 32px;
  margin-bottom: 18px;
}
.result-box {
  flex: 1;
  border-radius: 12px;
  padding: 18px 0;
  text-align: center;
  color: #fff;
  font-weight: bold;
  box-shadow: 0 2px 12px rgba(102,126,234,0.08);
}
.result-box.purple {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
.result-box.pink {
  background: linear-gradient(135deg, #f797a7 0%, #f7b2e7 100%);
}
.result-box.blue {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: #222;
}
.result-label {
  font-size: 1rem;
  margin-bottom: 10px;
  font-weight: 500;
}
.result-value {
  font-size: 2rem;
  font-weight: bold;
}
.chart-box {
  margin-top: 24px;
}
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
.remove-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
}

/* 标签页样式 */
.tool-tabs {
  display: flex;
  gap: 20px;
  justify-content: center;
  margin: 24px 0;
}
.tab {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #fff;
  border: none;
  padding: 12px 36px;
  font-size: 1.1rem;
  border-radius: 25px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(102,126,234,0.15);
  transition: background 0.3s, transform 0.2s;
  font-weight: 500;
}
.tab.active {
  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
  color: #222;
  transform: scale(1.08);
  box-shadow: 0 4px 16px rgba(67,233,123,0.15);
}
.tab:hover:not(.active) {
  background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
  color: #333;
  transform: scale(1.04);
}
.calculator {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(102,126,234,0.12);
  padding: 32px 24px;
  max-width: 900px;
  margin: 32px auto;
}
.tool-header h1 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #667eea;
  text-align: center;
  margin-bottom: 0.5em;
  letter-spacing: 2px;
}

/* 输入框样式 */
.param-item input,
.param-item select {
  border: 1px solid #d1d5db;
  border-radius: 8px;
  padding: 8px 14px;
  font-size: 1rem;
  background: #f5f7fa;
  transition: border-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 2px 8px rgba(102,126,234,0.06);
  outline: none;
  flex: 1;
  min-width: 0;
}

.param-item input:focus,
.param-item select:focus {
  border-color: #667eea;
  box-shadow: 0 0 0 2px #667eea33;
  background: #fff;
}

/* 空白页面样式 */
.blank-section {
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(102,126,234,0.12);
  padding: 48px 24px;
  max-width: 600px;
  margin: 48px auto;
  text-align: center;
}
.blank-section h2 {
  font-size: 1.5rem;
  color: #764ba2;
  margin-bottom: 24px;
  font-weight: 600;
}
.blank-content p {
  color: #888;
  font-size: 1.1rem;
  margin-top: 12px;
}

/* 响应式调整 */
@media (max-width: 768px) {
  .param-grid {
    grid-template-columns: 1fr;
  }
  
  .result-row {
    flex-direction: column;
    gap: 1rem;
  }
  
  .action-buttons {
    flex-direction: column;
    align-items: center;
  }
}
</style>

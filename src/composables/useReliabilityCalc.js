import { ref } from 'vue'

export function useReliabilityCalc() {
  // 系统参数
  const systemName = ref('电源控制系统')
  const missionTime = ref(1000)
  const environmentFactor = ref(2.0)
  
  // 环境因子选项
  const environmentOptions = [
    { label: '实验室', value: 1.0 },
    { label: '地面固定', value: 2.0 },
    { label: '车载', value: 4.0 },
    { label: '机载', value: 8.0 },
    { label: '舰载', value: 10.0 }
  ]
  
  // 元器件类型选项
  const componentTypeOptions = [
    '电阻', '电容', '集成电路', '晶体管', '连接器', 
    '电感', '二极管', '变压器', '继电器', '传感器'
  ]

  // 用户选择的元器件（包含用户输入的失效率）
  const selectedComponents = ref([
    { 
      type: '电阻', 
      quantity: 10, 
      failureRate: 0.000001,
      description: '10kΩ 碳膜电阻'
    },
    { 
      type: '集成电路', 
      quantity: 2, 
      failureRate: 0.00001,
      description: '运算放大器'
    }
  ])

  // 计算结果
  const calculationResults = ref({
    totalFailureRate: 0,
    systemReliability: 0,
    mtbf: 0,
    curveData: [],
    hasResults: false
  })

  // 计算总失效率（使用用户输入的失效率）
  const calculateTotalFailureRate = () => {
    return selectedComponents.value.reduce((sum, comp) => {
      const adjustedRate = comp.failureRate * environmentFactor.value
      return sum + (adjustedRate * comp.quantity)
    }, 0)
  }

  // 生成可靠性曲线数据
  const generateCurveData = (totalFailureRate, timeRange = 500) => {
    const data = []
    for (let t = 0; t <= timeRange; t += 10) {
      data.push({
        time: t,
        reliability: Math.exp(-totalFailureRate * t)
      })
    }
    return data
  }

  // 执行可靠性计算
  const calculateReliability = () => {
    const totalFailureRate = calculateTotalFailureRate()
    const systemReliability = Math.exp(-totalFailureRate * missionTime.value)
    const mtbf = 1 / totalFailureRate
    const curveData = generateCurveData(totalFailureRate)

    calculationResults.value = {
      totalFailureRate,
      systemReliability,
      mtbf,
      curveData,
      hasResults: true
    }

    return calculationResults.value
  }

  // 保存分析结果到本地存储
  const saveAnalysis = () => {
    if (!calculationResults.value.hasResults) {
      alert('请先进行计算！')
      return false
    }

    const analysis = {
      id: Date.now(), // 唯一ID
      systemName: systemName.value,
      missionTime: missionTime.value,
      environmentFactor: environmentFactor.value,
      environmentLabel: environmentOptions.find(env => env.value === environmentFactor.value)?.label || '未知',
      components: JSON.parse(JSON.stringify(selectedComponents.value)), // 深拷贝
      totalFailureRate: calculationResults.value.totalFailureRate,
      systemReliability: calculationResults.value.systemReliability,
      mtbf: calculationResults.value.mtbf,
      timestamp: new Date().toLocaleString('zh-CN')
    }
    
    try {
      // 从本地存储获取现有分析
      const savedAnalyses = JSON.parse(localStorage.getItem('reliabilityAnalyses') || '[]')
      
      // 添加新分析
      savedAnalyses.unshift(analysis) // 新的放在前面
      
      // 保存回本地存储
      localStorage.setItem('reliabilityAnalyses', JSON.stringify(savedAnalyses))
      
      console.log('分析结果已保存:', analysis)
      return true
    } catch (error) {
      console.error('保存分析结果失败:', error)
      alert('保存失败，请检查控制台信息')
      return false
    }
  }

  // 获取所有保存的分析结果
  const getSavedAnalyses = () => {
    try {
      return JSON.parse(localStorage.getItem('reliabilityAnalyses') || '[]')
    } catch (error) {
      console.error('读取分析结果失败:', error)
      return []
    }
  }

  // 删除分析结果
  const deleteAnalysis = (id) => {
    try {
      const savedAnalyses = getSavedAnalyses()
      const updatedAnalyses = savedAnalyses.filter(analysis => analysis.id !== id)
      localStorage.setItem('reliabilityAnalyses', JSON.stringify(updatedAnalyses))
      return true
    } catch (error) {
      console.error('删除分析结果失败:', error)
      return false
    }
  }

  // 添加新元器件
  const addComponent = (type = '电阻') => {
    const defaultFailureRates = {
      '电阻': 0.000001,
      '电容': 0.000002,
      '集成电路': 0.00001,
      '晶体管': 0.000005,
      '连接器': 0.000003,
      '电感': 0.0000015,
      '二极管': 0.000004,
      '变压器': 0.000008,
      '继电器': 0.000015,
      '传感器': 0.000012
    }

    selectedComponents.value.push({
      type: type,
      quantity: 1,
      failureRate: defaultFailureRates[type] || 0.000001,
      description: `${type}组件`
    })
  }

  // 删除元器件
  const removeComponent = (index) => {
    selectedComponents.value.splice(index, 1)
  }

  return {
    systemName,
    missionTime,
    environmentFactor,
    environmentOptions,
    componentTypeOptions,
    selectedComponents,
    calculationResults,
    calculateReliability,
    saveAnalysis,
    getSavedAnalyses,
    deleteAnalysis,
    addComponent,
    removeComponent
  }
}

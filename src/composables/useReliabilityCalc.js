import { ref } from 'vue'

export function useReliabilityCalc() {
  // 系统参数
  const systemName = ref('电源控制系统')
  const missionTime = ref(1000)
  const workingTemperature = ref(25)
  
  // 环境相关参数 - 支持输入环境名称和因子值
  const environmentName = ref('地面固定环境')  // 环境名称
  const environmentFactor = ref(2.0)             // 环境因子数值

  // 元器件类型选项
  const componentTypeOptions = [
    '电阻', '电容', '集成电路', '晶体管', '连接器', 
    '电感', '二极管', '变压器', '继电器', '传感器'
  ]

  // 用户选择的元器件
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

  // Excel解析功能
  const parseExcelData = (file) => {
    return new Promise((resolve, reject) => {
      try {
        // 模拟Excel解析 - 实际使用时需要集成xlsx库
        // 这里用setTimeout模拟异步文件读取
        setTimeout(() => {
          // 模拟从Excel读取的数据
          const mockExcelData = [
            { type: '电阻', quantity: '15', failureRate: '0.000001', description: '10kΩ碳膜电阻' },
            { type: '电容', quantity: '8', failureRate: '0.000002', description: '100μF电解电容' },
            { type: '集成电路', quantity: '3', failureRate: '0.00001', description: '运算放大器' },
            { type: '晶体管', quantity: '5', failureRate: '0.000005', description: 'NPN晶体管' }
          ]
          
          const components = mockExcelData.map(row => ({
            type: row.type || '电阻',
            quantity: parseInt(row.quantity) || 1,
            failureRate: parseFloat(row.failureRate) || 0.000001,
            description: row.description || `${row.type}组件`
          }))
          
          resolve(components)
        }, 500)
      } catch (error) {
        reject(new Error('Excel文件解析失败: ' + error.message))
      }
    })
  }

  // 批量导入Excel元器件
  const importComponentsFromExcel = async (file) => {
    try {
      const newComponents = await parseExcelData(file)
      
      // 清空现有元器件，替换为导入的数据
      selectedComponents.value = newComponents
      
      return {
        success: true,
        count: newComponents.length,
        message: `成功导入 ${newComponents.length} 个元器件`
      }
    } catch (error) {
      return {
        success: false,
        count: 0,
        message: error.message
      }
    }
  }

  // 手动添加单个元器件（保留原有功能）
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

  // 计算总失效率
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
    // 验证环境名称和因子是否有效
    if (!environmentName.value.trim()) {
      alert('请输入环境名称')
      return false
    }
    
    if (!environmentFactor.value || isNaN(environmentFactor.value) || environmentFactor.value <= 0) {
      alert('请输入有效的环境因子（大于0的数字）')
      return false
    }
    
    // 验证是否有元器件
    if (selectedComponents.value.length === 0) {
      alert('请先添加或导入元器件')
      return false
    }
    
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

  // 保存分析结果
  const saveAnalysis = () => {
    if (!calculationResults.value.hasResults) {
      alert('请先进行计算！')
      return false
    }

    const analysis = {
      id: Date.now(),
      systemName: systemName.value,
      missionTime: missionTime.value,
      environmentName: environmentName.value,
      environmentFactor: environmentFactor.value,
      components: JSON.parse(JSON.stringify(selectedComponents.value)),
      totalFailureRate: calculationResults.value.totalFailureRate,
      systemReliability: calculationResults.value.systemReliability,
      mtbf: calculationResults.value.mtbf,
      timestamp: new Date().toLocaleString('zh-CN')
    }
    
    try {
      const savedAnalyses = JSON.parse(localStorage.getItem('reliabilityAnalyses') || '[]')
      savedAnalyses.unshift(analysis)
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

  return {
    systemName,
    missionTime,
    environmentName,
    environmentFactor,
    componentTypeOptions,
    selectedComponents,
    calculationResults,
    calculateReliability,
    saveAnalysis,
    getSavedAnalyses,
    deleteAnalysis,
    addComponent,
    removeComponent,
    importComponentsFromExcel,
    workingTemperature
  }
}

import { ref, computed } from 'vue'

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
  
  // 元器件数据库
  const componentTypes = {
    '电阻': { baseFailureRate: 0.000001 },
    '电容': { baseFailureRate: 0.000002 },
    '集成电路': { baseFailureRate: 0.00001 },
    '晶体管': { baseFailureRate: 0.000005 },
    '连接器': { baseFailureRate: 0.000003 },
    '电感': { baseFailureRate: 0.0000015 },
    '二极管': { baseFailureRate: 0.000004 }
  }
  
  // 用户选择的元器件
  const selectedComponents = ref([
    { type: '电阻', quantity: 10 },
    { type: '集成电路', quantity: 2 }
  ])

  // 计算结果（初始为0，点击计算后更新）
  const calculationResults = ref({
    totalFailureRate: 0,
    systemReliability: 0,
    mtbf: 0,
    curveData: []
  })

  // 计算总失效率
  const calculateTotalFailureRate = () => {
    return selectedComponents.value.reduce((sum, comp) => {
      const baseRate = componentTypes[comp.type].baseFailureRate
      const adjustedRate = baseRate * environmentFactor.value
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
      curveData
    }

    return calculationResults.value
  }

  // 添加新元器件
  const addComponent = (type = '电阻') => {
    selectedComponents.value.push({
      type: type,
      quantity: 1
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
    componentTypes,
    selectedComponents,
    calculationResults,
    calculateReliability,
    addComponent,
    removeComponent
  }
}

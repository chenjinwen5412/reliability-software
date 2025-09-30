import { ref, computed } from 'vue'

export function useReliabilityCalc() {
  // 输入参数
  const failureRate = ref(0.001) // 失效率
  const missionTime = ref(100)   // 任务时间
  const numComponents = ref(1)   // 组件数量
  
  // 可靠性计算
  const reliability = computed(() => {
    const λ = failureRate.value
    const t = missionTime.value
    const n = numComponents.value
    
    // 简单指数分布可靠性计算
    return Math.exp(-λ * t * n)
  })
  
  // MTBF计算
  const mtbf = computed(() => {
    return 1 / (failureRate.value * numComponents.value)
  })
  
  // 生成可靠性曲线数据
  const generateCurveData = (timeRange = 500) => {
    const data = []
    const λ = failureRate.value
    const n = numComponents.value
    
    for (let t = 0; t <= timeRange; t += 10) {
      data.push({
        time: t,
        reliability: Math.exp(-λ * t * n)
      })
    }
    
    return data
  }
  
  return {
    failureRate,
    missionTime,
    numComponents,
    reliability,
    mtbf,
    generateCurveData
  }
}
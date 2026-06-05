import { apiGet, apiPatch, apiPost } from './api'

/**
 * 将覆盖数据同步到 Supabase data_overrides 表。
 * 先读取云端当前 payload → 深度合并 → 写回。
 * 如果行不存在则自动创建。
 */
export async function pushOverride(
  id: string,
  mergePayload: Record<string, unknown>,
): Promise<boolean> {
  try {
    // 1. 读取当前云端数据
    const data = await apiGet(
      `/rest/v1/data_overrides?id=eq.${encodeURIComponent(id)}&select=payload&limit=1`,
    )

    let merged: Record<string, unknown>

    if (Array.isArray(data) && data.length === 1 && data[0].payload) {
      // 已有数据 → 深度合并
      const existing = data[0].payload as Record<string, unknown>
      merged = { ...existing, ...mergePayload }
      // 用 PATCH 更新
      await apiPatch(
        `/rest/v1/data_overrides?id=eq.${encodeURIComponent(id)}`,
        { payload: merged },
      )
    } else {
      // 新创建
      merged = mergePayload
      await apiPost('/rest/v1/data_overrides', { id, payload: merged })
    }

    return true
  } catch (e) {
    console.warn(`pushOverride(${id}) 失败，数据仅保存在本地:`, e)
    return false
  }
}

/**
 * 从 Supabase 拉取所有覆盖数据
 */
export async function pullOverrides(): Promise<{
  mvpOverrides: Record<string, boolean>
  scoreOverrides: Record<string, unknown>
  statusOverrides: Record<string, unknown>
} | null> {
  try {
    const data = await apiGet('/rest/v1/data_overrides?select=id,payload')
    if (!Array.isArray(data)) return null

    const result = {
      mvpOverrides: {} as Record<string, boolean>,
      scoreOverrides: {} as Record<string, unknown>,
      statusOverrides: {} as Record<string, unknown>,
    }

    for (const row of data) {
      if (row.id === 'mvp') result.mvpOverrides = row.payload as Record<string, boolean>
      else if (row.id === 'score') result.scoreOverrides = row.payload as Record<string, unknown>
      else if (row.id === 'status') result.statusOverrides = row.payload as Record<string, unknown>
    }

    return result
  } catch {
    return null
  }
}

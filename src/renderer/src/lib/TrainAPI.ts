export type Train = {
  id: number
  name: string
  header_image_path: string | null

  // 追加
  ver?: string | null
  description?: string
  download_link?: string | null
  download_pass?: string | null
  terms?: string | null

  area_tohoku?: boolean
  area_kanto?: boolean
  area_kansai?: boolean
  area_kyushu?: boolean
  area_other?: boolean
  area_overseas?: boolean
  area_fictional?: boolean
  door_opening_closing?: boolean
  running_sound?: boolean
  announcement?: boolean
  ATS?: boolean
  special_lighting?: boolean
  door_behavior?: boolean
  pantograph_behavior?: boolean
  in_car_equipment?: boolean
  drivers_cab?: boolean
}

// .envから読み込む
const API_BASE = import.meta.env.VITE_API_BASE_URL

export async function fetchTrainList(options?: { signal?: AbortSignal }): Promise<Train[]> {
  const url = `${API_BASE}/TrainList.php`

  const res = await fetch(url, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    signal: options?.signal,
    cache: 'no-store'
  })

  if (!res.ok) throw new Error(`TrainList request failed: ${res.status} ${res.statusText}`)
  return res.json()
}

// src/renderer/src/components/trains/TrainList.tsx
import { useEffect, useState, JSX } from 'react'
import { Box, Spinner, Text, Card, Image, Badge, Wrap } from '@chakra-ui/react'
import { fetchTrainList, Train } from '../../lib/TrainAPI'

export default function TrainList(): JSX.Element {
  const [trains, setTrains] = useState<Train[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // 画像URL組み立て: `/public_html` を外してドメイン付与
  const buildImageUrl = (p: string | null): string | undefined => {
    if (!p) return undefined
    let path = p.trim()
    if (path.startsWith('http')) return path
    if (path.startsWith('/public_html/')) path = path.replace('/public_html', '')
    const origin = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || ''
    if (path.startsWith('/')) return `${origin}${path}`
    return `${origin}/${path}`
  }

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchTrainList()
      .then((data) => {
        if (mounted) {
          setTrains(data)
          setError(null)
        }
      })
      .catch((err) => mounted && setError(err.message))
      .finally(() => mounted && setLoading(false))
    return () => {
      mounted = false
    }
  }, [])

  if (loading) return <Spinner />
  if (error) return <Text color="red.500">Error: {error}</Text>

  return (
    // リスト全体も固定幅（App側で1024pxにしてるなら合わせてOK）
    <Box display="flex" flexDirection="column" gap="16px" w="960px">
      {trains.map((t) => {
        const img = buildImageUrl(t.header_image_path)
        return (
          <Card.Root
            key={t.id}
            overflow="hidden"
            // 横並びにする（固定レイアウト）
            display="grid"
            gridTemplateColumns="320px 1fr"
            w="960px"
            minH="200px"
          >
            {/* 左：画像エリア（固定幅・固定高さ） */}
            <Box w="320px" h="200px" bg="bg.muted">
              {img && (
                <Image
                  src={img}
                  alt={t.name}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                  loading="lazy"
                  onError={(e) => ((e.currentTarget as HTMLImageElement).style.display = 'none')}
                />
              )}
            </Box>

            {/* 右：本文 */}
            <Card.Body gap="3" p="4">
              <Card.Title fontSize="xl">{t.name}</Card.Title>

              {/* エリア系バッジ */}
              <Wrap gap="2">
                {t.area_tohoku && <Badge variant="solid" colorPalette="orange" size="sm">東北</Badge>}
                {t.area_kanto && <Badge variant="solid" colorPalette="orange" size="sm">関東</Badge>}
                {t.area_kansai && <Badge variant="solid" colorPalette="orange" size="sm">関西</Badge>}
                {t.area_kyushu && <Badge variant="solid" colorPalette="orange" size="sm">九州</Badge>}
                {t.area_other && <Badge variant="solid" colorPalette="gray" size="sm">その他</Badge>}
                {t.area_overseas && <Badge variant="solid" colorPalette="purple" size="sm">海外</Badge>}
                {t.area_fictional && <Badge variant="solid" colorPalette="pink" size="sm">架空</Badge>}
              </Wrap>

              {/* 機能系バッジ */}
              <Wrap gap="2">
                {t.door_opening_closing && <Badge size="sm">ドア開閉</Badge>}
                {t.running_sound && <Badge size="sm">走行音</Badge>}
                {t.announcement && <Badge size="sm">アナウンス</Badge>}
                {t.ATS && <Badge size="sm">ATS</Badge>}
                {t.special_lighting && <Badge size="sm">特殊照明</Badge>}
                {t.door_behavior && <Badge size="sm">ドア挙動</Badge>}
                {t.pantograph_behavior && <Badge size="sm">パンタグラフ</Badge>}
                {t.in_car_equipment && <Badge size="sm">車内機器</Badge>}
                {t.drivers_cab && <Badge size="sm">運転台</Badge>}
              </Wrap>
            </Card.Body>
          </Card.Root>
        )
      })}
    </Box>
  )
}

import { useEffect, useState, JSX } from 'react'
import { Box, Text, Skeleton, SkeletonText, Badge, Wrap, Image, Card } from '@chakra-ui/react'
import { fetchTrainList, Train } from '../../lib/TrainAPI'

export default function TrainList(): JSX.Element {
  const [trains, setTrains] = useState<Train[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
      .catch((err) => {
        if (mounted) setError(err.message)
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  if (loading) {
    return (
      <Box display="flex" flexDirection="column" gap="16px" w="960px" mx="auto">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card.Root
            key={i}
            overflow="hidden"
            display="grid"
            gridTemplateColumns="320px 1fr"
            w="960px"
            minH="200px"
          >
            {/* 左：画像スケルトン */}
            <Box w="320px" h="200px" bg="bg.muted">
              <Skeleton w="100%" h="100%" />
            </Box>

            {/* 右：本文スケルトン */}
            <Card.Body gap="3" p="4">
              <Skeleton height="24px" width="60%" mb={3} />
              <SkeletonText noOfLines={2} mt={2} />
              <Wrap gap="2" mt={3}>
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} w="60px" h="20px" borderRadius="md" />
                ))}
              </Wrap>
            </Card.Body>
          </Card.Root>
        ))}
      </Box>
    )
  }

  if (error) {
    return <Text color="red.500">Error: {error}</Text>
  }

  return (
    <Box display="flex" flexDirection="column" gap="16px" w="960px">
      {trains.map((t) => {
        const img = buildImageUrl(t.header_image_path)
        return (
          <Card.Root
            key={t.id}
            overflow="hidden"
            display="grid"
            gridTemplateColumns="320px 1fr"
            w="960px"
            minH="200px"
          >
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

            <Card.Body gap="3" p="4">
              <Card.Title fontSize="xl">{t.name}</Card.Title>

              <Wrap gap="2">
                {t.area_tohoku && <Badge variant="solid" colorPalette="orange" size="sm">東北</Badge>}
                {t.area_kanto && <Badge variant="solid" colorPalette="orange" size="sm">関東</Badge>}
                {t.area_kansai && <Badge variant="solid" colorPalette="orange" size="sm">関西</Badge>}
                {t.area_kyushu && <Badge variant="solid" colorPalette="orange" size="sm">九州</Badge>}
                {t.area_other && <Badge variant="solid" colorPalette="gray" size="sm">その他</Badge>}
                {t.area_overseas && <Badge variant="solid" colorPalette="purple" size="sm">海外</Badge>}
                {t.area_fictional && <Badge variant="solid" colorPalette="pink" size="sm">架空</Badge>}
              </Wrap>

              <Wrap gap="2" mt={2}>
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

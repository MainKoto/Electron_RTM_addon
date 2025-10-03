// src/renderer/src/components/trains/TrainList.tsx
import { useEffect, useState, JSX } from 'react'
import { Box, Text, Skeleton, SkeletonText, Badge, Wrap, Image, Card } from '@chakra-ui/react'
import { fetchTrainList, Train } from '../../lib/TrainAPI'
import { useSelectedTrain } from '../../state/SelectedTrainContext'

type TrainWithTimestamps = {
  image_updated_at?: string | number
  updated_at?: string | number
}

function getCacheBustFromTrain(t: Train, fallback: number): string | number {
  const maybe = t as unknown as TrainWithTimestamps
  return maybe.image_updated_at ?? maybe.updated_at ?? fallback
}

export default function TrainList(): JSX.Element {
  const [trains, setTrains] = useState<Train[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [dataVersion, setDataVersion] = useState<number>(() => Date.now())
  const { setSelected, setPanelOpen } = useSelectedTrain()

  const buildImageUrl = (p: string | null, cacheBust?: string | number): string | undefined => {
    if (!p) return undefined
    let path = p.trim()

    if (path.startsWith('http')) {
      return cacheBust ? `${path}${path.includes('?') ? '&' : '?'}cb=${cacheBust}` : path
    }
    if (path.startsWith('/public_html/')) path = path.replace('/public_html', '')

    const origin = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || ''
    const base = path.startsWith('/') ? `${origin}${path}` : `${origin}/${path}`
    return cacheBust ? `${base}${base.includes('?') ? '&' : '?'}cb=${cacheBust}` : base
  }

  useEffect(() => {
    let mounted = true
    setLoading(true)
    fetchTrainList()
      .then((data) => {
        if (!mounted) return
        setTrains(data)
        setError(null)
        setDataVersion(Date.now())
      })
      .catch((err) => {
        if (mounted) setError(err.message || 'Failed to load')
      })
      .finally(() => {
        if (mounted) setLoading(false)
      })
    return () => {
      mounted = false
    }
  }, [])

  function LeftWrap({ children }: { children: React.ReactNode }): JSX.Element {
    return (
      <Box w="100%" display="flex" justifyContent="flex-start">
        <Box display="flex" flexDirection="column" gap="16px" width="100%">
          {children}
        </Box>
      </Box>
    )
  }

  if (loading) {
    return (
      <LeftWrap>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card.Root
            key={i}
            overflow="hidden"
            display="grid"
            w="100%"
            gridTemplateColumns={{ base: '1fr', md: '320px 1fr' }}
            minH="200px"
          >
            <Box w={{ base: '100%', md: '320px' }} h="200px" bg="bg.muted">
              <Skeleton w="100%" h="100%" />
            </Box>
            <Card.Body gap="3" p="4" minW={0}>
              <Skeleton height="24px" width="40%" mb={3} />
              <SkeletonText noOfLines={2} mt={2} />
              <Wrap gap="2" mt={3}>
                {Array.from({ length: 6 }).map((_, j) => (
                  <Skeleton key={j} w="64px" h="20px" borderRadius="md" />
                ))}
              </Wrap>
            </Card.Body>
          </Card.Root>
        ))}
      </LeftWrap>
    )
  }

  if (error) {
    return (
      <LeftWrap>
        <Text color="red.500">Error: {error}</Text>
      </LeftWrap>
    )
  }

  return (
    <LeftWrap>
      {trains.map((t) => {
        const cb = getCacheBustFromTrain(t, dataVersion)
        const img = buildImageUrl(t.header_image_path, cb)

        return (
          <Card.Root
            key={t.id}
            overflow="hidden"
            display="grid"
            w="100%"
            gridTemplateColumns={{ base: '1fr', md: '320px 1fr' }}
            minH="200px"
          >
            <Box w={{ base: '100%', md: '320px' }} h="200px" bg="bg.muted">
              {img && (
                <Image
                  key={img}
                  src={img}
                  alt={t.name}
                  w="100%"
                  h="100%"
                  objectFit="cover"
                  loading="lazy"
                  draggable={false}
                  userSelect="none"
                  onError={() => console.warn('image load failed:', img)}
                />
              )}
            </Box>

            <Card.Body gap="3" p="4" minW={0}>
              <Card.Title
                fontSize="xl"
                cursor="pointer"
                _hover={{ textDecoration: 'underline' }}
                onClick={() => {
                  setSelected(t)
                  setPanelOpen(true) // ← タイトルクリックでパネル表示
                }}
              >
                {t.name}
              </Card.Title>

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
    </LeftWrap>
  )
}

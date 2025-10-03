import { JSX, useCallback, useEffect, useMemo, useState } from 'react'
import {
  Box,
  Card,
  Image,
  Skeleton,
  IconButton,
  Text,
  Wrap,
  Badge,
  Stack,
  Flex,
  Blockquote,
  Select,
  Button
} from '@chakra-ui/react'
import { createListCollection } from '@ark-ui/react'
import { LuPanelLeftOpen } from 'react-icons/lu'
import { useSelectedTrain } from '../../state/SelectedTrainContext'
import { useTermsDialog } from '../../state/TermsDialogContext'
import type { Train } from '../../lib/TrainAPI'

export const PANEL_WIDTH_PX = 500
const THUMB_HEIGHT_PX = Math.round((PANEL_WIDTH_PX * 9) / 16)

type TrainWithTimestamps = { image_updated_at?: string | number; updated_at?: string | number }
const getCacheBustFromTrain = (t: Train): string | number | undefined =>
  (t as unknown as TrainWithTimestamps).image_updated_at ??
  (t as unknown as TrainWithTimestamps).updated_at

function buildImageUrl(p: string | null, cb?: string | number): string | undefined {
  if (!p) return undefined
  let path = p.trim()
  if (path.startsWith('http')) return cb ? `${path}${path.includes('?') ? '&' : '?'}cb=${cb}` : path
  if (path.startsWith('/public_html/')) path = path.replace('/public_html', '')
  const origin = import.meta.env.VITE_API_BASE_URL?.replace(/\/+$/, '') || ''
  const base = path.startsWith('/') ? `${origin}${path}` : `${origin}/${path}`
  return cb ? `${base}${base.includes('?') ? '&' : '?'}cb=${cb}` : base
}

// utils
const splitVersions = (v?: string | null): string[] =>
  v
    ? v
        .split('/')
        .map((s) => s.trim())
        .filter(Boolean)
    : []

const splitLinks = (s?: string | null): string[] => {
  if (!s) return []
  const raw = s.trim()
  if (!raw) return []
  if (raw.startsWith('[')) {
    try {
      const arr = JSON.parse(raw)
      if (Array.isArray(arr)) return arr.map((x) => String(x).trim()).filter(Boolean)
    } catch {
      /* ignore */
    }
  }
  const delim = raw.includes('|') ? '|' : '\n'
  return raw
    .split(delim)
    .map((t) => t.trim())
    .filter(Boolean)
}

export default function TrainDetailPanel(): JSX.Element {
  const { selected, panelOpen, setPanelOpen } = useSelectedTrain()
  const { openDialog } = useTermsDialog()

  const [selectionVersion, setSelectionVersion] = useState(0)
  useEffect(() => {
    if (!selected) return
    const ts = getCacheBustFromTrain(selected)
    setSelectionVersion(ts ? 0 : Date.now())
  }, [selected])

  const cacheBust = selected
    ? (getCacheBustFromTrain(selected) ?? (selectionVersion || undefined))
    : undefined
  const img = selected ? buildImageUrl(selected.header_image_path, cacheBust) : undefined

  const slideStyle: React.CSSProperties = {
    transform: panelOpen ? 'translateX(0%)' : 'translateX(100%)',
    opacity: panelOpen ? 1 : 0,
    transition: 'transform 220ms ease, opacity 220ms ease',
    pointerEvents: panelOpen ? 'auto' : 'none'
  }

  // versions & links
  const versions = useMemo(() => splitVersions(selected?.ver), [selected?.ver])
  const links = useMemo(() => splitLinks(selected?.download_link), [selected?.download_link])

  const items = useMemo(() => versions.map((v) => ({ label: v, value: v })), [versions])
  const collection = useMemo(() => createListCollection({ items }), [items])

  const defaultVersion = items[0]?.value
  const [currentVersion, setCurrentVersion] = useState<string | undefined>(defaultVersion)
  useEffect(() => setCurrentVersion(defaultVersion), [defaultVersion])

  const getDownloadUrl = useCallback(
    (ver?: string): string | undefined => {
      if (links.length === 0) return undefined
      if (!ver) return links[0]
      const idx = versions.indexOf(ver)
      return links[idx] ?? links[0]
    },
    [links, versions]
  )
  const downloadUrl = getDownloadUrl(currentVersion)

  const performDownload = useCallback((url: string, filename: string): void => {
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    a.remove()
  }, [])

  const handleDownloadClick = useCallback((): void => {
    if (!downloadUrl) return
    const filename = `${selected?.name}-${currentVersion ?? 'latest'}.zip`
    const terms = selected?.terms?.trim()
    if (terms) {
      openDialog({
        title: '利用規約',
        body: terms,
        onAgree: () => performDownload(downloadUrl, filename)
      })
    } else {
      performDownload(downloadUrl, filename)
    }
  }, [downloadUrl, selected?.name, selected?.terms, currentVersion, openDialog, performDownload])

  return (
    <Box
      display={{ base: 'none', xl: 'block' }}
      position="fixed"
      top="0"
      right="0"
      h="100vh"
      w={`${PANEL_WIDTH_PX}px`}
      zIndex={10}
      style={slideStyle}
    >
      <Card.Root
        w="100%"
        h="100%"
        p="0"
        borderLeftWidth="1px"
        borderColor="border"
        borderRadius="0"
        position="relative"
      >
        {/* close */}
        <IconButton
          aria-label="Close detail panel"
          size="sm"
          variant="subtle"
          borderRadius="full"
          position="absolute"
          top="8px"
          right="8px"
          boxShadow="lg"
          onClick={() => setPanelOpen(false)}
        >
          <LuPanelLeftOpen />
        </IconButton>

        {/* thumbnail */}
        <Box
          w="100%"
          h={`${THUMB_HEIGHT_PX}px`}
          bg="bg.muted"
          onDragStart={(e) => e.preventDefault()}
        >
          {img ? (
            <Image
              key={img}
              src={img}
              alt={selected?.name ?? 'thumbnail'}
              w="100%"
              h="100%"
              objectFit="cover"
              loading="lazy"
              draggable={false}
              userSelect="none"
              onError={() => console.warn('panel image load failed:', img)}
            />
          ) : (
            <Skeleton w="100%" h="100%" />
          )}
        </Box>

        {/* main */}
        <Box p="4" pb="20">
          {selected && (
            <Stack gap="4">
              <Text fontSize="3xl" fontWeight="bold" letterSpacing="wide" mb="2">
                {selected.name}
              </Text>

              {/* area */}
              <Flex align="flex-start" gap="2">
                <Text fontWeight="semibold" whiteSpace="nowrap">
                  地域：
                </Text>
                <Wrap flex="1">
                  {selected.area_kansai && (
                    <Badge variant="solid" colorPalette="orange">
                      関西
                    </Badge>
                  )}
                  {selected.area_kanto && (
                    <Badge variant="solid" colorPalette="orange">
                      関東
                    </Badge>
                  )}
                  {selected.area_tohoku && (
                    <Badge variant="solid" colorPalette="orange">
                      東北
                    </Badge>
                  )}
                  {selected.area_kyushu && (
                    <Badge variant="solid" colorPalette="orange">
                      九州
                    </Badge>
                  )}
                  {selected.area_other && (
                    <Badge variant="solid" colorPalette="gray">
                      その他
                    </Badge>
                  )}
                  {selected.area_overseas && (
                    <Badge variant="solid" colorPalette="purple">
                      海外
                    </Badge>
                  )}
                  {selected.area_fictional && (
                    <Badge variant="solid" colorPalette="pink">
                      架空
                    </Badge>
                  )}
                </Wrap>
              </Flex>

              {/* features */}
              <Flex align="flex-start" gap="2">
                <Text fontWeight="semibold" whiteSpace="nowrap">
                  機能：
                </Text>
                <Wrap flex="1">
                  {selected.door_opening_closing && <Badge>ドア開閉</Badge>}
                  {selected.running_sound && <Badge>走行音</Badge>}
                  {selected.announcement && <Badge>アナウンス</Badge>}
                  {selected.ATS && <Badge>ATS</Badge>}
                  {selected.special_lighting && <Badge>特殊照明</Badge>}
                  {selected.door_behavior && <Badge>ドア挙動</Badge>}
                  {selected.pantograph_behavior && <Badge>パンタグラフ</Badge>}
                  {selected.in_car_equipment && <Badge>車内機器</Badge>}
                  {selected.drivers_cab && <Badge>運転台</Badge>}
                </Wrap>
              </Flex>

              {/* description */}
              {selected.description && (
                <Blockquote.Root colorPalette="orange">
                  <Blockquote.Content>{selected.description}</Blockquote.Content>
                </Blockquote.Root>
              )}

              {versions.length > 0 && links.length > 0 && versions.length !== links.length && (
                <Text fontSize="xs" color="fg.muted">
                  ※ バージョン数({versions.length})とURL数({links.length}
                  )が一致していません。先頭のURLを使用します。
                </Text>
              )}
            </Stack>
          )}
        </Box>

        {/* bottom-right fixed: Select (200px) + Download */}
        <Flex
          position="absolute"
          bottom="4"
          right="4"
          gap="3"
          align="center"
          justify="flex-end"
          wrap="nowrap"
        >
          {items.length > 0 && (
            <Select.Root
              size="sm"
              collection={collection}
              defaultValue={defaultVersion ? [defaultVersion] : []}
              onValueChange={(e) => setCurrentVersion(e.value[0])}
            >
              <Select.Trigger w="200px">
                <Box flex="1" textAlign="left" px="2">
                  {currentVersion ? `${currentVersion} ver` : 'バージョンを選択'}
                </Box>
                <Select.Indicator />
              </Select.Trigger>

              {/* open upward */}
              <Select.Positioner position="top-start">
                <Select.Content>
                  {items.map((it) => (
                    <Select.Item key={it.value} item={it}>
                      {it.label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Positioner>
            </Select.Root>
          )}

          <Button
            size="sm"
            variant="solid"
            colorPalette="orange"
            onClick={handleDownloadClick}
            disabled={!downloadUrl}
            title={!downloadUrl ? 'ダウンロードリンクがありません' : undefined}
          >
            ダウンロード
          </Button>
        </Flex>
      </Card.Root>
    </Box>
  )
}

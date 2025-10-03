// src/renderer/src/App.tsx
import { Box, Heading, Input, InputGroup, Tabs, Flex } from '@chakra-ui/react'
import { JSX } from 'react'
import { LuSearch } from 'react-icons/lu'
import TrainList from './components/trains/TrainList'
import TrainDetailPanel, { PANEL_WIDTH_PX } from './components/trains/TrainDetailPanel'
import { SelectedTrainProvider, useSelectedTrain } from './state/SelectedTrainContext'
import GlobalDragBlocker from './components/GlobalDragBlocker'
import { TermsDialogProvider } from './state/TermsDialogContext'

function AppInner(): JSX.Element {
  const { panelOpen } = useSelectedTrain()
  return (
    <Box minH="100vh" p={6}>
      <Box mr={{ base: 0, xl: panelOpen ? `${PANEL_WIDTH_PX}px` : '0px' }}>
        <Heading mb={4}>Real Train Mod Addon Manager</Heading>

        <Tabs.Root defaultValue="members" variant="outline" w="100%">
          <Tabs.List
            w="100%"
            borderBottomWidth="1px"
            borderColor="border"
            justifyContent="flex-start"
          >
            <Tabs.Trigger value="Trains">Trains</Tabs.Trigger>
            <Tabs.Trigger value="projects">Projects</Tabs.Trigger>
            <Tabs.Trigger value="settings">Settings</Tabs.Trigger>

            <Flex flex="1" justifyContent="flex-end">
              <InputGroup w="250px" ml={4} startElement={<LuSearch />}>
                <Input placeholder="Search..." variant="subtle" />
              </InputGroup>
            </Flex>
          </Tabs.List>

          <Tabs.Content value="Trains">
            <Box pt={6}>
              <TrainList />
            </Box>
          </Tabs.Content>

          <Tabs.Content value="projects" />
          <Tabs.Content value="settings" />
        </Tabs.Root>
      </Box>

      {/* 右の固定パネル */}
      <TrainDetailPanel />
    </Box>
  )
}

export default function App(): JSX.Element {
  return (
    <SelectedTrainProvider>
      <TermsDialogProvider>
        <GlobalDragBlocker />
        <AppInner />
      </TermsDialogProvider>
    </SelectedTrainProvider>
  )
}

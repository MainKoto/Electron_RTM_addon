import { Box, Heading, Input, InputGroup, Tabs, Flex } from '@chakra-ui/react'
import { JSX } from 'react'
import { LuSearch } from 'react-icons/lu'
import TrainList from './components/trains/TrainList'

export default function App(): JSX.Element {
  return (
    <Box p={6}>
      <Heading mb={4}>Real Train Mod Addon Manager</Heading>

      {/* タブと検索フォームを同じ行に並べる */}
      <Flex mb={0} alignItems="center" justifyContent="space-between">
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

            {/* 検索フォームを右端に配置 */}
            <Flex flex="1" justifyContent="flex-end">
              <InputGroup w="250px" ml={4} startElement={<LuSearch />}>
                <Input placeholder="Search..." variant="subtle" />
              </InputGroup>
            </Flex>
          </Tabs.List>

          <Tabs.Content value="Trains">
            <Box p={6}>
              <Box w="1024px" mx="auto">
                {/* Tabs ... */}
                <TrainList />
              </Box>
            </Box>
          </Tabs.Content>
          <Tabs.Content value="projects"></Tabs.Content>
          <Tabs.Content value="settings"></Tabs.Content>
        </Tabs.Root>
      </Flex>
    </Box>
  )
}

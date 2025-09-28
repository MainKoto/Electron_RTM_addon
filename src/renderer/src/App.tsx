import { Box, Button, Heading, Input } from '@chakra-ui/react'
import { JSX } from 'react'

// 戻り値型を明示してESLintを満足させる
export default function App(): JSX.Element {
  return (
    <Box p={6}>
      <Heading mb={4}>Hello from Chakra UI v3!</Heading>
      <Input placeholder="Type something..." mb={3} />
      <Button colorScheme="teal">Click me</Button>
    </Box>
  )
}

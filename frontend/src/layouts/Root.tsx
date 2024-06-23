import { Button, Flex, Link } from '@chakra-ui/react'
import { Link as WouterLink, useRoute } from 'wouter'

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <Flex
      borderStyle={'solid'}
      height={'100%'}
      direction="column"
      alignItems={'center'}
      justifyContent={'center'}
      width="100%"
      maxWidth="3xl"
    >
      {children}
    </Flex>
  )
}

export default function Root({ children }: { children: React.ReactNode }) {
  const [home] = useRoute('/')
  return (
    <Flex height="100%" direction="column" alignItems="center">
      {!home && (
        <Link as={WouterLink} to="/" asChild>
          <Button width="md" height="3rem">
            Go Home
          </Button>
        </Link>
      )}
      <Wrapper>{children}</Wrapper>
    </Flex>
  )
}

import { PublicKeys, usePublicKeys } from '../utils/storage'
import Root from '../layouts/Root'
import { AddPublicKey } from '../components/AddPublicKey'
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  IconButton,
  Stack,
  StackDivider,
  Text,
  useToast,
} from '@chakra-ui/react'
import { DeleteIcon } from '@chakra-ui/icons'
import { SharePublicKey } from '../components/SharePublicKey'

// TODO: Add some way to export/import keys

function PublicKeyListing({
  pubKeys,
  removeKey,
}: {
  pubKeys: PublicKeys[]
  removeKey: (pubKey: PublicKeys) => void
}) {
  const toast = useToast()
  return (
    <Card width={'100%'}>
      <CardHeader>
        <Heading size="md">Local Public Keys</Heading>
      </CardHeader>

      <CardBody width={'100%'}>
        <Stack width={'100%'} divider={<StackDivider />} spacing="4">
          {pubKeys.map((v) => {
            return (
              <Box key={v.pubKey}>
                <Heading size="xs">
                  {v.email}
                  <IconButton
                    onClick={() => {
                      if (
                        confirm(`Delete public key for ${v.email ?? v.pubKey}?`)
                      ) {
                        removeKey({ email: v.email, pubKey: v.pubKey })
                        toast({
                          title: 'Public Key Removed',
                          description: `Public Key for ${v.email} is removed`,
                          status: 'success',
                          duration: 4000,
                          isClosable: true,
                        })
                      }
                    }}
                    variant={'subtle'}
                    size="xs"
                    icon={<DeleteIcon />}
                    aria-label={'Delete public key'}
                  />
                </Heading>
                <Text pt="2" fontSize="sm">
                  {v.pubKey}
                </Text>
              </Box>
            )
          })}
        </Stack>
      </CardBody>
    </Card>
  )
}

export default function PublicKeysPage() {
  const { self, pubKeys, addKey, removeKey } = usePublicKeys()
  return (
    <Root>
      <Box mb={8} width="100%">
        <AddPublicKey addKey={addKey} allKeys={pubKeys} />
      </Box>
      <PublicKeyListing pubKeys={pubKeys} removeKey={removeKey} />
      {self && <SharePublicKey email={self.email} publicKey={self.pubKey} />}
    </Root>
  )
}

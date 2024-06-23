import { useLocation, useParams } from 'wouter'
import { Box } from '@chakra-ui/react'
import Root from '../layouts/Root'
import { AddPublicKey } from './AddPublicKey'
import { usePublicKeys } from '../utils/storage'

export function ShareKeys() {
  const [_, setLocation] = useLocation()
  const { pubKeys, addKey } = usePublicKeys()
  const parmas = useParams()
  // NOTE: This `key` is the router path param
  const stencil = btoa('{}')
  const key = parmas['publicKey'] || stencil
  const data = JSON.parse(atob(key))
  // TODO:
  // 1. Check if key exist
  // 2. Try to parse the key
  // 3. Things...
  const someKey = btoa('some data dfaffdahlfdjas fdhaslfjdas fdhaslfdj')
  return (
    <Root>
      {key ? (
        <AddPublicKey
          email={data.email}
          pubKey={data.publicKey}
          allKeys={pubKeys}
          addKey={(k) => {
            addKey(k)
            setLocation('/local_keys')
          }}
        />
      ) : (
        <Box width={'80%'}>
          <code style={{ overflowWrap: 'anywhere' }}>
            {window.location.href}/{someKey}
          </code>
        </Box>
      )}
    </Root>
  )
}

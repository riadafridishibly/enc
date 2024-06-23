import { useLocalStorage } from '@uidotdev/usehooks'

export type PublicKeys = {
  email: string
  pubKey: string // might as well add an array
}

export type SelfInfo = {
  email: string
  pubKey: string // might as well add an array
  created: number // unix seconds
}

export function usePublicKeys() {
  const [pubKeys, setPubKeys] = useLocalStorage<PublicKeys[]>(
    'enc-pub-keys',
    [],
  )
  const [self, setSelf] = useLocalStorage<SelfInfo>('enc-me', undefined)

  const addKey = (pubKey: PublicKeys) => {
    if (pubKey.pubKey === '') {
      return
    }
    setPubKeys((curr) => {
      const emailIndex = curr.findIndex((v) => {
        return v.email === pubKey.email
      })
      if (emailIndex >= 0) {
        curr.splice(emailIndex, 1)
      }
      const pubKeyIndex = curr.findIndex((v) => {
        return v.pubKey === pubKey.pubKey
      })
      if (pubKeyIndex >= 0) {
        curr.splice(pubKeyIndex, 1)
      }

      // TODO: This shouldn't be here, there should be separate update
      // call for this
      if (self?.email === pubKey.email || self?.pubKey === pubKey.pubKey) {
        setSelf((_) => {
          return {
            email: pubKey.email,
            pubKey: pubKey.pubKey,
            created: Date.now(),
          }
        })
      }
      return [...curr, pubKey]
    })
  }

  const setSelfEmailAndPubKey = (email: string, pubKey: string) => {
    setSelf((_) => {
      return {
        email: email,
        pubKey: pubKey,
        created: Date.now(),
      }
    })
    addKey({
      email: email,
      pubKey: pubKey,
    })
  }

  const removeKey = (pubKey: PublicKeys) => {
    setPubKeys((curr) => {
      return curr.filter((value) => {
        return value.email !== pubKey.email || value.pubKey !== pubKey.pubKey
      })
    })
  }

  return { pubKeys, addKey, removeKey, self, setSelf: setSelfEmailAndPubKey }
}

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

export function useSelfInfo() {
	const { addKey } = usePublicKeys()
	const [self, setSelf] = useLocalStorage<SelfInfo>('enc-me', undefined)
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
	return { self, setSelf: setSelfEmailAndPubKey }
}

export function usePublicKeys() {
	const [pubKeys, setPubKeys] = useLocalStorage<PublicKeys[]>(
		'enc-pub-keys',
		[],
	)
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
			return [...curr, pubKey]
		})
	}
	const removeKey = (pubKey: PublicKeys) => {
		setPubKeys((curr) => {
			return curr.filter((value) => {
				return value.email !== pubKey.email || value.pubKey !== pubKey.pubKey
			})
		})
	}
	return { pubKeys, addKey, removeKey }
}

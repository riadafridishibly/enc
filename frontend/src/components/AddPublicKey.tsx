import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react'
import { PublicKeys as PublicKeysType } from '../utils/storage'
import { useState } from 'react'

export function AddPublicKey({
	email,
	pubKey,
	addKey,
}: {
	email?: string
	pubKey?: string
	addKey: (pubKey: PublicKeysType) => void
}) {
	const [emailInput, setEmailInput] = useState(email || '')
	const [pubKeyInput, setPubKeyInput] = useState(pubKey || '')

	return (
		<FormControl>
			<FormLabel>Email</FormLabel>
			<Input
				type="email"
				value={emailInput}
				onChange={(e) => setEmailInput(e.target.value)}
			/>
			<FormLabel>Public Key</FormLabel>
			<Input
				type="text"
				value={pubKeyInput}
				readOnly={!!pubKey} // if public key is given make it readonly
				onChange={(e) => setPubKeyInput(e.target.value)}
			/>
			<Button
				onClick={(e) => {
					e.preventDefault()
					addKey({
						email: emailInput,
						pubKey: pubKeyInput,
					})
				}}
				size="lg"
				mt={2}
			>
				Add Public Key
			</Button>
		</FormControl>
	)
}

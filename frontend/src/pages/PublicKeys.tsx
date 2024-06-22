import { PublicKeys, usePublicKeys, useSelfInfo } from '../utils/storage'
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
	const { self } = useSelfInfo()
	const { pubKeys, addKey, removeKey } = usePublicKeys()
	return (
		<Root>
			<Box mb={4} width={'xl'}>
				<AddPublicKey addKey={addKey} />
			</Box>
			<PublicKeyListing pubKeys={pubKeys} removeKey={removeKey} />
			{self && <SharePublicKey email={self.email} publicKey={self.pubKey} />}
		</Root>
	)
}

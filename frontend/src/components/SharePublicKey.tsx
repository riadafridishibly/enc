import {
	Button,
	Center,
	Code,
	Stack,
	Text,
	useClipboard,
} from '@chakra-ui/react'

export function SharePublicKey({
	email,
	publicKey,
}: {
	email: string
	publicKey: string
}) {
	const shareableData = JSON.stringify({
		email: email,
		publicKey: publicKey,
	})
	let url = new URL(window.location.href)
	url.hash = `/share_keys/${btoa(shareableData)}`
	const shareLink = url.toString() //  `${window.location.origin}/#/share_keys/${btoa(shareableData)}`
	const { onCopy, hasCopied } = useClipboard(shareLink)
	return (
		<Stack pt={8} maxWidth="2xl">
			<Text p={4} as={Code} style={{ overflowWrap: 'anywhere' }}>
				{shareLink}
			</Text>
			<Center>
				<Button
					variant={'outline'}
					onClick={onCopy}
					size="lg"
					colorScheme="purple"
				>
					{hasCopied ? 'Copied!' : 'Copy Public Key Share Link'}
				</Button>
			</Center>
		</Stack>
	)
}

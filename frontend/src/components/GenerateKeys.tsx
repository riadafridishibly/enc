import { EmailIcon } from '@chakra-ui/icons'
import {
	Button,
	Center,
	Flex,
	Input,
	InputGroup,
	InputLeftElement,
	InputRightElement,
	Link,
	Stack,
	Text,
	useClipboard,
	useToast,
} from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { useState } from 'react'
import { GenerateKeysResult } from '../types'
import { SelfInfo, useSelfInfo } from '../utils/storage'
import { SharePublicKey } from './SharePublicKey'

function PasswordInputWithCopyButton({
	defaultValue,
	readOnly,
}: {
	defaultValue: string
	readOnly: boolean
}) {
	const { onCopy, value, setValue, hasCopied } = useClipboard('')
	useEffect(() => {
		setValue(defaultValue)
	}, [defaultValue])
	const [show, setShow] = React.useState(false)
	const handleClick = () => setShow(!show)
	return (
		<Flex mb={2}>
			<InputGroup size="md" mr={2}>
				<Input
					readOnly={readOnly}
					variant={'filled'}
					pr="4.5rem"
					type={show ? 'text' : 'password'}
					value={value}
					onChange={(e) => {
						setValue(e.target.value)
					}}
				/>
				<InputRightElement width="4.5rem">
					<Button h="1.75rem" size="sm" onClick={handleClick}>
						{show ? 'Hide' : 'Show'}
					</Button>
				</InputRightElement>
			</InputGroup>
			<Button onClick={onCopy}>{hasCopied ? 'Copied!' : 'Copy'}</Button>
		</Flex>
	)
}

function InputWithCopyButton({
	defaultValue,
	readOnly,
}: {
	defaultValue: string
	readOnly: boolean
}) {
	const { onCopy, value, setValue, hasCopied } = useClipboard('')
	useEffect(() => {
		setValue(defaultValue)
	}, [defaultValue])
	return (
		<Flex mb={2}>
			<Input
				type={'text'}
				value={value}
				readOnly={readOnly}
				onChange={(e) => {
					setValue(e.target.value)
				}}
				mr={2}
			/>
			<Button onClick={onCopy}>{hasCopied ? 'Copied!' : 'Copy'}</Button>
		</Flex>
	)
}

function DownloadPrivateKeyButton({
	email,
	privateKey,
}: {
	email: string
	privateKey: string
}) {
	// TODO: Might change with json
	const data = `# ${email}\n${privateKey}\n`
	const filename =
		'private_key_' +
		email
			.replace('@', '_at_')
			.replace(/[^a-z0-9]/gi, '_')
			.toLowerCase()
	const url = window.URL.createObjectURL(
		new Blob([data], { type: 'text/plain' }),
	)
	// TODO: Change the filename use email name (sanitize path)
	return (
		<Link href={url} download={filename}>
			<Button size="lg" colorScheme="purple">
				Download Private Key
			</Button>
		</Link>
	)
}

function RenderKeys({
	email,
	keys,
}: {
	email: string
	keys: GenerateKeysResult
}) {
	if (!(keys.publicKey && keys.privateKey)) {
		throw new Error('invalid keys')
	}
	return (
		<Stack width={'100%'} p={2}>
			<Text>Your Public Key</Text>
			<InputWithCopyButton readOnly defaultValue={keys.publicKey} />
			<Text>Your Private Key</Text>
			<PasswordInputWithCopyButton readOnly defaultValue={keys.privateKey} />
			{/* <div>Share public key: give them a link and a copy button</div> */}
			{/* <div>Download private key</div> */}
			<Center>
				<DownloadPrivateKeyButton email={email} privateKey={keys.privateKey} />
			</Center>
			<Center>
				<SharePublicKey email={email} publicKey={keys.publicKey} />
			</Center>
		</Stack>
	)
}

function SelfKey({ self }: { self: SelfInfo }) {
	if (!self || !self.pubKey) {
		return null
	}

	return (
		<Center>
			<SharePublicKey email={self.email} publicKey={self.pubKey} />
		</Center>
	)
}

export function GenerateKeys() {
	const [email, setEmail] = useState('')
	const [keys, setKeys] = useState<GenerateKeysResult | null>(null)
	const { self, setSelf } = useSelfInfo()
	const toast = useToast()

	useEffect(() => {
		// If public key is already not set for self, and we have public key,
		// set this for the default one
		if (!self?.pubKey && keys?.publicKey) {
			setSelf(email, keys?.publicKey)
		}
	}, [keys?.publicKey, email])

	return (
		<Center
			// style={{ border: "1px solid purple" }}
			width={'100%'}
			flexDir={'column'}
			gap={3}
		>
			{/* TODO: Add FormControl here; Input validation*/}
			{keys ? (
				<>
					<RenderKeys email={email} keys={keys} />
					{self?.pubKey !== keys.publicKey && (
						<Button
							onClick={(_) => {
								if (!keys?.publicKey) {
									return
								}
								// Key already exists
								if (self?.pubKey) {
									if (
										confirm(`Replace the existing public key for ${email}?`)
									) {
										setSelf(email, keys.publicKey)
									}
								} else {
									setSelf(email, keys.publicKey)
								}
								toast({
									title: 'Public Key Saved',
									description: 'Your public key is saved in local storage',
									status: 'success',
									duration: 4000,
									isClosable: true,
								})
							}}
							colorScheme="green"
							width={'100%'}
							size={'lg'}
						>
							Save Public Key
						</Button>
					)}
				</>
			) : (
				<Stack width={'lg'}>
					<SelfKey self={self} />
					<InputGroup width={'100%'}>
						<InputLeftElement pointerEvents="none">
							<EmailIcon color="gray.300" />
						</InputLeftElement>
						<Input
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							type="email"
							placeholder="Your Email"
						/>
					</InputGroup>
					<Button
						onClick={(_) => setKeys(window.GenerateKeys())}
						colorScheme="green"
						width={'100%'}
						size={'lg'}
					>
						Generate Keys
					</Button>
				</Stack>
			)}
		</Center>
	)
}

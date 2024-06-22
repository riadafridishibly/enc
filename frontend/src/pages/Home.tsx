import { Button, Link, Stack } from '@chakra-ui/react'
import Root from '../layouts/Root'
import { Link as WouterLink } from 'wouter'

function RouteButton({
	children,
	to,
}: {
	children: React.ReactNode
	to: string
}) {
	return (
		<Link as={WouterLink} to={to} asChild>
			<Button
				variant={'outline'}
				colorScheme="purple"
				width={'60%'}
				height={'4em'}
				size={'lg'}
			>
				{children}
			</Button>
		</Link>
	)
}

export default function Home() {
	return (
		<Root>
			<Stack width={'100%'} alignItems={'center'} justifyContent={'center'}>
				<RouteButton to="/genkey">Generate Keys</RouteButton>
				{/* <RouteButton to="/import_keys">Import Keys</RouteButton> */}
				<RouteButton to="/encrypt">Encrypt Text</RouteButton>
				<RouteButton to="/decrypt">Decrypt Text</RouteButton>
				{/* <RouteButton to="/share_keys">Share Public Key</RouteButton> */}
				<RouteButton to="/local_keys">Local Public Keys</RouteButton>
			</Stack>
		</Root>
	)
}

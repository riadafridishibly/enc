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
			width={'3xl'} // Set the inner container size
		>
			{children}
		</Flex>
	)
}

export default function Root({ children }: { children: React.ReactNode }) {
	const [home] = useRoute('/')
	return (
		<Flex
			border={'blue'}
			borderStyle={'solid'}
			height={'100%'}
			direction="column"
			alignItems={'center'}
		>
			{!home && (
				<Link width={{}} as={WouterLink} to="/" asChild>
					<Button width="md" height={'3rem'}>
						Go Home
					</Button>
				</Link>
			)}
			<Wrapper>{children}</Wrapper>
		</Flex>
	)
}

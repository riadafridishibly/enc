import { Button, ButtonProps, Link } from '@chakra-ui/react'

export default function DownloadButton({
	text,
	filename,
	children,
	buttonProps,
}: {
	text: string
	filename: string
	children: React.ReactNode
	buttonProps?: ButtonProps
}) {
	const url = window.URL.createObjectURL(
		new Blob([text], { type: 'text/plain' }),
	)
	return (
		<Link href={url} download={filename}>
			<Button {...buttonProps}>{children}</Button>
		</Link>
	)
}

import { Button, ButtonProps, useClipboard } from '@chakra-ui/react'

export default function CopyToClipboardButton({
	data,
	children,
	buttonProps,
}: {
	data: string
	children: React.ReactNode
	buttonProps?: ButtonProps
}) {
	const { onCopy, hasCopied } = useClipboard(data)
	return (
		<Button {...buttonProps} onClick={onCopy}>
			{hasCopied ? 'Copied!' : children}
		</Button>
	)
}

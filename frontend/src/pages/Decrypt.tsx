import { FileError, useDropzone } from 'react-dropzone'
import * as React from 'react'
import Root from '../layouts/Root'

import {
  Box,
  Button,
  Center,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Textarea,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'

function PrivateKeyValidator(file: File): FileError | null {
  if (file.type !== 'text/plain') {
    return {
      code: 'type-error',
      message: 'file type must be text/plain',
    }
  }
  if (file.size > 1 << 20) {
    return {
      code: 'size-error',
      message: 'file must be less than 1mb',
    }
  }
  return null
}

export function Dropzone({
  setPrivateKey,
}: {
  setPrivateKey: (privKey: string) => void
}) {
  const onDrop = React.useCallback((acceptedFiles: File[]) => {
    // NOTE: only take the first file for now
    acceptedFiles.slice(0, 1).forEach((file) => {
      file.text().then((data) => {
        for (const line of data.split('\n')) {
          if (line.trim().startsWith('AGE-SECRET-KEY-')) {
            setPrivateKey(line)
          }
        }
      })
    })
  }, [setPrivateKey])
  const { fileRejections, getRootProps, getInputProps, isDragActive } =
    useDropzone({
      onDrop,
      validator: PrivateKeyValidator,
    })

  const rejecections = fileRejections.map(({ file, errors }) => {
    return (
      <li key={file.name}>
        {file.name}
        <ul>
          {errors.map((e) => (
            <li key={e.code}>{e.message}</li>
          ))}
        </ul>
      </li>
    )
  })

  return (
    <>
      <Box
        borderRadius={'xl'}
        border="dashed"
        borderWidth={3}
        borderColor={'blue.300'}
        background={'blue.100'}
        width={'100%'}
        height={'8rem'}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        <Center width={'100%'} height={'100%'} alignItems={'center'}>
          {isDragActive ? (
            <p>Drop private key file here ...</p>
          ) : (
            <p>Drag 'n' drop private key file here, or click to select file</p>
          )}
        </Center>
      </Box>
      <Box as="ul" background={'red.200'}>
        {rejecections}
      </Box>
    </>
  )
}

function PrivateKeyField({
  value,
  setValue,
}: {
  value: string
  setValue: (v: string) => void
}) {
  const [show, setShow] = React.useState(false)
  const handleClick = () => setShow(!show)
  return (
    <InputGroup size="md" mr={2}>
      <Input
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
  )
}

export default function Decrypt() {
  const [cipherText, setCipherText] = React.useState('')
  const [plainText, setPlainText] = React.useState('')
  const [privateKey, setPrivateKey] = React.useState('')
  const [error, setError] = React.useState('')
  return (
    <Root>
      <Box pt={8} width={'100%'} height={'100%'}>
        <Stack width={'100%'} gap={3}>
          <Textarea
            rows={7}
            value={cipherText}
            onChange={(e) => setCipherText(e.target.value)}
            placeholder="Paste your ciphertext here..."
          />
          <Dropzone setPrivateKey={setPrivateKey} />
          <Text>Private Key</Text>
          <PrivateKeyField value={privateKey} setValue={setPrivateKey} />
          <Button
            size="lg"
            colorScheme="purple"
            onClick={() => {
              const value = window.Decrypt(cipherText, [privateKey])
              setPlainText(value?.data ?? '')
              if (value?.error) {
                setError(value.error)
              } else {
                setError('')
              }
            }}
          >
            Decrypt
          </Button>
          {error && (
            <Alert borderRadius={'md'} status="error">
              <AlertIcon />
              <AlertTitle>Decryption Failed</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          {plainText && (
            <Textarea
              rows={7}
              value={plainText}
              onChange={(e) => setPlainText(e.target.value)}
            />
          )}
        </Stack>
      </Box>
    </Root>
  )
}

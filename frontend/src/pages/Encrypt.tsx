import { useMemo, useState } from 'react'
import Root from '../layouts/Root'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Checkbox,
  HStack,
  Stack,
  Tag,
  Textarea,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import DownloadButton from '../components/DownloadButton'
import CopyToClipboardButton from '../components/CopyToClipboardButton'
import { PublicKeys, usePublicKeys } from '../utils/storage'

// identifier = {checked: bool, publicKey: string}
type CheckedRecipients = {
  [key: string]: { checked: boolean; publicKey: string }
}

function EncryptForList({
  checkedRecipients,
  setCheckedRecipients,
}: {
  checkedRecipients: CheckedRecipients
  setCheckedRecipients: React.Dispatch<React.SetStateAction<CheckedRecipients>>
}) {
  const allChecked = Object.values(checkedRecipients).every((v) => v.checked)
  const isIndeterminate =
    Object.values(checkedRecipients).some((v) => v.checked) && !allChecked
  return (
    <Wrap>
      <Tag
        borderRadius="full"
        size="lg"
        variant={'outline'}
        colorScheme={allChecked ? 'blue' : 'blackAlpha'}
      >
        <Checkbox
          isIndeterminate={isIndeterminate}
          onChange={(e) => {
            setCheckedRecipients((curr) => {
              const newObject = { ...curr }
              for (let key of Object.keys(newObject)) {
                const v = newObject[key]
                newObject[key] = { ...v, checked: e.target.checked }
              }
              return newObject
            })
          }}
          isChecked={allChecked}
        >
          All
        </Checkbox>
      </Tag>
      {Object.entries(checkedRecipients).map(([name, value]) => (
        <WrapItem key={name}>
          <Tag
            borderRadius="full"
            size="lg"
            variant={'outline'}
            colorScheme={value.checked ? 'blue' : 'blackAlpha'}
          >
            <Checkbox
              onChange={(e) => {
                setCheckedRecipients((curr) => {
                  return {
                    ...curr,
                    [name]: { ...curr[name], checked: e.target.checked },
                  }
                })
              }}
              name={name}
              isChecked={value.checked}
            >
              {name}
            </Checkbox>
          </Tag>
        </WrapItem>
      ))}
    </Wrap>
  )
}

function Editor({
  plaintext,
  setPlainText,
}: {
  plaintext: string
  setPlainText: React.Dispatch<React.SetStateAction<string>>
}) {
  // 1. Editable (edit text here)
  // 2. Button (encrypt)
  // 3. Share the encrypted text
  //  - {email: ..., pubKey: ..., cipherText: ...}
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    let inputValue = e.target.value
    setPlainText(inputValue)
  }

  return (
    <Textarea
      rows={7}
      value={plaintext}
      onChange={handleInputChange}
      placeholder="Write your text here..."
    />
  )
}

function RenderErrors({ pubKeys }: { pubKeys: PublicKeys[] }) {
  const errors = pubKeys
    .map((v) => {
      const result = window.VerifyPublicKey(v.pubKey)
      return {
        ...v,
        error: result.error,
      }
    })
    .filter((value) => !!value.error)
  return (
    <>
      {errors.map((value) => (
        <Alert key={value.pubKey} status="error">
          <AlertIcon />
          <AlertTitle>{value.email}</AlertTitle>
          <AlertDescription>{value.error}</AlertDescription>
        </Alert>
      ))}
    </>
  )
}

function EncryptWrapper() {
  const { pubKeys } = usePublicKeys()
  let initialValues: CheckedRecipients = {}
  for (let d of pubKeys) {
    initialValues[d.email || d.pubKey] = { publicKey: d.pubKey, checked: true }
  }
  const [checked, setChecked] = useState<CheckedRecipients>(initialValues)
  const [plaintext, setPlaintext] = useState('')
  const [ciphertext, setChipertext] = useState('')

  useMemo(() => {
    setChipertext('')
  }, [plaintext])

  return (
    <Box pt={8} width={'100%'} height={'100%'}>
      <Stack gap={4}>
        <EncryptForList
          checkedRecipients={checked}
          setCheckedRecipients={setChecked}
        />
        <RenderErrors pubKeys={pubKeys} />
        <Editor plaintext={plaintext} setPlainText={setPlaintext} />
        <Button
          onClick={() => {
            // TODO:
            // 1. get all the public keys
            // 2. parse the public keys (or send it to the wasm function)
            // 3. encrypt and set the cipher text or set error
            // Filter the checke ones
            const res = window.Encrypt(
              plaintext,
              Object.values(checked)
                .filter((v) => v.checked)
                .map((v) => v.publicKey),
            )
            console.log('res:', res)
            setChipertext(() => res.data ?? '')
          }}
          size="lg"
        >
          Encrypt
        </Button>
        {ciphertext && (
          <>
            <Textarea readOnly rows={7} value={ciphertext} />
            <HStack>
              <DownloadButton
                text={ciphertext}
                filename="encrypted_data.txt"
                buttonProps={{
                  colorScheme: 'purple',
                }}
              >
                Download
              </DownloadButton>
              <CopyToClipboardButton
                data={ciphertext}
                buttonProps={{ variant: 'outline', colorScheme: 'purple' }}
              >
                Copy To Clipboard
              </CopyToClipboardButton>
            </HStack>
          </>
        )}
      </Stack>
    </Box>
  )
}

export default function Encrypt() {
  return (
    <Root>
      <EncryptWrapper />
    </Root>
  )
}

//go:build wasm
// +build wasm

package main

import (
	"bufio"
	"bytes"
	"fmt"
	"io"
	"strings"
	"syscall/js"

	"filippo.io/age"
	"filippo.io/age/armor"
	"github.com/riadafridishibly/enc/agelib"
)

// Copied from age cli
func decryptRaw(identities []age.Identity, in io.Reader, out io.Writer) error {
	rr := bufio.NewReader(in)
	if start, _ := rr.Peek(len(armor.Header)); string(start) == armor.Header {
		in = armor.NewReader(rr)
	} else {
		in = rr
	}
	r, err := age.Decrypt(in, identities...)
	if err != nil {
		return err
	}
	out.Write(nil) // trigger the lazyOpener even if r is empty
	if _, err := io.Copy(out, r); err != nil {
		return err
	}
	return nil
}

// Copied from age cli
func encryptRaw(recipients []age.Recipient, in io.Reader, out io.Writer, withArmor bool) (retErr error) {
	if withArmor {
		a := armor.NewWriter(out)
		defer func() {
			if err := a.Close(); err != nil {
				retErr = err
			}
		}()
		out = a
	}
	w, err := age.Encrypt(out, recipients...)
	if err != nil {
		return err
	}
	if _, err := io.Copy(w, in); err != nil {
		return err
	}
	if err := w.Close(); err != nil {
		return err
	}
	return
}

func encryptX25519(message string, publicKeys []string) (string, error) {
	var recipients []age.Recipient
	for _, pubKey := range publicKeys {
		r, err := agelib.ParsePublicKey(pubKey)
		if err == nil {
			recipients = append(recipients, r)
		}
	}
	if len(recipients) == 0 {
		return "", fmt.Errorf("no valid recipients found")
	}
	buf := bytes.Buffer{}
	err := encryptRaw(recipients, strings.NewReader(message), &buf, true)
	if err != nil {
		return "", err
	}
	return buf.String(), nil
}

func decryptX25519(message string, privateKeys []string) (string, error) {
	var identities []age.Identity
	for _, pubKey := range privateKeys {
		i, err := agelib.ParsePrivateKey(pubKey)
		if err == nil {
			identities = append(identities, i)
		}
	}
	if len(identities) == 0 {
		return "", fmt.Errorf("no valid identities found")
	}
	buf := bytes.Buffer{}
	err := decryptRaw(identities, strings.NewReader(message), &buf)
	if err != nil {
		return "", err
	}
	return buf.String(), nil
}

func getArrayOfStrings(arr js.Value) ([]string, error) {
	if !arr.InstanceOf(js.Global().Get("Array")) {
		return nil, fmt.Errorf("expected array type for list of keys")
	}
	var keys []string
	n := arr.Length()
	for i := 0; i < n; i++ {
		keys = append(keys, arr.Index(i).String())
	}
	return keys, nil
}

func Encrypt(this js.Value, args []js.Value) any {
	message := args[0].String()
	pubKeys, err := getArrayOfStrings(args[1])
	if err != nil {
		return M{
			"error": err.Error(),
		}
	}
	cipherText, err := encryptX25519(message, pubKeys)
	if err != nil {
		return M{
			"error": err.Error(),
		}
	}
	return map[string]any{
		"data": cipherText,
	}
}

func Decrypt(this js.Value, args []js.Value) any {
	message := args[0].String()
	privateKeys, err := getArrayOfStrings(args[1])
	if err != nil {
		return M{
			"error": err.Error(),
		}
	}
	plaintext, err := decryptX25519(message, privateKeys)
	if err != nil {
		return M{
			"error": err.Error(),
		}
	}
	return map[string]any{
		"data": plaintext,
	}
}

type M = map[string]any

func GenerateKeys(this js.Value, args []js.Value) any {
	pubKey, privKey, err := agelib.GenerateKeys()
	if err != nil {
		return M{
			"error": err.Error(),
		}
	}
	return M{
		"publicKey":  pubKey,
		"privateKey": privKey,
	}
}

func VerifyPublicKey(this js.Value, args []js.Value) any {
	pubkey := args[0].String()
	_, err := agelib.ParsePublicKey(pubkey)
	if err != nil {
		return M{
			"error": err.Error(),
		}
	}
	return M{
		"publicKey": pubkey,
	}
}

func main() {
	js.Global().Set("Encrypt", js.FuncOf(Encrypt))
	js.Global().Set("Decrypt", js.FuncOf(Decrypt))
	js.Global().Set("GenerateKeys", js.FuncOf(GenerateKeys))
	js.Global().Set("VerifyPublicKey", js.FuncOf(VerifyPublicKey))
	select {}
}

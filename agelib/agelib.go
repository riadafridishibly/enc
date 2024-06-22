package agelib

import (
	"filippo.io/age"
	"filippo.io/age/agessh"
)

/*
TODO: Add SSH support

func Encrypt(publicKey, message string) (string, error) {
	recipient, err := agessh.ParseRecipient("mykey")
	if err != nil {
		return "", err
	}
	out := &bytes.Buffer{}
	w, err := age.Encrypt(out, recipient)
	if err != nil {
		return "", fmt.Errorf("Failed to create encrypted file: %v", err)
	}
	if _, err := io.WriteString(w, message); err != nil {
		return "", fmt.Errorf("Failed to write to encrypted file: %v", err)
	}
	if err := w.Close(); err != nil {
		return "", fmt.Errorf("Failed to close encrypted file: %v", err)
	}
	return hex.EncodeToString(out.Bytes()), nil
}

func Check() {
	recipient, err := agessh.ParseRecipient("somekey")
	if err != nil {
		panic(err)
	}
	out := &bytes.Buffer{}
	w, err := age.Encrypt(out, recipient)
	if err != nil {
		log.Fatalf("Failed to create encrypted file: %v", err)
	}
	if _, err := io.WriteString(w, "Oopiseee"); err != nil {
		log.Fatalf("Failed to write to encrypted file: %v", err)
	}
	if err := w.Close(); err != nil {
		log.Fatalf("Failed to close encrypted file: %v", err)
	}

	fmt.Printf("Encrypted file size: %d\n", out.Len())

	data := hex.EncodeToString(out.Bytes())
	fmt.Println(data)

	ident, err := agessh.ParseIdentity([]byte("identity"))
	if err != nil {
		panic(err)
	}
	r, err := age.Decrypt(bytes.NewReader(out.Bytes()), ident)
	if err != nil {
		panic(err)
	}
	io.Copy(os.Stdout, r)
}
*/

func GenerateKeys() (pubKey, privKey string, err error) {
	priv, err := age.GenerateX25519Identity()
	if err != nil {
		return "", "", err
	}
	pub := priv.Recipient()
	return pub.String(), priv.String(), nil
}

func ParsePublicKey(publicKey string) (age.Recipient, error) {
	return age.ParseX25519Recipient(publicKey)
}

func ParsePrivateKey(privateKey string) (age.Identity, error) {
	return age.ParseX25519Identity(privateKey)
}

func ParseSSHPublicKey(publicKey string) (age.Recipient, error) {
	return agessh.ParseRecipient(publicKey)
}

func ParseSSHPrivateKey(privateKey string) (age.Identity, error) {
	return agessh.ParseIdentity([]byte(privateKey))
}

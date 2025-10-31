function encrypt(data, key) {
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(data);

    return window.crypto.subtle.importKey('raw', key, 'AES-GCM', false, ['encrypt'])
        .then(importedKey => {
            return window.crypto.subtle.encrypt({ name: 'AES-GCM', iv: iv }, importedKey, encodedData)
                .then(encryptedData => {
                    return {
                        iv: Array.from(iv),
                        data: Array.from(new Uint8Array(encryptedData))
                    };
                });
        });
}

function decrypt(encryptedData, key) {
    const iv = new Uint8Array(encryptedData.iv);
    const data = new Uint8Array(encryptedData.data);

    return window.crypto.subtle.importKey('raw', key, 'AES-GCM', false, ['decrypt'])
        .then(importedKey => {
            return window.crypto.subtle.decrypt({ name: 'AES-GCM', iv: iv }, importedKey, data);
        })
        .then(decryptedData => {
            const decoder = new TextDecoder();
            return decoder.decode(decryptedData);
        });
}

function generateKey() {
    return window.crypto.subtle.generateKey(
        {
            name: 'AES-GCM',
            length: 256,
        },
        true,
        ['encrypt', 'decrypt']
    );
}
export class CryptoManager {
    static async generateKey() {
        return await window.crypto.subtle.generateKey(
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
    }

    static async exportKey(key: CryptoKey) {
        const exported = await window.crypto.subtle.exportKey("raw", key);
        // Using built-in btoa for browser since Buffer might not be polyfilled natively
        const binary = String.fromCharCode(...new Uint8Array(exported));
        return window.btoa(binary);
    }

    static async importKey(base64: string) {
        const binary = window.atob(base64);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
            bytes[i] = binary.charCodeAt(i);
        }
        return await window.crypto.subtle.importKey(
            "raw",
            bytes,
            { name: "AES-GCM", length: 256 },
            true,
            ["encrypt", "decrypt"]
        );
    }

    static async getOrGenerateLocalKey(): Promise<CryptoKey> {
        let saved = localStorage.getItem("workspace_key");
        if (!saved) {
            const key = await this.generateKey();
            saved = await this.exportKey(key);
            localStorage.setItem("workspace_key", saved);
        }
        return await this.importKey(saved);
    }

    static async encrypt(text: string, key: CryptoKey) {
        const iv = window.crypto.getRandomValues(new Uint8Array(12));
        const encoded = new TextEncoder().encode(text);
        const ciphertext = await window.crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            key,
            encoded
        );

        const ivBase64 = window.btoa(String.fromCharCode(...iv));
        const cipherBase64 = window.btoa(String.fromCharCode(...new Uint8Array(ciphertext)));
        return ivBase64 + ":" + cipherBase64;
    }

    static async decrypt(encrypted: string, key: CryptoKey) {
        const parts = encrypted.split(":");
        if (parts.length !== 2) return encrypted; // Skip if not actually encrypted

        try {
            const ivBinary = window.atob(parts[0]);
            const iv = new Uint8Array(ivBinary.length);
            for (let i = 0; i < ivBinary.length; i++) iv[i] = ivBinary.charCodeAt(i);

            const cipherBinary = window.atob(parts[1]);
            const cipher = new Uint8Array(cipherBinary.length);
            for (let i = 0; i < cipherBinary.length; i++) cipher[i] = cipherBinary.charCodeAt(i);

            const decrypted = await window.crypto.subtle.decrypt(
                { name: "AES-GCM", iv },
                key,
                cipher
            );
            return new TextDecoder().decode(decrypted);
        } catch (e) {
            console.error("Decryption failed", e);
            return "🔒 [Encrypted Content Unreadable]";
        }
    }
}

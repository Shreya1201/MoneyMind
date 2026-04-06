// Encode emoji (string → Base64)
export function encodeEmoji(str) {
  return str ? btoa(new TextEncoder().encode(str).reduce((data, byte) => data + String.fromCharCode(byte), "")) : str;
}

// Decode emoji (Base64 → string)
export function decodeEmoji(encoded) {
  if (!encoded) return encoded;
  const binary = atob(encoded);
  const bytes = new Uint8Array([...binary].map(char => char.charCodeAt(0)));
  return new TextDecoder().decode(bytes);
}

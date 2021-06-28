export function isMp3(buf: Uint8Array): boolean {
  return (
    buf.length > 2 &&
    ((buf[0] === 0x49 && buf[1] === 0x44 && buf[2] === 0x33) || // ID3v2
      // Final bit (has crc32) may be or may not be set.
      (buf[0] === 0xff && buf[1] === 0xfb))
  )
}

export function isWav(buf: Uint8Array): boolean {
  return (
    buf.length > 11 &&
    buf[0] === 0x52 &&
    buf[1] === 0x49 &&
    buf[2] === 0x46 &&
    buf[3] === 0x46 &&
    buf[8] === 0x57 &&
    buf[9] === 0x41 &&
    buf[10] === 0x56 &&
    buf[11] === 0x45
  )
}

export function isOgg(buf: Uint8Array): boolean {
  return (
    buf.length > 3 &&
    buf[0] === 0x4f &&
    buf[1] === 0x67 &&
    buf[2] === 0x67 &&
    buf[3] === 0x53
  )
}

export function mime(buf: Uint8Array): string {
  if (isMp3(buf)) return "audio/mpeg"
  if (isWav(buf)) return "audio/x-wav"
  if (isOgg(buf)) return "audio/ogg"
  return "application/octet-stream"
}

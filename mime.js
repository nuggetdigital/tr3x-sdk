// mp3 sig: 0x494433 or 0xfffb or 0xfffa
function isMp3(buf) {
  if (!buf || buf.length < 3) {
    return false
  }

  return (
    (buf[0] === 73 && buf[1] === 68 && buf[2] === 51) ||
    (buf[0] === 255 && (buf[1] === 251 || buf[1] === 250))
  )
}

// wav sig: 0x52494646
function isWav(buf) {
  if (!buf || buf.length < 3) {
    return false
  }

  return (
    buf[0] === 0x52 && buf[1] === 0x49 && buf[2] === 0x46 && buf[3] === 0x46
  )
}

export default function mime(buf) {
  if (isMp3(buf)) return "audio/mpeg"
  if (isWav(buf)) return "audio/wav"
  return "application/octet-stream"
}

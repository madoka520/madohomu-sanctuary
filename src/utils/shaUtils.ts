import SHA1 from 'crypto-js/sha1'
import { enc } from 'crypto-js'
export const fileToSHA1 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const binary = reader.result as ArrayBuffer
      const wordArray = enc.Latin1.parse(String.fromCharCode(...new Uint8Array(binary)))
      const hash = SHA1(wordArray).toString()
      resolve(hash)
    }
    reader.onerror = reject
    reader.readAsArrayBuffer(file)
  })
}
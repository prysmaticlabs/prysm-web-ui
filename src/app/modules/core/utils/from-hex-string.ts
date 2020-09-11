export default function fromHexString(hexString: string) {
  let parsedString = hexString;
  parsedString = parsedString.replace('0x', '');
  return new Uint8Array(parsedString.match(/.{1,2}/g).map(byte => parseInt(byte, 16)));
}
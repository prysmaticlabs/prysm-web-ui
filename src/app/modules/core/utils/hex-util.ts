export function hexToBase64(hexstring: string): string {
  const hexArray = hexstring
    .replace(/\r|\n/g, '')
    .replace(/([\da-fA-F]{2}) ?/g, '0x$1 ')
    .replace(/ +$/, '')
    .split(' ');
  const byteString = String.fromCharCode.apply(null, hexArray);
  return btoa(byteString);
}

export function base64ToHex(base64string: string): string {
  const bin = atob(base64string.replace(/[ \r\n]+$/, ''));
  const hex = [];
  for (let i = 0; i < bin.length; ++i) {
      let tmp = bin.charCodeAt(i).toString(16);
      if (tmp.length === 1) {
        tmp = '0' + tmp;
      }
      hex[hex.length] = tmp;
  }
  return '0x' + hex.join('');
}

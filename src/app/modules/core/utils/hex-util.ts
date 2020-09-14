export function hexToBase64(hexstring: string) {
  const hexArray = hexstring
    .replace(/\r|\n/g, '')
    .replace(/([\da-fA-F]{2}) ?/g, '0x$1 ')
    .replace(/ +$/, '')
    .split(' ');
  const byteString = String.fromCharCode.apply(null, hexArray);
return btoa(byteString);
}

export function base64ToHex(base64string: string) {
  for (var i = 0, bin = atob(base64string.replace(/[ \r\n]+$/, '')), hex = []; i < bin.length; ++i) {
      let tmp = bin.charCodeAt(i).toString(16);
      if (tmp.length === 1) tmp = '0' + tmp;
      hex[hex.length] = tmp;
  }
  return '0x' + hex.join('');
}
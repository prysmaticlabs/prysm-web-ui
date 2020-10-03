export function hexToBase64(hexstring: string): string {
  if (!hexstring) {
    return '';
  }
  let str = hexstring;
  if (str.indexOf('0x') !== -1) {
    str = str.replace('0x', '');
  }
  const matched = str.match(/.{2}/g);
  if (!matched) {
    return '';
  }
  const res = matched.map(c => parseInt(c, 16));
  return btoa(
    String.fromCharCode(
      ...res,
    )
  );
}

export function base64ToHex(base64string: string): string {
  const res = Array.prototype.reduce.call(
    atob(base64string),
    (acc, c) => acc + `0${c.charCodeAt(0).toString(16)}`.slice(-2),
    ''
  );
  return '0x' + res;
}

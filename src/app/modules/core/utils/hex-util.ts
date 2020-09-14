export function hexToBase64(hexstring: string) {
  return btoa(hexstring.match(/\w{2}/g).map(function(a) {
      return String.fromCharCode(parseInt(a, 16));
  }).join(""));
}

export function base64ToHex(base64string: string) {
  for (var i = 0, bin = atob(base64string.replace(/[ \r\n]+$/, '')), hex = []; i < bin.length; ++i) {
      let tmp = bin.charCodeAt(i).toString(16);
      if (tmp.length === 1) tmp = '0' + tmp;
      hex[hex.length] = tmp;
  }
  return hex.join(' ');
}
// Convert a hex string to a byte array
function hexToBytes(hex) {
  for (var bytes = [], c = 0; c < hex.length; c += 2)
  bytes.push(parseInt(hex.substr(c, 2), 16));
  return bytes;
}

// Convert a byte array to a hex string
function bytesToHex(bytes) {
  for (var hex = [], i = 0; i < bytes.length; i++) {
    var current = bytes[i] < 0 ? bytes[i] + 256 : bytes[i];
    hex.push((current >>> 4).toString(16));
    hex.push((current & 0xF).toString(16));
  }
  return hex.join('');
}

function bufferToBytes(buf) {
  const bytes = [];
  for(var i= 0; i< buf.length; i++){
    const byteint = buf[i];
    bytes.push(byteint);
  }
  return bytes;
}

function bytesToBuffer(bytes) {
  return Buffer.from(bytes);
}

function get_volume(ivol) {
  const logpoint = ivol >> (8 * 3)
  // const hheax = ivol >> (8 * 3);  // [3]
  const hleax = (ivol >> (8 * 2)) & 0xff;  // [2]
  const lheax = (ivol >> 8) & 0xff;  // [1]
  const lleax = ivol & 0xff;  // [0]

  // const dbl_1 = 1.0
  // const dbl_2 = 2.0
  // const dbl_128 = 128.0

  const dwEcx = logpoint * 2 - 0x7f;
  const dwEdx = logpoint * 2 - 0x86;
  const dwEsi = logpoint * 2 - 0x8e;
  const dwEax = logpoint * 2 - 0x96;
  let tmpEax;
  if (dwEcx < 0)
    tmpEax = - dwEcx
  else
    tmpEax = dwEcx

  let dbl_xmm6 = Math.pow(2.0, tmpEax)
  if (dwEcx < 0)
      dbl_xmm6 = 1.0 / dbl_xmm6

  let dbl_xmm0, dbl_xmm4 = 0;
  if (hleax > 0x80) {
    // const tmpdbl_xmm1 = 0.0
    const dwtmpeax = dwEdx + 1
    const tmpdbl_xmm3 = Math.pow(2.0, dwtmpeax)
    dbl_xmm0 = Math.pow(2.0, dwEdx) * 128.0
    dbl_xmm0 += (hleax & 0x7f) * tmpdbl_xmm3
    dbl_xmm4 = dbl_xmm0
  }
  else {
    dbl_xmm0 = 0.0
    if (dwEdx >= 0) {
      dbl_xmm0 = Math.pow(2.0, dwEdx) * hleax
    }
    else {
      dbl_xmm0 = (1 / Math.pow(2.0, dwEdx)) * hleax
    }
    dbl_xmm4 = dbl_xmm0
  }

  let dbl_xmm3 = Math.pow(2.0, dwEsi) * lheax
  let dbl_xmm1 = Math.pow(2.0, dwEax) * lleax
  if (hleax & 0x80) {
    dbl_xmm3 *= 2.0
    dbl_xmm1 *= 2.0
  }
  dbl_ret = dbl_xmm6 + dbl_xmm4 + dbl_xmm3 + dbl_xmm1
  return dbl_ret
}

function get_price(data, pos) {
  let pos_byte = 6
  let bdata = data[pos]
  let intdata = bdata & 0x3f
  let sign

  if (bdata & 0x40)
    sign = true
  else
    sign = false

  if (bdata & 0x80) {
    while (true) {
      pos += 1
      bdata = data[pos]
      intdata += (bdata & 0x7f) << pos_byte
      pos_byte += 7

      if (!(bdata & 0x80))
        break
    }
  }
      
  pos += 1

  if (sign)
    intdata = -intdata

  return [ intdata, pos ];
}

function find_csa(arr, subarr, from_index) {
  var i = from_index >>> 0,
      sl = subarr.length,
      l = arr.length + 1 - sl;

  loop: for (; i<l; i++) {
    for (var j=0; j<sl; j++) {
      if (arr[i+j] !== subarr[j]) {
        continue loop;
      }
    }
    return i;
  }
  return -1;
}

module.exports = {
  hexToBytes,
  bytesToHex,
  bufferToBytes,
  bytesToBuffer,
  get_volume,
  get_price,
  find_csa
}
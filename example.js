
// This code was written by Tyler Akins and has been placed in the
// public domain.  It would be nice if you left this header intact.
// Base64 code from Tyler Akins -- http://rumkin.com

var keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";

function encode64(input) {
   var output = "";
   var chr1, chr2, chr3;
   var enc1, enc2, enc3, enc4;
   var i = 0;

   do {
      chr1 = input.charCodeAt(i++);
      chr2 = input.charCodeAt(i++);
      chr3 = input.charCodeAt(i++);

      enc1 = chr1 >> 2;
      enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
      enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
      enc4 = chr3 & 63;

      if (isNaN(chr2)) {
         enc3 = enc4 = 64;
      } else if (isNaN(chr3)) {
         enc4 = 64;
      }

      output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + 
         keyStr.charAt(enc3) + keyStr.charAt(enc4);
   } while (i < input.length);
   
   return output;
}

function decode64(input) {
   var output = "";
   var chr1, chr2, chr3;
   var enc1, enc2, enc3, enc4;
   var i = 0;

   // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
   input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

   do {
      enc1 = keyStr.indexOf(input.charAt(i++));
      enc2 = keyStr.indexOf(input.charAt(i++));
      enc3 = keyStr.indexOf(input.charAt(i++));
      enc4 = keyStr.indexOf(input.charAt(i++));

      chr1 = (enc1 << 2) | (enc2 >> 4);
      chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
      chr3 = ((enc3 & 3) << 6) | enc4;

      output = output + String.fromCharCode(chr1);

      if (enc3 != 64) {
         output = output + String.fromCharCode(chr2);
      }
      if (enc4 != 64) {
         output = output + String.fromCharCode(chr3);
      }
   } while (i < input.length);

   return output;
}




/*****************************************************************
 * LZ77 JavaScript Implementation
 * by Diogo Kollross
 * http://www.geocities.com/diogok_br/lz77/
 *****************************************************************/

ReferencePrefix = "`";
ReferencePrefixCode = ReferencePrefix.charCodeAt(0);

ReferenceIntBase = 96;
ReferenceIntFloorCode = " ".charCodeAt(0);
ReferenceIntCeilCode = ReferenceIntFloorCode + ReferenceIntBase - 1;

MaxStringDistance = Math.pow(ReferenceIntBase, 2) - 1;
MinStringLength = 5;
MaxStringLength = Math.pow(ReferenceIntBase, 1) - 1 + MinStringLength;

MaxWindowLength = MaxStringDistance + MinStringLength;

function encodeReferenceInt(value, width) {
  if ((value >= 0) && (value < (Math.pow(ReferenceIntBase, width) - 1))) {
    var encoded = "";
    while (value > 0) {
      encoded = (String.fromCharCode((value % ReferenceIntBase) + ReferenceIntFloorCode)) + encoded;
      value = Math.floor(value / ReferenceIntBase);
    }

    var missingLength = width - encoded.length;
    for (var i = 0; i < missingLength; i++) {
      encoded = String.fromCharCode(ReferenceIntFloorCode) + encoded;
    }

    return encoded;
  } else {
    throw "Reference int out of range: " + value + " (width = " + width + ")";
  }
}

function encodeReferenceLength(length) {
  return encodeReferenceInt(length - MinStringLength, 1);
}

function decodeReferenceInt(data, width) {
  var value = 0;
  for (var i = 0; i < width; i++) {
    value *= ReferenceIntBase;
    var charCode = data.charCodeAt(i);
    if ((charCode >= ReferenceIntFloorCode) && (charCode <= ReferenceIntCeilCode)) {
      value += charCode - ReferenceIntFloorCode;
    } else {
      throw "Invalid char code in reference int: " + charCode;
    }
  }
  return value;
}

function decodeReferenceLength(data) {
  return decodeReferenceInt(data, 1) + MinStringLength;
}

function compress(data, windowLength) {
  if (windowLength > MaxWindowLength) {
    throw "Window length too large";
  }

  var compressed = "";
  var pos = 0;
  var lastPos = data.length - MinStringLength;
  while (pos < lastPos) {
    var searchStart = Math.max(pos - windowLength, 0);
    var matchLength = MinStringLength;
    var foundMatch = false;
    var bestMatch = {distance: MaxStringDistance, length: 0};
    var newCompressed = null;

    while ((searchStart + matchLength) < pos) {
      var isValidMatch = (
        (data.substr(searchStart, matchLength) == data.substr(pos, matchLength))
        && (matchLength < MaxStringLength)
      );
      if (isValidMatch) {
        matchLength++;
        foundMatch = true;
      } else {
        var realMatchLength = matchLength - 1;
        if (foundMatch && (realMatchLength > bestMatch.length)) {
          bestMatch.distance = pos - searchStart - realMatchLength;
          bestMatch.length = realMatchLength;
        }
        matchLength = MinStringLength;
        searchStart++;
        foundMatch = false;
      }
    }

    if (bestMatch.length) {
      newCompressed = ReferencePrefix
        + encodeReferenceInt(bestMatch.distance, 2)
        + encodeReferenceLength(bestMatch.length);
      pos += bestMatch.length;
    } else {
      if (data.charAt(pos) != ReferencePrefix) {
        newCompressed = data.charAt(pos);
      } else {
        newCompressed = ReferencePrefix + ReferencePrefix;
      }
      pos++;
    }

    compressed += newCompressed;
  }
  return compressed + data.slice(pos).replace(/`/g, "``");
}

function decompress(data) {
  var decompressed = "";
  var pos = 0;
  while (pos < data.length) {
    var currentChar = data.charAt(pos);
    if (currentChar != ReferencePrefix) {
      decompressed += currentChar;
      pos++;
    } else {
      var nextChar = data.charAt(pos + 1);
      if (nextChar != ReferencePrefix) {
        var distance = decodeReferenceInt(data.substr(pos + 1, 2), 2);
        var length = decodeReferenceLength(data.charAt(pos + 3));
        decompressed += decompressed.substr(decompressed.length - distance - length, length);
        pos += MinStringLength - 1;
      } else {
        decompressed += ReferencePrefix;
        pos += 2;
      }
    }
  }
  return decompressed;
}

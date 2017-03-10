'use strict';
var E = module.exports;

function read_int(data, offset){
    return data[offset++]<<21 | data[offset++]<<14 | data[offset++]<<7 |
        data[offset++];
}

function read_utf(data, start, len){
    var res = '';
    for (var i=start; i<start+len; i++)
        res += String.fromCharCode(data[i]);
    return res;
}

function parse_txxx(data){
    var res = {};
    var i = data.indexOf(0);
    if (data[0]!=3 || i<0)
        return res;
    res[read_utf(data, 1, i-1)] = read_utf(data, i+1, data.length-i-1);
    return res;
}

function parse_frames(data){
    var offset = 0, id, size, res = {};
    while (offset+8 <= data.length)
    {
        id = read_utf(data, offset, 4);
        offset += 4;
        size = read_int(data, offset);
        offset += 6;
        if (id=='TXXX')
            res.TXXX = parse_txxx(data.subarray(offset, offset+size));
        offset += size;
    }
    return res;
}

E.parse_id3 = function(data){
    if (!data || !data.length)
        return {};
    var offset = 0, size, header;
    header = read_utf(data, offset, 3);
    if (header!='ID3')
        return {};
    offset += 6;
    size = read_int(data, offset);
    offset += 4;
    return parse_frames(data.subarray(offset, offset+size));
};

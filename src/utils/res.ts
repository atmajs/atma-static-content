
export function res_hasWritableHeaders(res) {
    var sent = res._headerSent;
    if (typeof sent === 'boolean')
        return sent === false;

    return trySet(res, 'X-Powered-By', 'AtmaNode');
};
export function res_writeHeaders(res, headers) {
    for (var key in headers) {
        var val = headers[key];
        if (val != null) {
            res.setHeader(key, val);
        }
    }
};
function trySet(res, name, val) {
    try {
        res.setHeader(name, val);
        return true;
    } catch (error) {
        return false;
    }
}

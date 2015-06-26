// --------------------------------------
//
// Timing
//
// --------------------------------------
var Timings = function Timings(name){
    this._start = Date.now();
    this._data = [];
    this._name = name || (Date.now()).toString(16);
};

Timings.prototype.push = function push( obj ){
    // Takes in an `obj` {Object} (or {String} representing the name) and
    // adds some timing information to it
    if(typeof obj === 'string'){ obj = {name: obj}; }
    obj.time = Date.now();

    if(this._data.length > 0){
        obj.timeSinceLastCall = obj.time - this._data[this._data.length - 1].time;
    }

    return this._data.push(obj);
};

Timings.prototype.toJSON = function toJSON( ){
    // Only return data when JSON'ing
    return this._data;
};
Timings.prototype.toString = function toString( ){
    // Only return data when turning to a string
    return JSON.stringify(this._data);
};
Timings.prototype.printLast = function printLast( ){
    return (this._data.length > 0 ? this._data[this._data.length - 1].timeSinceLastCall : 0) + 'ms';
};

module.exports = Timings;

/* =========================================================================
 *
 * handle-keys.js
 *      handles event triggering when key is pressed
 *
 * ========================================================================= */
var jwerty = require('./lib/jwerty').jwerty;

import _ from 'lodash';
import logger from 'bragi-browser';
import events from './events.js';

var keys = [
    'up', 'down', 'left', 'right',
    'space', 'escape', 'enter',
    'q', 'w', 'e', 'r',
    'shift+q', 'shift+w', 'shift+e', 'shift+r',
    'h', 'j', 'k', 'l',
    '`', 'shift+`', '~', 'shift+~',
    '1', '2', '3', '4', '5', '6',
    'shift+1', 'shift+2', 'shift+3', 'shift+4', 'shift+5', 'shift+6',
    'backspace',
    'tab', 'shift+tab',
    'shift+up', 'shift+down', 'shift+i'
];

var handleKeys = function handleKeys(){
    _.each(keys, function setupKeyHandler(key){
        //Site wide binding
        jwerty.key(key, function jwertyKeyHandler(e){
            //If user is pressing keys in an input element, don't
            //  trigger event
            var tag = e.target.tagName.toLowerCase();

            if(tag !== 'input' && tag !== 'textarea'){
                //don't reload page
                if(key === 'backspace'){ e.preventDefault(); }

                logger.log('handleKeys:received', 'got : ' + key);
                events.emit('keyPress', { key: key, e: e });
            }

            //return the event
            return e;
        });
    });

    logger.log('handleKeys', 'setup key handlers with jwerty');
    return this;
};

module.exports = handleKeys;

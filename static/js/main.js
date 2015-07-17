/* =========================================================================
 *
 * main.js
 *      main entrypoint into app
 *
 * ========================================================================= */
// CSS (loads and gets compiled)
// ------------------------------------
import '../css/main.scss';

// ------------------------------------
//
// External libraries
//
// ------------------------------------
// Global libraries we'll use throughout the app and which should be accessible
// via window
import logger from 'bragi-browser';
logger.transports.get('console').property('showMeta', false);
window.logger = logger;

import _ from 'lodash';
window._ = _;

// d3
import d3 from 'd3';
window.d3 = d3;

import React from 'react';

// Setup jquery
// ----------------
import jQuery from 'jquery';
var $ = jQuery; window.$ = jQuery;
window.jQuery = jQuery;

// jquery plugins
require('./lib/turn')(jQuery);

// ------------------------------------
//
// Internal Dependencies
//
// ------------------------------------
import events from './events.js';
import router from './router.js';

// ====================================
//
// Functionality
//
// ====================================
logger.log("main:game", "Initializing...");
//logger.options.groupsEnabled = ['components/onboarding__new:render'];

// Initial Setup
// ------------------------------------
// Setup key handling
require('./handle-keys')();

// Setup global document / game wide events
$(document).on({
    'show.visibility': function(e) {
        logger.log('document', 'document:show event triggering at : ' + new Date() + ' %O', e);
        events.emit('document:show');
    },
    'hide.visibility': function(e) {
        logger.log('document', 'document:hide event triggering at : ' + new Date() + ' %O', e);
        events.emit('document:hide');
    }
});

// Main entry point
// ------------------------------------
router.run((Handler, state) => {
    let data = {categories: []};
    React.render(<Handler {...state} />, document.body);
});

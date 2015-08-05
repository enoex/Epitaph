/* =========================================================================
 *
 * game-screen__new--page5.js
 *      Race selection
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import logger from 'bragi-browser';
import React from 'react';
import Reflux from 'reflux';
import Immutable from 'immutable';
import classNames from 'classnames';

import d3 from 'd3';

// Internal Dependencies
// ------------------------------------
import events from '../events.js';

import OnboardingNewStore from '../stores/onboarding__new.js';
import OnboardingNewActions from '../actions/onboarding__new.js';
import OnboardingActions from '../actions/onboarding.js';
import OnboardingStore from '../stores/onboarding.js';

// ========================================================================
//
// Functionality
//
// ========================================================================
var Page5 = React.createClass({

    /*
     * handles d3 transitions
     */
    componentDidUpdate: function componentDidUpdate(){
        var data = (this.props.selectedRace ? this.props.selectedRace.toJS() : null);

        logger.log('components/onboarding__new--page5:componentDidUpdate',
        'component did update called | %j', data);

        // setup visualization
        let $viz = d3.select('#onboarding-new-page-5__statsViz');
        let $rects = $viz.selectAll('rect').data([
            data.health, data.power, data.defense
        ]);

        $rects.enter().append('rect')
            .attr({
                x: 0, height: 20,
                y: function(d, i){ return i * 25; },
                width: 0
            });

        $rects.transition().attr({
            x: 0,
            height: 20,
            y: function(d, i){
                return i * 25;
            },
            width: function(d){
                console.log(d);
                return d;
            }
        });

        return this;
    },

    // --------------------------------
    // Render
    // --------------------------------
    render: function render(){
        logger.log('components/onboarding__new--page5:render', 'called %O', this.props);

        // default, empty HTML
        let pageHtml = (
            <div>
            </div>
        );

        let selectedRace = this.props.selectedRace;
        if(selectedRace){
            selectedRace = selectedRace.toJS();

            pageHtml = (
                <div>
                    {selectedRace.name}
                    <svg width='400' height='200' id='onboarding-new-page-5__statsViz'></svg>
                </div>
            );
        }

        // Setup final HTML
        return (
            <div>
                {pageHtml}
            </div>
        );
    }
});

export default Page5;

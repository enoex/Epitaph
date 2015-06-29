/* =========================================================================
 *
 * game-screen__new.js
 *      New character create flow
 *
 * TODO: Disable FINAL back of page turns
 *
 * ========================================================================= */
// External Dependencies
// ------------------------------------
import React from 'react';
import {RouteHandler} from 'react-router';
import logger from 'bragi-browser';
import Reflux from 'reflux';
import Immutable from 'immutable';
import classNames from 'classnames';

import $ from 'jquery';

// Internal Dependencies
// ------------------------------------
import Timings from '../util/Timings.js';

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
var ScreenCreate = React.createClass({
    mixins: [
        Reflux.listenTo(OnboardingNewStore, 'onboardingNewStoreChange')
    ],

    getInitialState: function(){
        this._previousState = {
            state: OnboardingNewStore.getData()
        };

        return {
            state: OnboardingNewStore.getData()
        };
    },

    onboardingNewStoreChange: function(d){
        logger.log('components/onboarding__new:onboardingNewStoreChange',
        'called %O', d);

        this.setState({ state: d.data });

        return this;
    },

    // --------------------------------
    // Utility functions
    // --------------------------------
    getIntroText: function(){
        // TODO: get different text based on past game play
        return `I am old and tired now, but I was not young when the destruction of Felithport began.
        The years since then seem more dim and faded than the years of my youth. Now, I wait.
        Like a gnarled tree, withered and weathered, with nothing to do but decay to the grave.`;
    },

    // --------------------------------
    // Component handling
    // --------------------------------
    componentDidUpdate: function(){
        logger.log('components/onboarding__new:componentDidUpdate', 'called %O', { state: this.state });

        // If page state is different, we do need to re-setup page turn
        if(this._previousState.state.get('page') !== this.state.state.get('page')){
            logger.log('components/onboarding__new:componentDidUpdate:differentPage',
            'turning to new page');

            this.pageTurn.turn('page', this.state.state.get('page'));
        }

        // Update previous states
        this._previousState = this.state;
    },

    componentDidMount: function(){
        logger.log('components/onboarding__new:componentDidMount', 'called');

        // Trigger animations / transitions based on state
        this.setupPageTurn();

        // handle keyboard events
        events.addListener('keyPress', this.handleKeyPress);

        return this;
    },

    componentWillUnmount: function(){
        logger.log('components/onboarding__new:componentWillUnmount', 'called');

        events.removeListener('keyPress', this.handleKeyPress);
    },

    // Setup page turn
    // --------------------------------
    setupPageTurn: function() {
        // TODO: get pages based on state? Re-call flipbook and destroy?
        // TODO: Call flipbook create if it was destroyed?
        // Check previous state?
        logger.log('components/onboarding__new:setupPageTurn', 'called');

        // Setup page turner
        let duration = 600;

        // Page turn needs to be setup here so we can call re-render on the
        // subcomponents (new / title / history) without having to re-setup
        // the page turn
        this.pageTurn = $("#game-screen-onboarding__book--new").turn({
            height: parseInt($('#game-screen-onboarding__book-wrapper--new').height(), 10),
            page: 1,
            disableClickToTurn: this.state.state.get('bookState') === 'title' ? false : true,
            autoCenter: true,
            gradients: true,
            acceleration: true,
            duration: duration,
            elevation: 150,
            when: {
                turning: (event, page, pageObject)=> {
                    logger.log('components/onboarding__new:pageTurn:turning',
                    'turning page: %O', {
                        event: event,
                        targetPage: page,
                        bookState: this.state.state.get('bookState'),
                        pageObject: pageObject
                    });

                    // TODO: Trigger actions that other components listen to

                    // When going BACK to page 1 (from any book state),
                    // trigger the gameTitle action to update the state so the
                    // book and component will rerender
                    if(page === 1){
                        let retriggerStateDuration = 190;
                        setTimeout(()=>{requestAnimationFrame(()=>{
                            // Change state
                            OnboardingActions.showTitle();

                        }); }, retriggerStateDuration);
                    }
                }
            }
        });

        // Disable page turn animation
        this.pageTurn.bind('start', function (event, pageObject, corner){
            if (corner === 'tl' || corner === 'tr' ||
            corner === 'bl' || corner === 'br'){
                return event.preventDefault();
            }
        });

        // add the transition class AFTER we've setup the page turn, as if
        // it is added before the margin-left will transition and the book
        // will slide in - we want it started centered
        requestAnimationFrame(()=>{
            $("#game-screen-onboarding__book--new").addClass('transition');
            $("#game-screen-onboarding__book--new").turn("page", this.state.state.get('page'));
        });
    },

    // --------------------------------
    //
    // Page actions
    //
    // --------------------------------

    // Handle Keyboard Input
    // --------------------------------
    handleKeyPress: function(data){
        logger.log('components/onboarding__new:handleKeyPress',
        'called with | ', data);
        // handle page turning
        if(data.key === 'right'){ return this.pageNext(); }
        else if(data.key === 'left'){ return this.pagePrevious(); }

        return true;
    },

    pagePrevious: function pageNext(){
        logger.log('components/onboarding__new:pagePrevious', 'called');

        // TODO: Check if we CAN go to next state
        OnboardingNewActions.pageTurnPrevious();
    },
    pageNext: function pageNext(){
        logger.log('components/onboarding__new:pageNext', 'called');

        // TODO: Check if we CAN go to next state
        OnboardingNewActions.pageTurnNext();
    },

    // --------------------------------
    // Handle actions
    // --------------------------------
    // NOTE: we can call OnboardingActions.turnPage({ page: X }) to turn the page
    arrowClickedPrevious: function(){
        logger.log('components/onboarding__new:arrowClickedPrevious', 'called');

        this.pagePrevious();
    },
    arrowClickedNext: function(){
        logger.log('components/onboarding__new:arrowClickedNext', 'called');

        this.pageNext();
    },

    // --------------------------------
    // Render
    // --------------------------------
    render: function(){
        let currentPage = this.state.state.get('page');
        logger.log('components/onboarding__new:render', 'called | page: ' + currentPage);

        // ----------------------------
        // Get HTML for pages
        // ----------------------------

        // PAGE 1
        // ---------------------------
        let page1Html;
        page1Html = (
            <div>
                <div className='onboarding-new__page-1__intro-text'>
                    {this.getIntroText()}
                </div>
                <div className='onboarding-new__page-1__name-warpper'>
                    I was infamous; most people knew me as
                    <br />
                    <input type='text'
                        className='interaction'
                        placeholder='Alias'
                        id='onboarding-new__page1__name-input' />
                </div>
            </div>
        );

        // Arrow HTML
        // ----------------------------
        // PREVIOUS
        var previousClasses = classNames({
            'game-screen-onboarding__book-arrow--next': true,
            'opacity0': currentPage < 3 ? true : false
        });
        let arrowHtmlPrevious = (
            <div className={previousClasses}
                onClick={this.arrowClickedPrevious}>
                &lt;
            </div>
        );

        // NEXT
        var nextClasses = classNames({
            'game-screen-onboarding__book-arrow--next': true,
            'opacity0': currentPage > 7 ? true : false
        });
        let arrowHtmlNext = (
            <div className={nextClasses}
                onClick={this.arrowClickedNext}>
                &gt;
            </div>
        );

        // Render it
        // ----------------------------
        return (
            <div id='game-screen-onboarding__book-wrapper--new' className='game-screen-onboarding__book-item-wrapper'>
                <div id="game-screen-onboarding__book--new" className="game-screen-onboarding__book-item">
                    <div key='page1' className="hard"></div>
                    <div key='page2' className="hard"></div>

                    <div key='page3'>{page1Html}</div>

                    <div key='page4'> Page 2 </div>
                    <div key='page5'> Page 3 </div>
                    <div key='page6'> Page 4 </div>
                    <div key='page7'> Page 5 </div>
                    <div key='page8'> Page 6 </div>

                    <div key='page9' className="hard"></div>
                    <div key='page10' className="hard"></div>
                </div>

                {arrowHtmlPrevious}
                {arrowHtmlNext}
            </div>
        );
    }
});

export default ScreenCreate;

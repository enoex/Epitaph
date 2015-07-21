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

// TODO: XXXXXXXXXXXXXXXXXXXX REMOVE
window.A = OnboardingActions;

// Pages
import Page3 from './onboarding__new--page3.js';

// ========================================================================
//
// Functionality
//
// ========================================================================
// Utility vars
var PAGE_FLIP_DURATION = 600;

// Component
var ScreenCreate = React.createClass({
    mixins: [
        Reflux.listenTo(OnboardingNewStore, 'onboardingNewStoreChange')
    ],

    getInitialState: function(){
        this._previousState = {
            state: OnboardingNewStore.getState()
        };

        return {
            state: OnboardingNewStore.getState()
        };
    },

    onboardingNewStoreChange: function(message){
        logger.log('components/onboarding__new:onboardingNewStoreChange',
        'called %O', message);

        this.setState({ state: message.state });

        return this;
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
            duration: PAGE_FLIP_DURATION,
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
            $("#game-screen-onboarding__book--new").addClass('transition');
            $("#game-screen-onboarding__book--new").turn("page", this.state.state.get('page'));
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

    arrowClickedPrevious: function(){
        logger.log('components/onboarding__new:arrowClickedPrevious', 'called');
        this.pagePrevious();
    },
    arrowClickedNext: function(){
        logger.log('components/onboarding__new:arrowClickedNext', 'called');
        this.pageNext();
    },

    // --------------------------------
    // Handle page switching
    // --------------------------------
    // NOTE: progress checked in store
    pagePrevious: function pageNext(){
        logger.log('components/onboarding__new:pagePrevious', 'called');

        // Don't show flip if timer not met
        this._lastPageTurnTime = this._lastPageTurnTime || 0;
        if(Date.now() - this._lastPageTurnTime < (PAGE_FLIP_DURATION / 1.5)){
            return false;
        }
        this._lastPageTurnTime = Date.now();

        // Now check if we can turn the page
        OnboardingNewActions.pageTurnPrevious();
    },
    pageNext: function pageNext(){
        logger.log('components/onboarding__new:pageNext', 'called');

        // Don't show flip if timer not met
        this._lastPageTurnTime = this._lastPageTurnTime || 0;
        if(Date.now() - this._lastPageTurnTime < (PAGE_FLIP_DURATION / 1.5)){
            return false;
        }
        this._lastPageTurnTime = Date.now();

        // Now check if we can turn the page
        OnboardingNewActions.pageTurnNext();
    },

    // --------------------------------
    // Render
    // --------------------------------
    render: function(){
        let currentPage = this.state.state.get('page');
        logger.log('components/onboarding__new:render', 'called | page: ' + currentPage);

        // Arrow HTML
        // ----------------------------
        // PREVIOUS
        var previousClasses = classNames({
            'game-screen-onboarding__book-arrow--previous': true,
            'opacity0': currentPage < 4 ? true : false
        });
        let arrowHtmlPrevious = (
            <div className={previousClasses}
                onClick={this.arrowClickedPrevious}>
                <div className='arrow'></div>
            </div>
        );

        // NEXT
        var nextClasses = classNames({
            'game-screen-onboarding__book-arrow--next': true,
            'opacity0': currentPage > 7 ? true : false,
            'disabled': this.state.state.get('furthestPageEnabled') <= currentPage
        });
        let arrowHtmlNext = (
            <div className={nextClasses}
                onClick={this.arrowClickedNext}>
                <div className='arrow'></div>
            </div>
        );

        // Class name setup
        var bookWrapperClassName = 'game-screen-onboarding__book-item-wrapper ' +
            'game-screen-onboarding__book-item-wrapper--page-' + currentPage;

        // Render it
        // ----------------------------
        return (
            <div id='game-screen-onboarding__book-wrapper--new'
                className={bookWrapperClassName}>
                <div id="game-screen-onboarding__book--new" className="game-screen-onboarding__book-item">
                    <div key='page1' className="hard"></div>

                    <div key='page2' className="hard onboarding-new__page-wrapper">
                        <div className='onboarding-book__page-inner'>
                            NAME
                        </div>
                    </div>

                    <div key='page3' className='onboarding-new__page-wrapper'>
                        <div className='onboarding-book__page-inner'>
                            <Page3 name={this.state.state.get('entity__name')}
                                fadeInIntroText={this.state.state.get('page3__fadeInIntroText')}
                            />
                        </div>
                    </div>

                    <div key='page4' className='onboarding-new__page-wrapper'>
                        <div className='onboarding-book__page-inner'>
                            Select Race
                        </div>
                    </div>
                    <div key='page5' className='onboarding-new__page-wrapper'>
                        <div className='onboarding-book__page-inner'>
                            Race Info
                        </div>
                    </div>

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

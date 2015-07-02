/* =========================================================================
 *
 * save-date-on-change-for-key.js
 *  Handles persisting store state when store changes
 *
 * ========================================================================= */
import logger from 'bragi-browser';

function saveDataOnChangeForKey( store, key ){
    store.listen((d)=>{
        logger.log('saveDataOnChangeForKey', 'called with | ' + key);

        // Update localforage when state changes
        window.localforage.setItem(
            key, JSON.stringify(store.state.toJS())
        );
    });
}

export default saveDataOnChangeForKey;

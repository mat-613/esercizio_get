/**
 * Created by mat613 on 02/12/2016.
 */
import {combineReducers} from 'redux'

function mioReducer(state=[],action) {
    switch (action.type){
        case 'CAMBIO_NEWS':
            return [...action.value];
        default:
            return state;

    }
}
function mioSecondoReducer(state=[],action){
    switch (action.type) {
        case 'CAMBIO_TITOLO':
            return [...action.title];
        default:
            return state;
    }
}
export default combineReducers({mioReducer:mioReducer,mioSecondoReducer:mioSecondoReducer});
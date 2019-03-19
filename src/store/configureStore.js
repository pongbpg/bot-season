import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import authReducer from '../reducers/auth';
import ordersReducer from '../reducers/orders';
import cutoffReducer from '../reducers/cutoff';
import searchReducer from '../reducers/search';
import stockReducer from '../reducers/stock';
import pagesReducer from '../reducers/pages';
import sayhisReducer from '../reducers/sayhis';
import costsReducer from '../reducers/costs';
import gamesReducer from '../reducers/games';
import typesReducer from '../reducers/types';
import manageReducer from '../reducers/manage';
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default () => {
  const store = createStore(
    combineReducers({
      auth: authReducer,
      orders: ordersReducer,
      cutoff: cutoffReducer,
      search: searchReducer,
      stock: stockReducer,
      pages: pagesReducer,
      sayhis: sayhisReducer,
      costs: costsReducer,
      games: gamesReducer,
      types: typesReducer,
      manage: manageReducer
    }),
    composeEnhancers(applyMiddleware(thunk))
    // window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

  return store;
};

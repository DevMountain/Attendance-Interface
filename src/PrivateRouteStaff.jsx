import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import ContextConsumer from './ContextConsumer';

function PrivateRoute({ Component, ...rest }) {
  console.log(rest);
  return (
    <Route
      {...rest}
      render={props =>
        rest.context.state.role === 'staff' ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{
              pathname: '/',
              state: { from: props.location },
            }}
          />
        )
      }
    />
  );
}

export default ContextConsumer(PrivateRoute);

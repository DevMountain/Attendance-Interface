import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import ContextConsumer from './ContextConsumer';

function PrivateRoute({ Component, ...rest }) {
  const { role } = rest.context.state;
  return (
    <Route
      {...rest}
      render={props =>
        role === 'staff' || role === 'student' ? (
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

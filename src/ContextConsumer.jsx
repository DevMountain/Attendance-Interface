import React from 'react';
import { UserContext } from './ContextProvider';

export default function ContextConsumer(Component) {
  return function WrapperComponent(props) {
    return <UserContext.Consumer>{context => <Component {...props} context={context} />}</UserContext.Consumer>;
  };
}

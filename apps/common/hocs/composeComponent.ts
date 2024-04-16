import React from 'react';
import { flowRight } from '../utils/lodash';

const composeComponent =
  <P = void>(hocs: P extends void ? never : any[]) =>
  (Component: P extends void ? never : React.ComponentType<any>) =>
    flowRight(hocs)(Component) as React.FC<P>;
export default composeComponent;

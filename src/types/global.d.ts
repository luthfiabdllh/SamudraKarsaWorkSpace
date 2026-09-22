/* eslint-disable @typescript-eslint/triple-slash-reference */
/* eslint-disable @typescript-eslint/no-empty-object-type */
/// <reference types="react" />
/// <reference types="react-dom" />

import type React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements extends React.JSX.IntrinsicElements {}
    type Element = React.JSX.Element;
  }
}

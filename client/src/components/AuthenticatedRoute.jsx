import React from 'react';

/**
 * This Component is a subclass of Route. It contains code for determining
 * whether or not a user is logged in and only allows that user to access
 * his/her desired Route if he/she is logged in.
 * @param {Object|null} props - The data passed to this Component when it was
 * created or by its parent Component.
 * @return {Component|null|false} - HTML representation of this Component
 * for DOM rendering or null/false if nothing is to be rendered.
 */
export default function AuthenticatedRoute(props) {
  const token = window.localStorage.getItem('token');
  if (token !== '' && token !== null) {
    return <props.component {...props} />;
  }

  window.location.replace('/');
  return null;
}

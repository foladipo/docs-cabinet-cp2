import React from 'react';

/**
 * This is the '404: Not Found' page.
 * @return {Component|null} - A Component for DOM rendering.
 * Otherwise, return null to prevent the rendering of this Component.
 */
export default function NotFoundContainer() {
  const goBack = (e) => {
    e.preventDefault();
    window.history.back();
  };

  return (
    <div>
      <div className="col-xs-0 col-md-1" />
      <div className="col-xs-12 col-md-10">
        <div className="full-horizontal-whitespace" />
        <button
          id="go-back-btn"
          onClick={goBack}
          className="btn btn-success btn-lg center-block"
        >
          Go Back
        </button>
        <div className="quarter-horizontal-whitespace" />
        <img className="img-responsive center-block" alt="Page not found. Please go back." src="https://res.cloudinary.com/worldgeek/image/upload/v1493668469/404-page-not-found.jpg" />
      </div>
      <div className="col-xs-0 col-md-1" />
    </div>
  );
}

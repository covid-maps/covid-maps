import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";

function share(params) {
  if (navigator && navigator.share) {
    return navigator.share({
      title: params.title,
      text: params.text,
      url: params.url,
    });
  }
}

function ShareButton(props) {
  const {
    label = "",
    icon = <i className="far fa-share-alt"></i>,
    title,
    url,
    text,
  } = props;

  const [showShareButton, setShowShareButton] = useState(false);
  useEffect(() => {
    if (navigator && navigator.share) {
      setShowShareButton(true);
    }
  }, []);

  if (!showShareButton) {
    return null;
  }

  return (
    <Button
      onClick={() =>
        share({
          title: title,
          url: url,
          text: text,
        })
      }
    >
      {label} {icon}
    </Button>
  );
}

export default ShareButton;

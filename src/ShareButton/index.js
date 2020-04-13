import React from "react";
import Button from "react-bootstrap/Button";

const shareApiIsAvailable = () => {
  return navigator && navigator.share;
};

const share = params => {
  navigator.share({
    title: params.title,
    text: params.text,
    url: params.url,
  });
};

const ShareButton = props => {
  const { children, title, url, text, ...restProps } = props;

  if (!shareApiIsAvailable()) {
    return null;
  }

  return (
    <Button
      {...restProps}
      onClick={() =>
        share({
          title: title,
          url: url,
          text: text,
        })
      }
    >
      {children}
    </Button>
  );
};

export default ShareButton;

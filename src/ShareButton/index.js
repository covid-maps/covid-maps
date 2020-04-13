import React from "react";
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

const shareApiIsAvailable = () => {
  return true;
  return navigator && navigator.share;
};

function ShareButton(props) {
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
}

export default ShareButton;

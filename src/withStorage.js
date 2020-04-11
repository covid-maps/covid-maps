import React, { Component } from "react";

const withStorage = storageType => PassedComponent => {
  class ComponentWithStorage extends Component {
    getItemFromStorage(key) {
      if (!key) {
        return false;
      }
      if (storageType) {
        return storageType.getItem(key);
      }
      return false;
    }

    setItemToStorage(key, value) {
      if (!key) {
        return false;
      }
      if (storageType) {
        storageType.setItem(key, value);
        return true;
      }
      return false;
    }

    removeItemFromStorage(key) {
      if (!key) {
        return false;
      }
      if (storageType) {
        storageType.removeItem(key);
        return true;
      }
      return false;
    }

    render() {
      return (
        <PassedComponent
          {...this.props}
          getItemFromStorage={this.getItemFromStorage}
          setItemToStorage={this.setItemToStorage}
          removeItemFromStorage={this.removeItemFromStorage}
        />
      );
    }
  }

  return ComponentWithStorage;
};

export const withLocalStorage = withStorage(window.localStorage);
export const withSessionStorage = withStorage(window.sessionStorage);

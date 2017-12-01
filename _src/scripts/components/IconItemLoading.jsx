import React from "react";

const styles = {
  width: '100%',
  fontSize: '14px',
  height: '100px'
};

export default function IconItemLoading() {
  return (
    <li style={styles}>
      <img
        src="/shared/static/img/loading.gif"
        alt="Loading"
        width="24"
        height="24"
        style={{ marginRight: '5px' }}
      />
      Loading...
    </li>
  );
}

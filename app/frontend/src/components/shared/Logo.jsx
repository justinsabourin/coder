import React from "react";

const Logo = ({ className }) => {
  let style = { height: "auto" };
  if (!className) style.width = 120;
  return (
    <img
      className={className}
      style={style}
      src="assets/logo.png"
      alt="Boot Project"
    />
  );
};

export default Logo;

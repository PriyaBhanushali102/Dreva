import React from 'react'
import { Link } from 'react-router-dom';

function Logo({ className}) {
  return (
      <img
        src='/Logo.jpg'
        alt='Dreva Logo'
        className={` ${className}`}      />
  );
}

export default Logo
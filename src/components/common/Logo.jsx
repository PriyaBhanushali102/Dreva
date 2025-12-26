import React from 'react'
import { Link } from 'react-router-dom';

function Logo({ className}) {
  return (
    <Link to="/" className='flex items-center gap-2'>
      <img
        src='/Logo.jpg'
        alt='Dreva Logo'
        className={` object-contain ${className}`}      />
    </Link>
  );
}

export default Logo
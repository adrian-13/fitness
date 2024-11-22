import './ProfileIcon.css'
import React from 'react';
import { FaUserCircle } from 'react-icons/fa';

const ProfileIcon = ({ onClick }) => {
  return (
    <div className="profile-icon" onClick={onClick}>
      <FaUserCircle size={30} />
    </div>
  );
};

export default ProfileIcon;

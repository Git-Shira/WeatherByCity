import React, { useState } from 'react';

import LocationSearch from './LocationSearch';
import LocationsList from './LocationsList';

const LocationsManager = () => {
  const [isListVisible, setIsListVisible] = useState(true);

  const toggleListVisibility = (isVisible) => {
    setIsListVisible(isVisible);
  };

  return (
    <div style={{ padding: "10px 20px" }}>
      <LocationSearch toggleListVisibility={toggleListVisibility} />
      {isListVisible &&
        <LocationsList />
      }
    </div>
  )
}

export default LocationsManager

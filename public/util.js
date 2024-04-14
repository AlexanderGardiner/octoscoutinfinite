async function getJSONConfig() {
  try {
    const response = await fetch("/config.json");
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching JSON config:", error);
    return null;
  }
}

// Calculates the pixels from the top of the screen so the button is positioned on the field at the correct x coordinate (in meters).
function xPositionMetersToPixelsFromTop(
  fieldImage,
  xMeters,
  widthInPercentOfScreen
) {
  return (
    fieldImage.getBoundingClientRect().top +
    xMeters * (fieldImage.clientHeight / 16.4) -
    ((widthInPercentOfScreen / 100) * window.innerHeight) / 2
  );
}

// Calculates the pixels from the left of the screen so the button is positioned on the field at the correct y coordinate (in meters).
function yPositionMetersToPixelsFromLeft(
  fieldImage,
  yMeters,
  widthInPercentOfScreen
) {
  return (
    fieldImage.getBoundingClientRect().left +
    yMeters * (fieldImage.clientWidth / 8.2) -
    ((widthInPercentOfScreen / 100) * window.innerHeight) / 2
  );
}

export {
  getJSONConfig,
  xPositionMetersToPixelsFromTop,
  yPositionMetersToPixelsFromLeft,
};

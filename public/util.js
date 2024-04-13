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

export { getJSONConfig };

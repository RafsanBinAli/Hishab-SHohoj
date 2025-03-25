export const fetchShops = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_BACKEND_URL}/get-all-shops`
    );
    if (!response.ok) throw new Error("Failed to fetch shops");
    const data = await response.json();
    data.sort((a, b) => a.shopName.localeCompare(b.shopName));
    return data;
  } catch (error) {
    console.error("Error fetching shops:", error);
    return [];
  }
};

export const fetchFarmers = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_BACKEND_URL}/get-all-farmers`
    );
    if (!response.ok) throw new Error("Failed to fetch users");
    const data = await response.json();
    data.sort((a, b) => a.name.localeCompare(b.name));
    return data;
  } catch (error) {
    console.error("Error fetching farmers:", error);
    return [];
  }
};

export const fetchCardDetails = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_BACKEND_URL}/get-all-market-details-ofToday`
    );
    if (!response.ok) throw new Error("Failed to fetch all the card details");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching card details", error);
    return [];
  }
};

export const fetchBanks = async () => {
  try {
    const response = await fetch(
      `${import.meta.env.VITE_APP_BACKEND_URL}/bank/get-all`
    );
    if (!response.ok) throw new Error("Failed to fetch all the banks");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching banks", error);
    return [];
  }
};

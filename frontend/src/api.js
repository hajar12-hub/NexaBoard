// frontend/src/api.js
const apiUrl = import.meta.env.VITE_API_URL;

export const fetchData = async () => {
  try {
    const res = await fetch(`${apiUrl}/api/data`);
    return await res.json();
  } catch (err) {
    console.error(err);
    return null;
  }
};

const baseURL = process.env.NEXT_PUBLIC_BASE_URL;

export const publicFetch = async (path) => {
  const res = await fetch(`${baseURL}${path}`);

  if (!res.ok) {
    const message = await res.text();

    console.error("URL:", `${baseURL}${path}`);
    console.error("Status:", res.status);
    console.error("Response:", message);

    throw new Error(`${res.status}: ${message}`);
  }

  return res.json();
};
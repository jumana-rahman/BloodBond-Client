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
export const protectedFetch = async (path) => {
  const res = await fetch(`${baseURL}${path}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      // Include any browser-side authentication tokens or credentials here if needed
    },
  });

  if (!res.ok) {
    let errorMessage = `Request failed: ${res.status}`;
    try {
      const data = await res.json();
      errorMessage = data.message || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }
  return res.json();
};

export const serverMutation = async (path, body = {}, method = "POST") => {
  const res = await fetch(`${baseURL}${path}`, {
    method: method,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    let errorMessage = `Mutation failed: ${res.status}`;
    try {
      const data = await res.json();
      errorMessage = data.message || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }
  return res.json();
};
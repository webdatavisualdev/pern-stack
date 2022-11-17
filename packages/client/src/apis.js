const API = process.env.REACT_APP_API;

export const get = async (path) => {
  try {
    const res = await fetch(`${API}/${path}`);
    const data = await res.json();
    return data;
  } catch (e) {
    return null;
  }
};

export const post = async (path, body) => {
  try {
    const res = await fetch(`${API}/${path}`, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      method: "post",
      body: JSON.stringify(body),
    });
    const data = await res.json();
    return data;
  } catch (e) {
    return null;
  }
};

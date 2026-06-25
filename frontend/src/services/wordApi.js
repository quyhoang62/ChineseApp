import { API_BASE_URL } from "../config/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    let message = "API request failed";

    try {
      const errorData = await response.json();
      message = errorData.message || message;
    } catch (error) {
      // Ignore JSON parsing errors and keep default message.
    }

    throw new Error(message);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const wordApi = {
  list() {
    return request("/words");
  },
  create(payload) {
    return request("/words", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateLearned(id, learned) {
    return request(`/words/${id}/learned`, {
      method: "PATCH",
      body: JSON.stringify({ learned }),
    });
  },
  remove(id) {
    return request(`/words/${id}`, {
      method: "DELETE",
    });
  },
};

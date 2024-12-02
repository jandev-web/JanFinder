const PROXY_URL = 'https://<api-id>.execute-api.<region>.amazonaws.com/magicplan';

const proxyFetch = async (action, projectName = null) => {
  const response = await fetch(PROXY_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      action,
      project_name: projectName
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch');
  }

  return response.json();
};

export const createProject = async (projectName) => {
  return proxyFetch('createProject', projectName);
};

export const getProjects = async () => {
  return proxyFetch('getProjects');
};

// Add more API functions as needed


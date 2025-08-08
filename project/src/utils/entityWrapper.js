import manifestConfig from '../../manifest.config.json';

export function createEntityClient(entityName, schema) {
      
    const projectId = manifestConfig.appId || "not-defined";

    //const baseUrl = `https://db.madewithmanifest.com/${projectId}/entities/${entityName}`;
    const baseUrl = `http://localhost:3500/${projectId}/entities/${entityName}`;

    return {
      list: async (sort) => {
        const url = new URL(baseUrl);
        if (sort) url.searchParams.set("sort", sort);
        const res = await fetch(url, {
          credentials: 'include'
        });
        return res.json();
      },
      get: async (id) => {
        const res = await fetch(`${baseUrl}/${id}`, {
          credentials: 'include'
        });
        return res.json();
      },
      create: async (data) => {
        const res = await fetch(baseUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
          body: JSON.stringify(data),
        });
        return res.json();
      },
      // Add update() using PUT
      update: async (id, data) => {
        const res = await fetch(`${baseUrl}/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          credentials: 'include',
          body: JSON.stringify(data),
        });
        return res.json();
      },
      // Add delete() using DELETE
      delete: async (id) => {
        const res = await fetch(`${baseUrl}/${id}`, {
          method: "DELETE",
          credentials: 'include',
        });
        return res.json();
      },
    };
  }
  
const BASE_URL = "http://localhost:5500";

export const request = async (resource, options) => 
    await fetch(BASE_URL + resource, options);
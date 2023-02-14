import { useState } from "react";
import APIS from "./index";

type mutate = (body?: any, params?: any) => Promise<any>;
type use_api = (q: any) => [mutate, boolean]

const useAPI: use_api = (query) => {
  const [loading, toggleLoading] = useState(false);

  const mutate = async (body: any, params: any) => {
    try {
      toggleLoading(true);
      const res = await query(body, params);
      return res;
    } catch (err) {
      throw err;
    } finally {
      toggleLoading(false);
    }
  };

  return [mutate, loading];
};

const errorHandler = (error: any) => {
  if (typeof error == "string") {
    return error;
  } else if (error.response) {
    return error.response.data;
  } else if (error.message) {
    return `${error.message}`;
  } else {
    return "Something went wrong";
  }
};

export { useAPI, APIS, errorHandler };

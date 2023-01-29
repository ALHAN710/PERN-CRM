import { fetcher, TRequestInfo } from "./api";

/**
 * RESTful API Create operation to create a new ressource <T> passed in parameter
 *
 * @param data <T> : Resource data object to create
 * @param url string : URL to create the resource
 * @returns Promise<ResponseType<POST, T>>
 */
export const create = async <T>(data: T, url: string, isPublic = false) => {
  const input: TRequestInfo = {
    url,
    isPublic,
  };
  return await fetcher<"POST", T>(input, {
    method: "POST",
    body: JSON.stringify(data),
  });
};

/**
 * RESTful API Update operation to update the ressource <T> passed in parameter
 *
 * @param data <T> : Resource data object to create
 * @param url string : URL to update the resource
 * @returns Promise<ResponseType<PUT, T>>
 */
export const update = async <T>(data: T, url: string) => {
  return await fetcher<"PUT", T>(
    { url, isPublic: false },
    {
      method: "PUT",
      body: JSON.stringify(data),
    }
  );
};

/**
 * RESTful API Delete operation to remove a ressource<T> item passed into the url by its id.
 * @param url string : URL to delete the item resource from the database
 * @returns Promise<ResponseType<DELETE, T>>
 */
export const remove = async <T>(url: string) => {
  return await fetcher<"DELETE", T>(
    { url, isPublic: false },
    {
      method: "DELETE",
    }
  );
};

export const CRUD = {
  create,
  update,
  delete: remove,
};

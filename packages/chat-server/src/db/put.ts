import client from '../client';

export default (params: any) => {
  return new Promise((resolve, reject) => {
    client.put(params, (err: any, data: any) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve(data);
    });
  });
};

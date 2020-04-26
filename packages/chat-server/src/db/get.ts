import client from '../client';

export default (params: any) => {
  return new Promise((resolve, reject) => {
    client.get(params, (err, data) => {
      if (err) {
        console.error(err);
        reject(err);
      }
      resolve(data);
    });
  });
};
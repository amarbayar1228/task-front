import axios from "axios";

async function SlugPost(slug, data, headers) {
  return new Promise((resolve, reject) => {
    axios.post(`${process.env.BACK_URL}/${slug}/`, data).then(
      (result) => {
        resolve(result);
      },
      (error) => {
        reject(error);
      }
    );
  });
}

export default async function handler(req, res) {
  const { slug } = req.query;
  await SlugPost(slug.join("/"), req.body).then(
    function (response) {
      res.status(200).json(response.data);
    },
    function (error) {
      res.status(400).json(error.data);
    }
  );
}

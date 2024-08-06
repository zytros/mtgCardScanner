import { Content } from '../../types/content';
import axiosClient from '../apiClient'
import JSZip from 'jszip';


/**
 * get the data points through a post request
 * @param id the identifier of the point array

export function postPoints(id: string): Promise<DataArray | undefined> {
  const url = `data/${id}`
  const promise = axiosClient.get<DataArray>(url)
  return promise
    .then((res) => {
      if (res.status !== 204) {
        return res.data;
      }
      return undefined;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}
*/

export function getContent(): Promise<Content> {
  const url = `content`
  const promise = axiosClient.get<Content>(url)
  return promise
    .then((res) => {
      // console.log(res.data);
      return res.data;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}

/*export function getImage(image_path: string): Promise<BinaryData | undefined> {
  const url = `img/${image_path}`
  const promise = axiosClient.get<BinaryData>(url)
  return promise
    .then((res) => {
      if (res.status !== 204) {
        console.log(res.data);
        Diego
        return res.data;
      }
      return undefined;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}*/
export function getImage(image_path: string): Promise<string | undefined> {
  const url = `img/${image_path}`
  const promise = axiosClient.get<ArrayBuffer>(url, { responseType: 'arraybuffer' })
  return promise
    .then((res) => {
      if (res.status !== 204) {
        const base64 = btoa(
          new Uint8Array(res.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            '',
          ),
        );
        return `data:image/png;base64,${base64}`;
      }
      return undefined;
    })
    .catch((err) => {
      console.error(err);
      throw err;
    });
}


export function getGIF(image_path: string): Promise<string | undefined> {
  const url = `gif/${image_path}`;
  // console.log("Fetching image from:", url);
  return axiosClient.get<ArrayBuffer>(url, { responseType: 'arraybuffer' })
    .then((res) => {
      // console.log("Response status:", res.status);
      if (res.status !== 204) {
        // console.log("Image fetched successfully:", url);
        const base64 = btoa(
          new Uint8Array(res.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            '',
          ),
        );
        return `data:image/gif;base64,${base64}`;
      }
      return undefined;
    })
    .catch((err) => {
      console.error("Error fetching image:", err);
      return undefined;
    });
}

export async function getImages(path: string, imageNames: string[]): Promise<(string | undefined)[] | undefined> {
  const url = `img_batch/${path}/${imageNames.join(',')}`;
  const promise = axiosClient.get(url, { responseType: 'arraybuffer' });

    try{
      const res = await axiosClient.get(url, { responseType: 'arraybuffer' });
      if (res.status !== 204) {
        const zip = new JSZip();
        const zipContents = await zip.loadAsync(res.data);

        const imagePromises = Object.keys(zipContents.files).map((fileName) => {
          const file = zipContents.file(fileName);
          if (file) {
            return file.async('base64').then((base64:any) => {
              return `data:image/png;base64,${base64}`;
            });
          }
        });

        const base64Images = await Promise.all(imagePromises);
        return Promise.resolve(base64Images.filter((image): image is string => image !== undefined));
      }
      return Promise.resolve(undefined);
    } catch (err) {
      console.error(err);
      throw err;
    };
}

export async function getOcclusionPrediction(fileName: string, array2D: number[][]): Promise<{ name: string; confidence: number; }[]> {
  const url = 'occlusion_prediction';
  const data = {
    fileName,
    array2D,
  };

  try {
    const response = await axiosClient.post(url, data);
    if (response.status === 200) {
      return response.data as { name: string; confidence: number; }[];
    } else {
      throw new Error(`Unexpected response status: ${response.status}`);
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

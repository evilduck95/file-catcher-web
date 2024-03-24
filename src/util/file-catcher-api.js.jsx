import axios from "axios";
import JSZip from "jszip";

const apiBaseUrl = 'http://localhost:8200';
const filmsEndpoint = 'film';
const tvShowsEndpoint = 'tv-show';
const uploadEndpoint = 'upload';
const processEndpoint = 'process';


// const uploadFilm = async (file, uploadProgressCallback) => {
//     let zipArchive;
//     if (file.name.split('.').pop() === 'zip') {
//         zipArchive = file;
//     } else {
//         console.log(`Zipping File ${file.name}`)
//         const jsZip = new JSZip();
//         jsZip.file(file.name, file);
//         zipArchive = await jsZip.generateAsync({type: 'blob'});
//     }
//     console.log(`Uploading ZIP Archive`);
//     const formData = new FormData();
//     formData.append('file', zipArchive);
//     const config = {
//         onUploadProgress: uploadProgressCallback
//     };
//     return axios.post(`${apiBaseUrl}/${filmsEndpoint}/${uploadEndpoint}`, formData, config);
// };

const uploadFilm = async (filmFile, uploadProgressCallback) => {
    const formData = new FormData();
    formData.append('file', filmFile);
    const config = {
        onUploadProgress: uploadProgressCallback
    };
    return axios.post(`${apiBaseUrl}/${filmsEndpoint}/${uploadEndpoint}`, formData, config);
}

const uploadTvShow = async (tvShowArchive, uploadProgressCallback) => {
    const formData = new FormData();
    formData.append('file', tvShowArchive);
    const config = {
        onUploadProgress: uploadProgressCallback
    };
    return axios.post(`${apiBaseUrl}/${tvShowsEndpoint}/${uploadEndpoint}`, formData, config);
}

const processFilm = (jobId) => {
    const requestBody = {
        jobIds: [jobId]
    };
    return axios.patch(`${apiBaseUrl}/${filmsEndpoint}/${processEndpoint}`, requestBody);
};

const processTvShow = (jobId) => {
    const requestBody = {
        jobIds: [jobId]
    };
    return axios.patch(`${apiBaseUrl}/${tvShowsEndpoint}/${processEndpoint}`, requestBody);
}

export {
    uploadFilm,
    uploadTvShow,
    processFilm,
    processTvShow
};
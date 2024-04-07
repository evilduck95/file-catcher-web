import axios from "axios";
import JSZip from "jszip";

const apiBaseUrl = 'http://localhost:8200';
const filmsEndpoint = 'film';
const tvShowsEndpoint = 'tv-show';
const jobsEndpoint = 'job'
const uploadEndpoint = 'upload';
const processEndpoint = 'process';


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

const checkJob = async (jobId) => {
    return axios.get(`${apiBaseUrl}/${jobsEndpoint}/check/${jobId}`);
}

export {
    uploadFilm,
    uploadTvShow,
    processFilm,
    processTvShow,
    checkJob
};
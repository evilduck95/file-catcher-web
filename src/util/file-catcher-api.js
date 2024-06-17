import axios from "axios";

const apiBaseUrl = 'https://evilduck95.net/api';
const filmsEndpoint = 'film';
const tvShowsEndpoint = 'tv-show';
const jobsEndpoint = 'job'
const uploadEndpoint = 'upload';
const processEndpoint = 'process';
const chunkSize = 1048576 * 50; // 3MB

const uploadFilm = async (filmFile, uploadProgressCallback) => {
    const formData = new FormData();
    formData.append('fileName', filmFile.name);
    formData.append('fileChunk', filmFile);
    const config = {
        onUploadProgress: uploadProgressCallback
    };
    return axios.post(`${apiBaseUrl}/${filmsEndpoint}/${uploadEndpoint}`, formData, config);
}

const uploadFileInChunks = async (filmFile, uploadProgressCallback, isFilm) => {
    const chunksToSend = new Set([...Array(Math.ceil(filmFile.size / chunkSize)).keys()]);
    console.log(`Sending ${chunksToSend.size} chunks, ${chunksToSend}`);
    const allPromises = [];
    for (let chunkNumber of chunksToSend) {
        const chunkPromise = _sendChunk(filmFile, chunkNumber, chunksToSend, filmFile.name, uploadProgressCallback, isFilm)
            .then(success => {
                console.log(`Chunk ${chunkNumber} was successful`)
                chunksToSend.delete(chunkNumber);
                uploadProgressCallback(success.data.bytesReceived, filmFile.size);
            })
            .catch(error => {
                console.error(`Error uploading file ${filmFile.name} part ${chunkNumber}. Error ${error}`);
            });
        allPromises.push(chunkPromise);
    }
    return Promise.all(allPromises);
}

const uploadTvShow = async (tvShowArchive, uploadProgressCallback) => {
    const formData = new FormData();
    formData.append('file', tvShowArchive);
    const config = {
        onUploadProgress: uploadProgressCallback
    };
    return axios.post(`${apiBaseUrl}/${tvShowsEndpoint}/${uploadEndpoint}`, formData, config);
}

const processFile = (jobId, isFilm) => {
    const requestBody = {
        jobIds: [jobId]
    };
    return axios.patch(`${apiBaseUrl}/${isFilm ? filmsEndpoint : tvShowsEndpoint}/${processEndpoint}`, requestBody);
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

const _sendChunk = (filmFile,
                    chunkNumber,
                    totalChunks,
                    fileName,
                    isFilm) => {
    const chunkStartByte = chunkSize * chunkNumber;
    const nextChunk = filmFile.slice(chunkStartByte, Math.min(chunkSize * (chunkNumber + 1), filmFile.size));
    const formData = new FormData();
    formData.append('chunkStartByte', chunkStartByte);
    formData.append('totalFileBytes', filmFile.size)
    formData.append('fileChunk', nextChunk, fileName);
    return axios.post(`${apiBaseUrl}/${isFilm ? filmsEndpoint : tvShowsEndpoint}/${uploadEndpoint}`, formData);
}

export {
    uploadFilm,
    uploadFileInChunks,
    uploadTvShow,
    processFile,
    processTvShow,
    checkJob
};
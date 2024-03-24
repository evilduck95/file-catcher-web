import React, {useState} from "react";
import styled from "styled-components";
import {ImCloudUpload, ImCross} from "react-icons/im";
import {processFilm, processTvShow, uploadFilm, uploadTvShow} from "../util/file-catcher-api.js";
import Spinner from "./Spinner";
import {FILM, TV_SHOW} from "../util/fileTypes";
import {upload} from "@testing-library/user-event/dist/upload";

const iconSize = 30;

const FileRowContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    padding: 5px;
    text-align: center;
    width: 95%;
    border: dashed black 1px;
`;

const ButtonsContainer = styled.div`
    width: ${iconSize * 2.5}px;
    display: flex;
    justify-content: space-between;
`;

const ProgressBar = styled.div`
    // Respect your parent's boundaries
    position: absolute;
    top: 0;
    left: 0;

    // Max size
    height: 100%;

    background: rgba(0, 255, 0, 0.5);
    opacity: 25%;
`;

const FileRow = ({index, fileType, file, removedCallback}) => {

    const [progress, setProgress] = useState(0);

    const pushFileToServer = () => {
        const isFilm = fileType === FILM;
        const uploadFunc = isFilm ? uploadFilm : uploadTvShow;
        const processFunc = isFilm ? processFilm : processTvShow;
        console.log(`File is ${isFilm ? 'Film' : 'TV Show'}`);
        uploadFunc(file, updateUploadProgress)
            .then(response => {
                console.log(response)
                const {jobId} = response.data;
                processFunc(jobId);
            })
            .catch(error => {
                setProgress(0);
                const {errorMessage, fileName} = error.response.data;
                alert(`Couldn't upload ${fileName}, "${errorMessage}"`);
            });
    };

    const updateUploadProgress = ({progress}) => {
        setProgress(progress * 100);
    };

    const uploading = progress > 0;
    const uploadComplete = progress === 100;

    return (
        <FileRowContainer id={'file'}>
            <ProgressBar id={'hello'} style={{width: `${progress}%`}}/>
            <div>{file.name}</div>
            {!uploading && <ButtonsContainer>
                {uploading ? <Spinner/> : <ImCloudUpload className={'clickable-icon'} size={`${iconSize * 1.1}px`}
                                                         onClick={pushFileToServer}/>}
                <ImCross className={'clickable-icon'} size={`${iconSize}px`} color={'crimson'}
                         onClick={() => removedCallback(index)}/>
            </ButtonsContainer>}
            {uploading && <div>{uploadComplete ? 'Uploaded!' : 'Please wait...'}</div>}
        </FileRowContainer>
    )
};

export default FileRow;
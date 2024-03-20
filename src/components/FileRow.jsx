import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {ImCloudUpload, ImCross} from "react-icons/im";
import {processFilm, uploadFilm} from "../util/file-catcher-api.js";
import Spinner from "./Spinner";

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

const FileRow = ({index, file, removedCallback}) => {

    const [progress, setProgress] = useState(0);
    const [zipping, setZipping] = useState(false);

    useEffect(() => {
        if (progress === 100) setZipping(false);
    }, [progress]);

    const pushFileToServer = () => {
        setZipping(true);
        uploadFilm(file, updateUploadProgress)
            .then(response => {
                console.log(response)
                const { jobId } = response.data;
                processFilm(jobId);
            })
            .catch(error => {
                alert('Something went wrong uploading, please try again later: ' + error);
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
                {zipping ? <Spinner/> : <ImCloudUpload className={'clickable-icon'} size={`${iconSize * 1.1}px`} onClick={pushFileToServer}/>}
                <ImCross className={'clickable-icon'} size={`${iconSize}px`} color={'crimson'}
                         onClick={() => removedCallback(index)}/>
            </ButtonsContainer>}
            {uploading && <div>{uploadComplete ? 'Uploaded!' : 'Please wait...'}</div>}
        </FileRowContainer>
    )
};

export default FileRow;
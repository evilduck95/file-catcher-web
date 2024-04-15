import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {ImCloudUpload, ImCross} from "react-icons/im";
import {checkJob, processFilm, processTvShow, uploadFilm, uploadTvShow} from "../util/file-catcher-api.js";
import Spinner from "./Spinner";
import {FILM} from "../util/fileTypes";

const iconSize = 30;

const FileRowContainer = styled.div`
    background-color: ${props => props.theme.fileRow.backgroundColor};
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    padding: 5px 10px;
    text-align: center;
    width: 95%;
    border: dashed black 1px;
`;

const ButtonsContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-content: end;
`;

const ProgressBar = styled.div`
    // Respect your parent's boundaries
    position: absolute;
    top: 0;
    left: 0;

    // Max size
    height: 100%;

    background: rgba(255, 255, 0, 0.5);
    opacity: 25%;
    pointer-events: none;
`;

const FileName = styled.div`
    text-align: left;
    color: ${props => props.theme.fileRow.textColor}
`;

const JobStateResult = styled.div`
    margin-right: 10px;
    font-weight: bold;
`;

const FileRow = ({
                     index,
                     fileType,
                     file,
                     removedCallback,
                     isSavedUpload = false,
                     existingJobId, existingJobState
                 }) => {

    const [progress, setProgress] = useState(isSavedUpload ? 100 : 0);
    const [jobId, setJobId] = useState(existingJobId);
    const [jobState, setJobState] = useState(existingJobState || 'Pending');

    const updateJobInStorage = (jobId, file, jobStatus) => {
        const localStorageKey = `saved_${fileType}`;
        const savedJobs = JSON.parse(localStorage.getItem(localStorageKey)) || [];
        const jobIndex = savedJobs.map(j => j.jobId).indexOf(jobId);
        // console.log('file', file)
        if (jobIndex > -1) {
            let savedJob = savedJobs[jobIndex];
            console.log('Saved Job', savedJob)
            savedJob.jobStatus = jobStatus;
        } else {
            console.log('Pushing new job')
            savedJobs.push({jobId, file: {name: file.name}, jobStatus});
            console.log('savedjobs', savedJobs, JSON.stringify(file))
        }
        localStorage.setItem(localStorageKey, JSON.stringify(savedJobs));
    }

    useEffect(() => {
        const interval = setInterval(() => {
            console.log(jobId, jobState);
            if (jobId && jobState === 'Pending') {
                checkJob(jobId).then(res => {
                    const {status} = res.data;
                    setJobState(status);
                    updateJobInStorage(jobId, file, status);
                });
            }
        }, 1000);
        if (jobState !== 'Pending') {
            console.log(`Resolved ${jobState} state, stopping interval`);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [jobId, jobState]);


    const pushFileToServer = () => {
        const isFilm = fileType === FILM;
        const uploadFunc = isFilm ? uploadFilm : uploadTvShow;
        const processFunc = isFilm ? processFilm : processTvShow;
        console.log(`File is ${isFilm ? 'Film' : 'TV Show'}`);
        uploadFunc(file, updateUploadProgress)
            .then(response => {
                console.log(response)
                const {jobId} = response.data;
                processFunc(jobId).then(
                    () => {
                        setJobId(jobId);
                        updateJobInStorage(jobId, file, "Pending");
                    },
                    error => alert(`Failed process call for ${file.name}, Error: ${error}`)
                );
            })
            .catch(error => {
                setProgress(0);
                const {errorMessage, fileName} = error.response.data;
                console.log(error)
                alert(`Couldn't upload ${fileName}, "${errorMessage}"`);
            });
    };

    const removed = (index) => {
        console.log("click", index)
        removedCallback(index);
    }

    const updateUploadProgress = ({progress}) => {
        setProgress(progress * 100);
    };

    const uploading = progress > 0 && progress < 100;
    const uploadComplete = progress === 100;
    const pendingJobState = jobState === 'Pending';

    const progressBarStyle = {width: `${progress}%`};
    let progressBarColor;
    switch (jobState) {
        case 'Successful':
            progressBarColor = 'rgba(0, 255, 0, 0.5)';
            break;
        case 'Unsuccessful':
            progressBarColor = 'rgba(255, 0, 0, 0.5)';
            break;
        default:
            progressBarColor = 'rgba(255, 255, 0, 0.5)';
    }
    progressBarStyle.background = progressBarColor;
    const iconsShown = (uploading || uploadComplete) && !pendingJobState ? 1 : 2;
    console.log('file', file)
    return (
        <FileRowContainer id={'file'}>
            <ProgressBar style={progressBarStyle}/>
            <FileName>{file.name}</FileName>
            {uploadComplete && !pendingJobState && <JobStateResult>{jobState}</JobStateResult>}
            {
                <ButtonsContainer style={{width: `${!isSavedUpload * (iconSize * (iconsShown * 1.1) + 10)}px`}}>
                    {
                        !(uploading || uploadComplete) &&
                        <ImCloudUpload className={'clickable-icon'}
                                       size={`${iconSize * 1.1}px`}
                                       onClick={pushFileToServer}/>
                    }
                    {
                        uploadComplete && pendingJobState && <Spinner/>
                    }
                    {!isSavedUpload && <ImCross className={'clickable-icon'}
                                                size={`${iconSize}px`}
                                                color={'crimson'}
                                                onClick={() => removed(index)}/>}
                </ButtonsContainer>
            }
        </FileRowContainer>
    )
};

export default FileRow;
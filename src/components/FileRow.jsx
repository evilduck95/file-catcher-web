import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {ImCloudUpload, ImCross} from "react-icons/im";
import {checkJob, processFile, uploadFileInChunks} from "../util/file-catcher-api.js";
import Spinner from "./Spinner";
import {FILM} from "../util/fileTypes";

const iconSize = 30;

const FileRowContainer = styled.div`
    background-color: ${props => props.theme.fileRow.backgroundColor};
    font-family: "Market Deco";
    position: relative;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;
    padding: 5px 10px;
    text-align: center;
    min-height: 45px;
    width: 100%;
    //border: dashed black 1px;
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

    background: rgb(255, 255, 0);
    opacity: 75%;
    pointer-events: none;
`;

const FileName = styled.div`
    max-width: 200px;
    text-align: left;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: ${props => props.theme.fileRow.textColor};
    flex-basis: 60%;
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
            if (jobId && jobState === 'Pending') {
                checkJob(jobId).then(res => {
                    const {status} = res.data;
                    setJobState(status);
                    updateJobInStorage(jobId, file, status);
                });
            }
        }, 5000);
        if (jobState !== 'Pending') {
            console.log(`Resolved ${jobState} state, stopping interval`);
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [jobId, jobState]);

    useEffect(() => {
        if (!!jobId && !isSavedUpload) {
            processFile(jobId, fileType === FILM).catch(error => alert(`Failed process call for ${file.name}, Error: ${error}`));
        }
    }, [jobId]);

    const pushFileToServer = () => {
        const isFilm = fileType === FILM;
        console.log(`Uploading ${file.name}`);
        uploadFileInChunks(file, updateUploadProgress, isFilm).then(() => {
            setJobId(file.name);
        });
    };

    const removed = (index) => {
        removedCallback(index);
    }

    const updateUploadProgress = (newBytesSent, totalBytes) => {
        setProgress(prevProgress => {
            const additionalProgress = (newBytesSent / totalBytes) * 100;
            return (prevProgress + additionalProgress);
        });
    };

    const uploading = progress > 0 && progress < 100;
    const uploadComplete = progress >= 100;
    const pendingJobState = jobState === 'Pending';

    const progressBarStyle = {width: `${progress}%`};
    let progressBarColor;
    switch (jobState) {
        case 'Successful':
            progressBarColor = 'rgba(0, 255, 0, 0.5)';
            break;
        case 'Unsuccessful':
            progressBarColor = 'rgba(255, 0, 0, 0.25)';
            break;
        default:
            progressBarColor = 'rgba(255, 255, 0, 0.5)';
    }
    progressBarStyle.background = progressBarColor;
    const iconsShown = (uploading || uploadComplete) && !pendingJobState ? 1 : 2;
    // console.log(bytesSent, progress);
    return (
        <FileRowContainer id={'file'}>
            <ProgressBar style={progressBarStyle}/>
            <FileName>{file.name.replace(/\.(?:.(?!\.))+$/, '')}</FileName>
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
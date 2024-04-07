import React, {useEffect, useState} from "react";
import styled from "styled-components";
import {ImCloudUpload, ImCross} from "react-icons/im";
import {checkJob, processFilm, processTvShow, uploadFilm, uploadTvShow} from "../util/file-catcher-api.js";
import Spinner from "./Spinner";
import {FILM} from "../util/fileTypes";

const iconSize = 30;

const FileRowContainer = styled.div`
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
`;

const JobStateResult = styled.div`
    margin-right: 10px;
    font-weight: bold;
`;

const FileRow = ({index, fileType, file, removedCallback}) => {

    const [progress, setProgress] = useState(0);
    const [jobId, setJobId] = useState();
    const [jobState, setJobState] = useState('Pending');

    useEffect(() => {
        const interval = setInterval(() => {
            console.log(jobId, jobState);
            if (jobId && jobState === 'Pending') {
                checkJob(jobId).then(res => {
                    const {status} = res.data;
                    setJobState(status);
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
        let savedJobs = JSON.parse(localStorage.getItem('saved_jobs'));
        if (!savedJobs) {
            savedJobs = {};
            savedJobs[fileType] = {};
        }
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
                        savedJobs[fileType][jobId] = {
                            fileName: file.name
                        };
                        console.log('Saving Jobs', savedJobs);
                        localStorage.setItem('saved_jobs', JSON.stringify(savedJobs));
                    },
                    error => alert(`Failed process call for ${file.name}, Error: ${error}`)
                );
            })
            .catch(error => {
                setProgress(0);
                const {errorMessage, fileName} = error.response.data;
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
    return (
        <FileRowContainer id={'file'}>
            <ProgressBar id={'hello'} style={progressBarStyle}/>
            <FileName>{file.name}</FileName>
            {uploadComplete && !pendingJobState && <JobStateResult>{jobState}</JobStateResult>}
            {
                <ButtonsContainer style={{width: `${iconSize * (iconsShown * 1.1) + 10}px`}}>
                    {
                        !(uploading || uploadComplete) &&
                        <ImCloudUpload className={'clickable-icon'}
                                       size={`${iconSize * 1.1}px`}
                                       onClick={pushFileToServer}/>
                    }
                    {
                        uploadComplete && pendingJobState && <Spinner/>
                    }
                    <ImCross className={'clickable-icon'}
                             size={`${iconSize}px`}
                             color={'crimson'}
                             onClick={() => removed(index)}/>
                </ButtonsContainer>
            }
        </FileRowContainer>
    )
};

export default FileRow;
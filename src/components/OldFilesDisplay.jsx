import React from "react";
import styled from "styled-components";
import FileRow from "./FileRow";

const DisplayContainer = styled.div`
    background-color: ${props => props.theme.fileListDisplay.backgroundColor};
    min-height: 120px;
    margin-top: 10px;
    padding-bottom: 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: solid black 1px;
`;

const Header = styled.div`
    width: 100%;
    font-size: x-large;
    text-align: center;
    border-bottom: grey 1px solid;
`;

const ListContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
`;

const PlaceholderRow = styled.div`
    height: 50px;
    font-style: italic;
    margin-top: 20px;
`;

const OldFilesDisplay = ({fileType}) => {
    const localStorageKey = `saved_${fileType}`;
    const savedJobs = JSON.parse(localStorage.getItem(localStorageKey)) || [];

    // TODO Add index to these as they're in a list.
    const displayFileInfo = (savedJob) => {
        return (
            <FileRow file={savedJob.file} fileType={fileType} isSavedUpload={true} existingJobId={savedJob.jobId}
                     existingJobState={savedJob.jobStatus}/>
        )
    };

    return (
        <DisplayContainer>
            <Header>Previous Uploads</Header>
            <ListContainer>
                {savedJobs.length === 0 && <PlaceholderRow>No Uploaded {fileType.replace('tv_show', 'TV Shows').replace('film', 'Films')} found</PlaceholderRow>}
                {savedJobs.length > 0 && savedJobs.map(f => displayFileInfo(f))}
            </ListContainer>
        </DisplayContainer>
    );
};

export default OldFilesDisplay;
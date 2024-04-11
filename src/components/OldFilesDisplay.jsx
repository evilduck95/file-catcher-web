import React from "react";
import styled from "styled-components";
import FileRow from "./FileRow";

const DisplayContainer = styled.div`
    width: 400px;
    margin-top: 10px;
    padding-bottom: 10px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    border: solid black 1px;
`;

const Header = styled.div`
    width: 100%;
    font-size: x-large;
    text-align: center;
    border-bottom: grey 1px solid;
`;

const PlaceholderRow = styled.div`
    height: 50px;
    font-style: italic;
    margin-top: 20px;
`;

const OldFilesDisplay = ({fileType}) => {
    const localStorageKey = `saved_${fileType}`;
    const savedJobs = JSON.parse(localStorage.getItem(localStorageKey)) || [];

    const displayFileInfo = (savedJob) => {
        return(
            <FileRow file={savedJob.file} fileType={fileType} isSavedUpload={true} existingJobId={savedJob.jobId} />
        )
    };

    return(
        <DisplayContainer>
            <Header>Previous Uploads</Header>
            {savedJobs.length === 0 && <PlaceholderRow>No jobs found</PlaceholderRow>}
            {savedJobs.length > 0 && savedJobs.map(f => displayFileInfo(f))}
        </DisplayContainer>
    );
};

export default OldFilesDisplay;
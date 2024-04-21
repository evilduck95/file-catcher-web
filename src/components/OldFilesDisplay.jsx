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
    border: solid black 10px;
    border-top: solid #404040 10px;
    border-left: solid #202020 10px;
`;

const Heading = styled.div`
    width: 100%;
    color: ${props => props.theme.fileListDisplay.headerTextColor};
    font-family: "Market Deco";
    //display: flex;
    //justify-content: space-between;
    //align-items: center;
    height: 40px;
    font-size: xx-large;
    text-align: center;
    //border-bottom: black solid 1px;
    //font-style: italic;
`;

const ListContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 100%;
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
            <Heading>Previous Uploads</Heading>
            <ListContainer>
                {savedJobs.length === 0 && <PlaceholderRow>No Uploaded {fileType.replace('tv_show', 'TV Shows').replace('film', 'Films')} found</PlaceholderRow>}
                {savedJobs.length > 0 && savedJobs.map(f => displayFileInfo(f))}
            </ListContainer>
        </DisplayContainer>
    );
};

export default OldFilesDisplay;
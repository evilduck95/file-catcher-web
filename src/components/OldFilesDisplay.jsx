import React from "react";
import styled from "styled-components";

const DisplayContainer = styled.div`
    width: 400px;
    margin-top: 10px;
    display: flex;
    flex-direction: column-reverse;
    justify-content: flex-end;
    align-items: center;
    border: solid black 1px;
`;

const FileInfoRow = styled.div`
    width: 90%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;

const FileInfo = styled.div`
`;

const OldFilesDisplay = ({fileType}) => {
    const localStorageKey = `saved_${fileType}`;
    const savedFiles = JSON.parse(localStorage.getItem(localStorageKey)) || [];

    const displayFileInfo = (file) => {
        return(
            <FileInfoRow>
                <FileInfo>{file.fileName}</FileInfo>
                <FileInfo>{file.jobStatus}</FileInfo>
            </FileInfoRow>
        )
    };

    return(
        <DisplayContainer>
            {savedFiles.length > 0 && savedFiles.map(f => displayFileInfo(f))}
        </DisplayContainer>
    );
};

export default OldFilesDisplay;
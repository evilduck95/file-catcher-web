import React from "react";
import styled from "styled-components";
import {ImCross} from "react-icons/im";

const FilesListContainer = styled.div`
    width: 400px;
    min-height: 500px;
    display: flex;
    flex-direction: column-reverse;
    justify-content: flex-end;
    align-items: center;
    padding-top: 10px;
    border: solid black 1px;
`;

const FileRow = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    padding: 5px;
    text-align: center;
    width: 95%;
    border: dashed black 1px;
`;

const Instruction = styled.div`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const FileListDisplay = ({files, fileAddCallback, removeCallback}) => {
    console.log('render list');

    const fileRemoved = (index) => {
        console.log(`${index} removed`)
        removeCallback(index);
    }

    return (
        <FilesListContainer>
            {files.map((f, i) => <FileRow style={{cursor: 'pointer'}}><div>{f.name}</div><ImCross className={'clickable-icon'} onClick={() => fileRemoved(i)}/></FileRow>)}
            <FileRow style={{cursor: 'pointer'}} onClick={fileAddCallback}><Instruction>Drop files here (Coming Soon!) or click to select</Instruction></FileRow>
        </FilesListContainer>
    )
};

export default FileListDisplay;
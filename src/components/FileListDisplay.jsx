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
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    font-style: italic;
`

const FileListDisplay = ({files, removeCallback}) => {
    console.log('render list');

    const fileRemoved = (index) => {
        console.log(`${index} removed`)
        removeCallback(index);
    }

    return (
        <FilesListContainer>
            {files?.length === 0 && <FileRow><Instruction>Drop files here (Coming Soon!)</Instruction></FileRow>}
            {files.map((f, i) => <FileRow><div>{f.name}</div><ImCross className={'clickable-icon'} onClick={() => fileRemoved(i)}/></FileRow>)}
        </FilesListContainer>
    )
};

export default FileListDisplay;
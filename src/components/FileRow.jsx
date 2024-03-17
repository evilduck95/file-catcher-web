import React from "react";
import styled from "styled-components";
import {ImCross} from "react-icons/im";

const FileRowContainer = styled.div`
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

const FileRow = ({index, file, removedCallback}) => {
    return(
        <FileRowContainer>
            <div>{file.name}</div>
            <ImCross className={'clickable-icon'} onClick={() => removedCallback(index)}/>
        </FileRowContainer>
    )
};

export default FileRow;
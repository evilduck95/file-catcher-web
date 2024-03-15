import React, {useEffect, useRef, useState} from "react";
import FileListDisplay from "./FileListDisplay";
import {ImPlus} from "react-icons/im";
import styled from "styled-components";

const FileUploadContainer = styled.div`
    margin: 10px;
`;

const FileUploadList = () => {

    const [files, setFiles] = useState([]);
    const inputFile = useRef(null);

    useEffect(() => {
        console.log('Changed')
    }, [files]);

    const fileUpload = (key, file) => {
    };

    const plusClicked = () => {
        inputFile.current.click();
    }
    const fileAdded = (event) => {
        console.log('File Add')
        const attachedFile = event.target.files[0];
        const duplicateFile = files.filter(f => f.name === attachedFile.name)[0];
        if (!!duplicateFile) {
            console.log(`Duplicate file ${files.indexOf(duplicateFile)}`)
        }
        setFiles(oldFiles => [ ...oldFiles, attachedFile ]);
        console.log(files)
    };

    const fileRemoved = (index) => {
        setFiles(oldArray => oldArray.toSpliced(index, 1));
    };

    console.log('render uploader')
    return (
        <FileUploadContainer>
            <div>Add files</div>
            <FileListDisplay files={files} removeCallback={fileRemoved}/>
            <input type={'file'} id={'file-input'} ref={inputFile} onChange={fileAdded} style={{display: 'none'}}/>
            <ImPlus className={'clickable-icon'} onClick={plusClicked} color={'lightgreen'}/>
        </FileUploadContainer>
    )

};

export default FileUploadList;
import React, {useRef, useState} from "react";
import FileListDisplay from "./FileListDisplay";
import styled from "styled-components";
import {FILM} from "../util/fileTypes";
import OldFilesDisplay from "./OldFilesDisplay";

const FileUploadContainer = styled.div`
    margin: 10px;
`;

const BufferSpace = styled.div`
    height: 10px;
    position: relative;
`;

const FileUploadList = ({headerText = 'Add Files', fileType}) => {

    const [files, setFiles] = useState([]);
    const fileInputRef = useRef(null);

    const initFileChooser = () => {
        fileInputRef.current.click();
    }

    const fileDropped = (event) => {
        const {files} = event.dataTransfer;
        fileAdded(files);
    }

    const fileChosen = (event) => {
        fileAdded(event.target.files);
        // Important to sidestep the default duplicate file protection (I need to show an alert)
        event.target.value = null;
    }

    const fileAdded = (attachedFiles) => {
        if (attachedFiles.length === 0) return;
        console.log('Attached', attachedFiles)
        const attachedFile = attachedFiles[0];
        const duplicateFile = files.some(f => f.name === attachedFile.name);
        if (duplicateFile) {
            alert('Duplicate file :(');
        } else {
            setFiles(oldFiles => [...oldFiles, attachedFile]);
        }
    };

    const fileRemoved = (index) => {
        setFiles(oldArray => oldArray.toSpliced(index, 1));
    };

    return (
        <FileUploadContainer>
            <div>{headerText}</div>
            <FileListDisplay files={files} fileType={fileType} chooseFileCallback={initFileChooser} dropFileCallback={fileDropped} removeCallback={fileRemoved}/>
            {/*<BufferSpace className={'buffer'}/>*/}
            <OldFilesDisplay fileType={fileType}/>
            <input type={'file'} id={'file-input'} ref={fileInputRef} onChange={fileChosen} style={{display: 'none'}}/>
        </FileUploadContainer>
    )

};

export default FileUploadList;
import React, {useRef, useState} from "react";
import FileListDisplay from "./FileListDisplay";
import styled from "styled-components";

const FileUploadContainer = styled.div`
    margin: 10px;
`;

const FileUploadList = () => {

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
    }

    const fileAdded = (attachedFiles) => {
        if (attachedFiles.length === 0) return;
        console.log('Attached', attachedFiles)
        const attachedFile = attachedFiles[0];
        const duplicateFile = files.some(f => f.name === attachedFile.name);
        if (duplicateFile) {
            console.log(`Duplicate file ${files.indexOf(duplicateFile)}`);
            alert('Duplicate file :(');
        }
        setFiles(oldFiles => [ ...oldFiles, attachedFile ]);
        console.log(files)
    };

    const fileRemoved = (index) => {
        setFiles(oldArray => oldArray.toSpliced(index, 1));
    };

    return (
        <FileUploadContainer>
            <div>Add files</div>
            <FileListDisplay files={files} chooseFileCallback={initFileChooser} dropFileCallback={fileDropped} removeCallback={fileRemoved}/>
            <input type={'file'} id={'file-input'} ref={fileInputRef} onChange={fileChosen} style={{display: 'none'}}/>
        </FileUploadContainer>
    )

};

export default FileUploadList;
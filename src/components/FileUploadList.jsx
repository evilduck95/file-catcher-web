import React, {useEffect, useRef, useState} from "react";
import FileListDisplay from "./FileListDisplay";
import {Button} from "react-bootstrap";
import {ImPlus} from "react-icons/im";
import collapse from "bootstrap/js/src/collapse";

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
        <div>
            <div>Add files</div>
            <FileListDisplay files={files} removeCallback={fileRemoved}/>
            <input type={'file'} id={'file-input'} ref={inputFile} onChange={fileAdded} style={{display: 'none'}}/>
            <ImPlus className={'clickable-icon'} onClick={plusClicked} color={'lightgreen'}/>
        </div>
    )

};

export default FileUploadList;
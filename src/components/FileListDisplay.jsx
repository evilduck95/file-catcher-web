import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import {ImCross} from "react-icons/im";

const FilesListContainer = styled.div`
    // Parent styles to allow overlay to respect boundaries.
    float: left;
    position: relative;
    
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
`;

const DragOverOverlay = styled.div`
    // Respect your parent's boundaries
    position: absolute;
    top: 0;
    left: 0;

    // Max size
    width: 100%;
    height: 100%;

    background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0naHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmcnIHdpZHRoPScxMCcgaGVpZ2h0PScxMCc+CiAgPHJlY3Qgd2lkdGg9JzEwJyBoZWlnaHQ9JzEwJyBmaWxsPSdibGFjaycvPgogIDxwYXRoIGQ9J00tMSwxIGwyLC0yCiAgICAgICAgICAgTTAsMTAgbDEwLC0xMAogICAgICAgICAgIE05LDExIGwyLC0yJyBzdHJva2U9J3doaXRlJyBzdHJva2Utd2lkdGg9JzEnLz4KPC9zdmc+") repeat;
    opacity: 25%;
`;

const FileListDisplay = ({files, fileAddCallback, removeCallback}) => {

    const listContainerRef = useRef(null);
    const dragOverlayRef = useRef(null);

    const [draggingFile, setDraggingFile] = useState(false);

    useEffect(() => {
        const current = listContainerRef.current;
        current.addEventListener('dragover', handleDragOver);
        current.addEventListener('drop', handleDrop);
        current.addEventListener('dragenter', handleDragEnter);
        current.addEventListener('dragleave', handleDragLeave);
        return () => {
            current.removeEventListener('dragover', handleDragOver);
            current.removeEventListener('drop', handleDrop);
            current.removeEventListener('dragenter', handleDragEnter);
            current.removeEventListener('dragleave', handleDragLeave);
        }
    }, []);

    const handleDragEnter = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.target !== dragOverlayRef.current) {
            console.log('enter');
            setDraggingFile(true);
        }
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.target === dragOverlayRef.current) {
            console.log('leave');
            setDraggingFile(false);
        }
    }

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
        console.log('drag over');
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDraggingFile(false);
        console.log('drop');
    };

    const fileRemoved = (index) => {
        console.log(`${index} removed`)
        removeCallback(index);
    }

    return (
        <FilesListContainer ref={listContainerRef}>
            {draggingFile && <DragOverOverlay ref={dragOverlayRef}>
            </DragOverOverlay>}
            {files.map((f, i) => <FileRow style={{cursor: 'pointer'}}>
                <div>{f.name}</div>
                <ImCross className={'clickable-icon'} onClick={() => fileRemoved(i)}/></FileRow>)}
            <FileRow style={{cursor: 'pointer'}} onClick={fileAddCallback}><Instruction>Drop files here (Coming
                Soon!) or click to select</Instruction></FileRow>
        </FilesListContainer>
    )
};

export default FileListDisplay;
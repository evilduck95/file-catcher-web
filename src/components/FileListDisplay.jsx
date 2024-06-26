import React, {useEffect, useRef, useState} from "react";
import styled from "styled-components";
import FileRow from "./FileRow";
import {Button} from "react-bootstrap";

const FilesListContainer = styled.div`
    // Parent styles to allow overlay to respect boundaries.
    //float: left;
    background-color: ${props => props.theme.fileListDisplay.backgroundColor};
    position: relative;

    //width: 400px;
    width: 100%;
    min-height: 500px;
    display: flex;
    flex-direction: column-reverse;
    justify-content: flex-end;
    align-items: center;
    padding-top: 10px;
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

const FileListDisplay = ({files, fileType, chooseFileCallback, dropFileCallback, removeCallback}) => {

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
            setDraggingFile(true);
        }
    };

    const handleDragLeave = (event) => {
        event.preventDefault();
        event.stopPropagation();
        if (event.target === dragOverlayRef.current) {
            setDraggingFile(false);
        }
    }

    const handleDragOver = (event) => {
        event.preventDefault();
        event.stopPropagation();
    };

    const handleDrop = (event) => {
        event.preventDefault();
        event.stopPropagation();
        setDraggingFile(false);
        dropFileCallback(event);
    };

    const fileRemoved = (index) => {
        console.log(`${index} removed`)
        removeCallback(index);
    }

    return (
        <>
            <FilesListContainer ref={listContainerRef}>
                {draggingFile && <DragOverOverlay ref={dragOverlayRef}/>}
                {files.map((f, i) => (
                    <FileRow
                        key={i}
                        fileType={fileType}
                        index={i}
                        file={f}
                        removedCallback={fileRemoved}
                    />
                ))}
                <Heading>{fileType === 'film' ? 'FILMS' : 'TV SHOWS'}</Heading>
            </FilesListContainer>
        </>
    )
};

export default FileListDisplay;
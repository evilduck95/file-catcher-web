import axios from 'axios';
import styled from 'styled-components';
import {useEffect, useState} from "react";

const Heading = styled.div`
    font-size: large;
`;


const uploadFilmUrl = 'http://localhost:8200/film/upload';
const processFilmUrl = 'http://localhost:8200/film/process';
const uploadTvUrl = 'http://localhost:8200/tv-show/upload';
const processTvUrl = 'http://localhost:8200/tv-show/process';

const FileUploader = ({headingText, apiUrl}) => {

    const [jobIds, setJobIds] = useState([]);

    useEffect(() => {
        console.log('State', jobIds);
    }, [jobIds]);

    const onFileChange = (event) => {
        let file = event.target.files[0];
        const formData = new FormData();
        formData.append('file', file, file.name);
        console.log('Form Data', formData, file);
        axios.post(`${apiUrl}/upload`, formData)
            .then((success) => {
                    console.log('hooray', success);
                    const { jobId: responseJobId } = success.data;
                    setJobIds(currentIds => {
                        currentIds.push(responseJobId);
                        return currentIds;
                    });
                },
                (fail) => console.log('fail', fail)
            );
    };

    const onFileUpload = () => {
        console.log('submit', jobIds);
        axios.patch(`${apiUrl}/process`, { jobIds })
            .then(console.log, console.log);
    }

    return (
        <div>
            <Heading>{headingText}</Heading>
            <input type={'file'} onChange={onFileChange}/>
            <button onClick={onFileUpload}>Upload</button>
        </div>
    );
};

export default FileUploader;
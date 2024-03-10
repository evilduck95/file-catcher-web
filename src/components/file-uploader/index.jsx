import axios from 'axios';
import styled from 'styled-components';
import {useEffect, useState} from "react";

const Heading = styled.div`
    font-size: large;
`;


const uploadFilmUrl = 'http://localhost:8200/film/upload';
const processFilmUrl = 'http://localhost:8200/film/process';

const FileUploader = ({headingText}) => {

    const [jobIds, setJobIds] = useState([]);

    useEffect(() => {
        console.log('State', jobIds);
    }, [jobIds]);

    const onFileChange = (event) => {
        let file = event.target.files[0];
        const formData = new FormData();

        formData.append('file', file, file.name);
        console.log('Form Data', formData, file);
        axios.post(uploadFilmUrl, formData)
            .then(
                (succ) => {
                    console.log('hooray', succ);
                    const { jobId: responseJobId } = succ.data;
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
        axios.patch(processFilmUrl, { jobIds })
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
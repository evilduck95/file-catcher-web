import react, {useState} from 'react';
import axios from 'axios';
import styled from 'styled-components';

const Heading = styled.div`
    font-size: large;
`;


const FileUploader = ({headingText}) => {

    const [file, setFile] = useState();

    const onFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const onFileUpload = () => {
        const formData = new FormData();

        formData.append('file', file, file.name);
        console.log('Form Data', formData, file);
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
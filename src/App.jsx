import './App.css';
import FileUploader from "./components/file-uploader";
import styled from "styled-components";


const UploadRow = styled.div`
    width: 80%;
    margin-left: 10%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`

function App() {
    return (
        <div className="App">
            <UploadRow>
                <FileUploader headingText={'Film'}/>
                <FileUploader headingText={'TV Show'}/>
            </UploadRow>
        </div>
    );
}

export default App;

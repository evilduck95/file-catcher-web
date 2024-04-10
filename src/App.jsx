import './App.css';
import FileUploadList from "./components/FileUploadList";
import {FILM, TV_SHOW} from "./util/fileTypes";
import styled from "styled-components";

const UploadersContainer = styled.div`
    display: flex;
    flex-direction: row;
`;


function App() {
    return (
        <div className="App">
            <UploadersContainer>
                <FileUploadList headerText={'Films'} fileType={FILM}/>
                <FileUploadList headerText={'TV Shows'} fileType={TV_SHOW}/>
            </UploadersContainer>
        </div>
    );
}

export default App;

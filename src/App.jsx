import './App.css';
import FileUploadList from "./components/FileUploadList";
import {FILM, TV_SHOW} from "./util/fileTypes";
import styled, {ThemeProvider} from "styled-components";
import theme from "./util/theme";

const AppContainer = styled.div`
    background-color: ${props => props.theme.mainScreen.backgroundColor};
    height: 100vh;
`;

const UploadersContainer = styled.div`
    width: 80%;
    margin: auto;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
`;


function App() {
    return (
        <ThemeProvider theme={theme}>
            <AppContainer className="App">
                <UploadersContainer>
                    <FileUploadList headerText={'Films'} fileType={FILM}/>
                    <FileUploadList headerText={'TV Shows'} fileType={TV_SHOW}/>
                </UploadersContainer>
            </AppContainer>
        </ThemeProvider>
    );
}

export default App;

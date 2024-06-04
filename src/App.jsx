import './App.css';
import FileUploadList from "./components/FileUploadList";
import {FILM, TV_SHOW} from "./util/fileTypes";
import styled, {ThemeProvider} from "styled-components";
import theme from "./util/theme";
import theatreBackground from './assets/images/theatre_curtain_vector2.png';

const AppContainer = styled.div`
    background-color: ${props => props.theme.mainScreen.backgroundColor};
    background-image: url(${theatreBackground});
    background-size: cover;
    height: 100vh;
`;

const UploadersContainer = styled.div`
    width: 80%;
    margin-left: 50px;
    padding-top: 100px;
    display: flex;
    //flex-direction: row;
    //justify-content: space-between;
    
    @media (max-width: 1000px) {
        flex-direction: column;
    }
    
    @media (min-width: 1000px) {
        flex-direction: row;
    }
`;


function App() {
    return (
        <ThemeProvider theme={theme}>
            <AppContainer className="App">
                <UploadersContainer>
                    <FileUploadList fileType={FILM}/>
                    <FileUploadList fileType={TV_SHOW}/>
                </UploadersContainer>
            </AppContainer>
        </ThemeProvider>
    );
}

export default App;

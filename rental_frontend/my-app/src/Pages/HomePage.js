import BaseSection from "../Components/Base";
import { Container } from "reactstrap";
import backgroundImage from './home-background.jpg';

const Home = () => {

    return (
        <BaseSection>
            <Container
                style={{
                    backgroundImage: `url(${backgroundImage})`,
                    backgroundSize: '100% 100%', // Stretch the background image to cover the whole Container
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    minHeight: '87vh', // Stretch the Container to cover the whole page vertically
                    maxWidth: '100vw', // Stretch the Container to cover the whole page horizontally
                    margin: 0, // Remove default margin
                    padding: 0, // Remove default padding
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <h1>Welcome</h1>
            </Container>
        </BaseSection>
    );
}

export default Home;
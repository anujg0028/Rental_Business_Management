
import BaseSection from "../Components/Base";
import {UserContext} from "../Context/userContext";

const About = () => {
    return (
        // <BaseSection>
        //     <h1>This is my component</h1>
        //     <p>we are building blog app</p>
        // </BaseSection>
        <UserContext.Consumer>
            {
                (user) => (
                    <BaseSection>
                        <h1>This is my component</h1>
                        <p>we are building blog app</p>
                    </BaseSection>
                )
            }
        </UserContext.Consumer>
    );
}

export default About;
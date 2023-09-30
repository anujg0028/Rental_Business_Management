import CustomNavBar from "./NavBar";

//common component which we used in every pages
const BaseSection = ({ title = "welcome to our website", children }) => {

    return (
        <div className="container-fluid p-0 m-0">
            <CustomNavBar />
            {children}
        </div>
    )
};

export default BaseSection;
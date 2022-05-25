import "./notification.css";

const Notification = ({ message, isError }) => {
    if (message === null) {
        return null;
    }
    return (
        <div className={isError ? "errorMessage" : "successMessage"}>
            {message}
        </div>
    );
};

export default Notification;

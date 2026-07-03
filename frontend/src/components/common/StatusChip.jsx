const StatusChip = ({ status }) => {

    const className = status
        .toLowerCase()
        .replace(/\s+/g,"-");

    return(

        <span className={`status-chip ${className}`}>

            {status}

        </span>

    );

};

export default StatusChip;
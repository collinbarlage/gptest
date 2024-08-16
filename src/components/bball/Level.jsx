import Ball from "./Components/Ball";
import Table from "./Components/Table";

const Level = ({ ballRef }) => {
    return (
        <>
            <Ball ref={ballRef} position={{ x: 0, y: 0, z: 4.2 }} />
            <Table />
        </>
    );
};

export default Level;

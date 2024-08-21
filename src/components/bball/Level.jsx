import Ball from "./Components/Ball";
import Snack from "./Components/Snack";
import Table from "./Components/Table";

const Level = ({ ballRef }) => {
    return (
        <>
            <Snack ref={ballRef} position={{ x: 0, y: -0.3, z: 4.2 }} />
            <Table />
        </>
    );
};

export default Level;

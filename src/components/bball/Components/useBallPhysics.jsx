import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

const useBallPhysics = (initialPosition) => {
    const ballRef = useRef(null);
    const [gravityEnabled, setGravityEnabled] = useState(false);

    const shoot = (force) => {
        if (ballRef.current) {
            const forceMultiplier = 2.4
            const forceMagnitude = force * forceMultiplier
            ballRef.current.setTranslation({x: initialPosition.x, y: initialPosition.y, z: initialPosition.z}, true)
            ballRef.current.setLinvel({x: 0, y: 0, z: 0}, true)
            ballRef.current.setAngvel({x: 0, y: 0, z: 0}, true)

            const radians = (45 * Math.PI) / 180; // Convert angle to radians
            const forceY = Math.cos(radians) * forceMagnitude
            const forceZ = Math.sin(radians) * forceMagnitude * -1
            const forceX = force > .8
                ? Math.sin(radians) *forceMagnitude * .2 * (Math.random() - 0.5)
                : 0

            ballRef.current.applyImpulse({ x: forceX, y: forceY, z: forceZ }, true);
            ballRef.current.applyTorqueImpulse({
                x: forceMagnitude *.05,
                y: (Math.random() - 0.5) * .05,
                z: 0
            }, true)
        }
    };

    useFrame(() => {
        if (gravityEnabled && ballRef.current) {
            ballRef.current.gravityScale = 1;
        }
    });

    return {
        ballRef,
        shoot,
    };
};

export default useBallPhysics;

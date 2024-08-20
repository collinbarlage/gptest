import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from 'three';

const resetAngle = new THREE.Quaternion();
resetAngle.setFromEuler(new THREE.Euler(0, Math.PI, 0));

const useBallPhysics = (initialPosition) => {
    const ballRef = useRef(null);
    const [gravityEnabled, setGravityEnabled] = useState(false);

    const shoot = (force) => {
        if (ballRef.current) {
            ballRef.current.setGravityScale(1, true)

            const forceMultiplier = 2.4
            const forceMagnitude = force * forceMultiplier

            const radians = (45 * Math.PI) / 180; // radians
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
    }

    const reset = () => {
        if (ballRef.current) {
            ballRef.current.setTranslation({x: initialPosition.x, y: initialPosition.y, z: initialPosition.z}, true)
            // ballRef.current.setRotation(resetAngle, true);
            ballRef.current.setLinvel({x: 0, y: 0, z: 0}, true)
            ballRef.current.setAngvel({x: 0, y: 1, z: 0}, true)
            ballRef.current.setGravityScale(0, true)
        }
    }

    useFrame(() => {
        const ballPosition = ballRef.current?.translation()

        if(ballPosition && (ballPosition.y < - 5 || ballPosition.y > 5)) {
            reset()
        }
    })

    return {
        ballRef,
        shoot,
        reset
    };
};

export default useBallPhysics;

import React, { useRef } from "react";
import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import { useControls } from 'leva'
import { useFrame } from "@react-three/fiber";

const Ball = ({ position }) => {
    const ball = useRef(null)

    const { ballRestitution, ballFriction, forceMagnitude, forceAngle } = useControls('ball', {
        ballRestitution: { label: 'Restitution', value: 1, min: 0, max: 10 },
        ballFriction: { label: 'Friction', value: 0.2, min: 0, max: 10 },
        forceMagnitude: { label: 'Force Magnitude', value: 1.77, min: 0, max: 2.5 },
        forceAngle: { label: 'Force Angle (degrees)', value: 45, min: 0, max: 360 },
    }, { collapsed: true })

    const reset = () => {
        if(ball.current) {
            ball.current.setTranslation({x: position.x, y: position.y, z: position.z}, true)
            ball.current.setLinvel({x: 0, y: 0, z: 0}, true)
            ball.current.setAngvel({x: 0, y: 0, z: 0}, true)

            const radians = (forceAngle * Math.PI) / 180; // Convert angle to radians
            const forceY = Math.cos(radians) * forceMagnitude
            const forceZ = Math.sin(radians) * forceMagnitude * -1

            ball.current.applyImpulse({ x: 0, y: forceY, z: forceZ }, true);
            ball.current.applyTorqueImpulse({
                x: forceMagnitude *.05,
                y: (Math.random() - 0.5) * .1,
                z: 0
            }, true)
        }
    }

    const applyForceAtAngle = () => {
        if (ball.current) {
            const radians = (forceAngle * Math.PI) / 180; // Convert angle to radians
            const forceX = Math.cos(radians) * forceMagnitude;
            const forceZ = Math.sin(radians) * forceMagnitude;

            ball.current.applyImpulse({ x: forceX, y: 0, z: forceZ }, true);
        }
    };

    useFrame(() => {
        const ballPosition = ball.current?.translation()

        if(ballPosition && (ballPosition.y < - 5 || ballPosition.y > 5)) {
            reset()
        }
    })

    const { nodes, materials } = useGLTF("/models/basketball.glb");
    return (
        <group position={[position.x, position.y, position.z]} scale={0.7} dispose={null}>
            <RigidBody ref={ball} colliders="ball" restitution={ballRestitution} friction={ballFriction} gravityScale={1}>
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Sphere.geometry}
                    material={materials["Material.001"]}
                    />
            </RigidBody>
        </group>
    );
}

useGLTF.preload("/models/basketball.glb");

export default Ball

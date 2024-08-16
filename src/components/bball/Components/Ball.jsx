import React, { useImperativeHandle, forwardRef } from "react";
import { RigidBody } from "@react-three/rapier";
import useBallPhysics from "./useBallPhysics";
import { useGLTF } from "@react-three/drei";

const Ball = forwardRef(({ position }, ref) => {
    const { ballRef, shoot } = useBallPhysics(position);

    useImperativeHandle(ref, () => ({
        shoot,
    }));

    const { nodes, materials } = useGLTF("/models/basketball.glb");

    return (
        <group position={[position.x, position.y, position.z]} scale={0.7} dispose={null}>
            <RigidBody ref={ballRef} colliders="ball" restitution={1} friction={0.2}>
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.Sphere.geometry}
                    material={materials["Material.001"]}
                />
            </RigidBody>
        </group>
    );
});

useGLTF.preload("/models/basketball.glb");

export default Ball;

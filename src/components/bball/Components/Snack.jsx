import React, { useImperativeHandle, forwardRef } from "react";
import { RigidBody } from "@react-three/rapier";
import useBallPhysics from "./useBallPhysics";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";

const Snack = forwardRef(({ position }, ref) => {
    const { ballRef, shoot, reset } = useBallPhysics(position);

    useImperativeHandle(ref, () => ({
        shoot,
        reset
    }));

    // Load the texture
    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load("uncrustable.jpg");
    console.log('~~~> texture', texture)

    return (
        <group position={[position.x, position.y, position.z]} scale={0.7}>
            <RigidBody ref={ballRef} colliders="cuboid" restitution={.1} friction={0.2} mass={300}>
                <mesh castShadow receiveShadow>
                    <boxGeometry args={[1.02, .66, .3]} />
                    <meshBasicMaterial map={texture} />
                </mesh>
            </RigidBody>
        </group>
    );
});

export default Snack;

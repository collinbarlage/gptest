import {useGLTF} from "@react-three/drei";
import {MeshTransmissionMaterial} from "@react-three/drei"
import {CuboidCollider, RigidBody, vec3} from '@react-three/rapier'
import {useEffect, useRef, useState} from "react";
import useGame from '../stores/useGame'
import {useControls} from "leva";

export default function Table(props) {
    const {nodes, materials} = useGLTF("/models/table5.gltf");
    const controlA = useRef(null)
    const controlB = useRef(null)
    const thrusterA = useRef(null)
    const thrusterB = useRef(null)

    const [isScored, setIsScored] = useState(false)

    const {tableRestitution, tableFriction, glassRestitution, glassFriction} = useControls('table', {
        tableRestitution: {label: 'Table Restitution', value: 0.6, min: 0, max: 1, step: 0.1},
        tableFriction: {label: 'Table Friction', value: 0, min: 0, max: 10},
        glassRestitution: {label: 'Glass Restitution', value: 0.2, min: 0, max: 1, step: 0.1},
        glassFriction: {label: 'Glass Friction', value: 0, min: 0, max: 10},
    }, {collapsed: true})

    const increaseScore = useGame((state) => state.increment)

    const goal = () => {
        if(!isScored) {
            setIsScored(true)
            increaseScore()
            useGame.setState({ isScored: true })
        }
    }

    console.log('~~~> nodes', nodes)

    return (
        <group {...props} dispose={null} position={[0, 2, 0]} rotation={[0, -Math.PI / 2, 0]}>
            <RigidBody type="fixed" colliders="trimesh" restitution={tableRestitution} friction={tableFriction}>
                <CuboidCollider
                    args={[0, 2, 1.5]}
                    position={[0,0,0]}
                    sensor
                    onIntersectionExit={() => {
                        setIsScored(false)
                    }}
                />
            </RigidBody>

            <RigidBody
                ref={thrusterB}
                type="kinematicPosition"
                colliders="hull"
                lockRotations={true}
                enabledTranslations={[false, true, false]}
            >
            </RigidBody>
            <RigidBody type="fixed" colliders="trimesh">
                <mesh
                    castShadow
                    receiveShadow
                    geometry={nodes.board.geometry}
                    material={materials.Wood}
                    position={[-0.55,1,0]}
                    scale={[2.5,1.5,2]}
                    rotation={[Math.PI / 2, 0, -Math.PI / 2]}
                />
                <mesh
                    castShadow
                    receiveShadow
                    position={[0,0,0]}
                    geometry={nodes.Ring.geometry}
                    material={materials.Red}
                />
                <CuboidCollider
                    args={[0.35, 0, 0.35]}
                    position={[-0.2, -0.5, 0]}
                    sensor
                    onIntersectionExit={goal}
                />
            </RigidBody>
        </group>
    );
}

useGLTF.preload("/models/table.gltf");

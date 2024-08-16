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

    const clickUp = (controlRef, isControlAPushed) => {
        if (controlRef.current) {
            useGame.setState({ [isControlAPushed ? 'isControlAPushed' : 'isControlBPushed']: false })
            controlRef.current.position.y = 0.128
        }
    }

    const clickDown = (controlRef, isControlAPushed) => {
        if (controlRef.current) {
            useGame.setState({ [isControlAPushed ? 'isControlAPushed' : 'isControlBPushed']: true })
            controlRef.current.position.y = 0.128 - 0.1
        }
    }

    useEffect(() => {
        const upY = 0.5

        const unsuscribeA = useGame.subscribe(
            (state) => state.isControlAPushed,
            (isControlAPushed) => {
                if (thrusterA.current) {
                    const position = vec3(thrusterA.current.translation())

                    if (isControlAPushed) {
                        thrusterA.current.setNextKinematicTranslation({
                            x: position.x,
                            y: position.y + upY,
                            z: position.z
                        })
                    } else {
                        thrusterA.current.setNextKinematicTranslation({
                            x: position.x,
                            y: position.y - upY,
                            z: position.z
                        })
                    }
                }
            }
        )

        const unsuscribeB = useGame.subscribe(
            (state) => state.isControlBPushed,
            (isControlBPushed) => {
                if (thrusterB.current) {
                    const position = vec3(thrusterB.current.translation())
                    if (isControlBPushed) {
                        thrusterB.current.setNextKinematicTranslation({
                            x: position.x,
                            y: position.y + upY,
                            z: position.z
                        })
                    } else {
                        thrusterB.current.setNextKinematicTranslation({
                            x: position.x,
                            y: position.y - upY,
                            z: position.z
                        })
                    }
                }
            }
        )

        const handleKeyDown = (event) => {
            if (event.key === 'a') {
                clickDown(controlA, true)
            } else if (event.key === 'd') {
                clickDown(controlB, false)
            }
        }

        const handleKeyUp = (event) => {
            if (event.key === 'a') {
                clickUp(controlA, true)
            } else if (event.key === 'd') {
                clickUp(controlB, false)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        window.addEventListener('keyup', handleKeyUp)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            window.removeEventListener('keyup', handleKeyUp)
            unsuscribeA()
            unsuscribeB()
        }
    }, [])

    console.log('~~~> nodes', nodes)

    return (
        <group {...props} dispose={null} rotation={[0, -Math.PI / 2, 0]}>
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
                <mesh //backboard
                    castShadow
                    receiveShadow
                    geometry={nodes.board.geometry}
                    material={materials.Wood}
                    position={[-0.55,1,0]}
                    scale={[2.5,1.5,2]}
                    rotation={[Math.PI / 2, 0, -Math.PI / 2]}
                />
                <CuboidCollider
                    args={[0.35, 0, 0.35]}
                    position={[0,0,0]}
                    sensor
                    onIntersectionExit={goal}
                >
                    <mesh
                        castShadow
                        receiveShadow
                        position={[0,0,0]}
                        geometry={nodes.Ring.geometry}
                        material={materials.Red}
                    />
                </CuboidCollider>
            </RigidBody>
        </group>
    );
}

useGLTF.preload("/models/table.gltf");

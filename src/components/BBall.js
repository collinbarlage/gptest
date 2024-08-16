import { Suspense, useEffect, useRef, useState } from "react";
import { useFrame, Canvas } from "@react-three/fiber";
import ReactDOM from 'react-dom/client';
import { PresentationControls, Center, Environment } from "@react-three/drei";
import { Physics } from '@react-three/rapier';
import { easing } from 'maath';
import { Perf } from "r3f-perf";
import { Leva, useControls } from 'leva';
import Lights from "./bball/Lights";
import Level from "./bball/Level";
import Confetti from "./bball/Components/Confetti.jsx";
import ShotMeter from "./bball/Components/ShotMeter.jsx";
import useGame from "./bball/stores/useGame.js";
import Effects from "./bball/Effects";
import Interface from './bball/Interface';
import './bball/index.css';

const BBall = () => {
    const { perfVisible, debugPhysics } = useControls('debug', {
        perfVisible: { label: 'Performance', value: false },
        debugPhysics: { label: 'Physics', value: false },
    });
    const [isExploding, setIsExploding] = useState(false);
    const [prevScore, setPrevScore] = useState(0);
    const ballRef = useRef();

    useEffect(() => {
        const unsuscribeIsScored = useGame.subscribe(
            (state) => state.score,
            (score) => {
                if(score !== prevScore) {
                    setIsExploding(true);
                    setTimeout(() => {
                        setIsExploding(false);
                    }, 2000);
                    setPrevScore(score);
                }
            }
        );

        return () => {
            unsuscribeIsScored();
        };
    }, [prevScore]);

    return ReactDOM.createRoot(document.getElementById('root')).render(
    <>
    <Interface />
            <div style={{ position: 'absolute', bottom: '20px', left: '50%', zIndex: 100 }}>
                <ShotMeter ballRef={ballRef} />
            </div>
      <Canvas
        dpr={[1, 2]}
        camera={{ position: [-15, 15, 15], fov: 55 }}
      >
        <color attach="background" args={["#08224B"]} />
        { perfVisible && <Perf position="top-left" /> }

        <Environment preset="city" />
        <Lights />

        <PresentationControls
            global
            cursor={false}
            // rotation={[0, -Math.PI / 8, 0]}
            azimuth={[-Math.PI / 2, Math.PI / 2]}
        >
            <group>
                <Suspense fallback={<Fallback />}>
                    <Confetti isExploding={isExploding} rate={2} areaWidth={5} areaHeight={3} fallingHeight={6} />
                    <Physics debug={debugPhysics}>
                        <Center>
                            <Level ballRef={ballRef} /> {/* Pass ref to Ball */}
                        </Center>
                    </Physics>
                    <Zoom />
                </Suspense>
            </group>
        </PresentationControls>
    </Canvas>
    </>
    )

    return (
        <>
            <Interface />

            <Canvas
                dpr={[1, 2]}
                camera={{ position: [-15, 15, 15], fov: 55 }}
            >
                <color attach="background" args={["#08224B"]} />
                { perfVisible && <Perf position="top-left" /> }

                <Environment preset="city" />
                <Lights />

                <PresentationControls
                    global
                    cursor={false}
                    azimuth={[-Math.PI / 2, Math.PI / 2]}
                >
                    <group>
                        <Suspense fallback={<Fallback />}>
                            <Physics debug={debugPhysics}>
                                <Center>
                                    <Level ballRef={ballRef} /> {/* Pass ref to Ball */}
                                </Center>
                            </Physics>
                            <Confetti isExploding={isExploding} rate={2} areaWidth={5} areaHeight={3} fallingHeight={6} />
                        </Suspense>
                    </group>
                </PresentationControls>
            </Canvas>
        </>
    );
};

const Zoom = () => {
    useFrame((state, delta) => {
    easing.damp3(state.camera.position, [0, 1, 8], 1, delta)
        state.camera.lookAt(0, 0, 0)
    })

    return <></>
}

const Fallback = () => {
    const ref = useRef(null);
    useFrame((state) => (ref.current.position.x = Math.sin(state.clock.elapsedTime * 2)));

    return (
        <mesh ref={ref}>
            <sphereGeometry args={[0.15, 64, 64]} />
            <meshBasicMaterial color="#556" />
        </mesh>
    );
};

export default BBall;

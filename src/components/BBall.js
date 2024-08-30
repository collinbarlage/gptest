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
import './bball/assets/ABCGintoNormal-Regular.ttf'
import utils from '../utils'

const BBall = () => {
	const { perfVisible, debugPhysics } = useControls('debug', {
		perfVisible: { label: 'Performance', value: false },
		debugPhysics: { label: 'Physics', value: false },
	});
	const [prevScore, setPrevScore] = useState(0)
	const [cart, setCart] = useState({})
	const ballRef = useRef()

	const urlParams = new URLSearchParams(window.location.search)
	const userBlob = urlParams.get('userBlob')


	useEffect(() => {
	  if (userBlob) {
	  	const userInfo = JSON.parse(atob(userBlob))
		utils.getCart(userInfo.userToken).then(response => {
		  setCart(response?.data?.view?.cart)
		})
	  }
  	}, [userBlob])

	useEffect(() => {
		const unsuscribeIsScored = useGame.subscribe(
			(state) => state.score,
			(score) => {
				if(score !== prevScore) {
					// addToCart()
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
		<div style={{ position: 'absolute', bottom: '50px', left: '50%', zIndex: 100 }}>
			<ShotMeter ballRef={ballRef} />
		</div>
	  <Canvas
		dpr={[1, 2]}
		camera={{ position: [-15, 15, 15], fov: 55 }}
	  >
		{/*<color attach="background" args={["#08224B"]} />*/}
		{ perfVisible && <Perf position="top-left" /> }

		<Environment preset="city" />
		<Lights />

			<group>
				<Suspense fallback={<Fallback />}>
					<Physics debug={debugPhysics}>
						<Center>
							<Level ballRef={ballRef} /> {/* Pass ref to Ball */}
						</Center>
					</Physics>
					<Zoom />
				</Suspense>
			</group>
	</Canvas>
	</>
	)

	const addToCart = () => {
		if (userBlob) {
			const userInfo = JSON.parse(atob(userBlob))
			utils.addToCart(cart, userInfo.userToken, { "productId": 80372, "quantity": 1 }).then(response => {
				console.log('~~~> atc')
			})
		}
	}
}

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
}

export default BBall;

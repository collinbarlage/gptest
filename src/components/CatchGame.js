import React, { useEffect, useRef } from 'react'
import Matter from 'matter-js'

const CatchGame = () => {
    const canvasRef = useRef(null)
    const engineRef = useRef(null)
    const runnerRef = useRef(null)
    const renderRef = useRef(null)

    useEffect(() => {
        // create engine
        const engine = Matter.Engine.create()
        const world = engine.world
        engineRef.current = engine
        engine.gravity.scale = 0.0005

        const catcherPosition = 550
        const snacks = ['gushers', 'icecream', 'oreo', 'uncrustable']

        // create renderer
        const render = Matter.Render.create({
            canvas: canvasRef.current,
            engine: engine,
            options: {
                width: 800,
                height: 600,
                showVelocity: true,
                showAngleIndicator: false,
                wireframes: false

            }
        })
        renderRef.current = render

        Matter.Render.run(render)

        // create runner
        const runner = Matter.Runner.create()
        runnerRef.current = runner
        Matter.Runner.run(runner, engine)


        // add bodies
        const catcher = Matter.Bodies.rectangle(400, catcherPosition, 200, 250, {
          isStatic: false,
          chamfer: 10,
          render: {
            sprite: {
              texture: './bag.png',
              xScale: 0.5,
              yScale: 0.5,
              yOffset: -.1
            }
          }
        })

        const createSnack = () => {

          var img = snacks[Math.floor(Math.random()*snacks.length)]
          const snack = Matter.Bodies.rectangle(Math.random() * 800, 0, 50, 50, {
            isStatic: false,
            render: {
              sprite: {
                texture: `./${img}.webp`,
                  xScale: 0.2,
                  yScale: 0.2
                }
              }
          })
          Matter.World.add(world, snack)
        }

        const interval = setInterval(createSnack, 2000)
        Matter.Composite.add(world, [
            catcher
        ])

        Matter.Events.on(engine, 'beforeUpdate', function() {


          Matter.Body.setAngularVelocity(catcher, 0)
          Matter.Body.setVelocity(catcher, {
            x: 0,
            y: 0
          })

          Matter.Body.setPosition( catcher, {
            x: catcher.position.x,
            y: catcherPosition
          })

        })

        // add mouse control
        const mouse = Matter.Mouse.create(render.canvas)
        const mouseConstraint = Matter.MouseConstraint.create(engine, {
            mouse: mouse,
            constraint: {
                stiffness: 0.2,
                render: {
                    visible: false
                }
            }
        })

        Matter.Composite.add(world, mouseConstraint)

        // keep the mouse in sync with rendering
        render.mouse = mouse

        // fit the render viewport to the scene
        Matter.Render.lookAt(render, {
            min: { x: 0, y: 0 },
            max: { x: 800, y: 600 }
        })

        // cleanup on unmount
        return () => {
            Matter.Render.stop(render)
            Matter.Runner.stop(runner)
        }
    }, [])

    return <canvas ref={canvasRef} />
}

export default CatchGame

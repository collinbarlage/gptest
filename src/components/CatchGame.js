import React, { useEffect, useRef } from 'react'
import Matter from 'matter-js'

const CatchGame = () => {
    const CANVAS = useRef(null)
    const ENGINE = useRef(null)
    const RUNNER = useRef(null)
    const RENDER = useRef(null)
    const CONSTRAINTS = useRef(new Map())

    const SNACK_ROTATION = 0.1

    useEffect(() => {
        // create engine
        const engine = Matter.Engine.create()
        const world = engine.world
        ENGINE.current = engine
        engine.gravity.scale = 0.0005

        const catcherPosition = 700
        const snacks = ['gushers', 'icecream', 'oreo', 'uncrustable']

        // create renderer
        const render = Matter.Render.create({
            canvas: CANVAS.current,
            engine: engine,
            options: {
                width: 375,
                height: 600,
                showVelocity: true,
                showAngleIndicator: false,
                wireframes: false

            }
        })
        RENDER.current = render

        Matter.Render.run(render)

        // create runner
        const runner = Matter.Runner.create()
        RUNNER.current = runner
        Matter.Runner.run(runner, engine)


        // add bodies
        const catcherL = Matter.Bodies.rectangle(150, catcherPosition, 200, 50, {
          isStatic: true,
          chamfer: 10,
          render: {
            sprite: {
              texture: './bag.png',
              xScale: 0.5,
              yScale: 0.5,
              yOffset: -.45
            }
          }
        })

        const catcherR = Matter.Bodies.rectangle(650, catcherPosition, 200, 50, {
          isStatic: true,
          chamfer: 10,
          render: {
            sprite: {
              texture: './bag.png',
              xScale: 0.5,
              yScale: 0.5,
              yOffset: -.45
            }
          }
        })


        const createSnack = () => {

          var img = snacks[Math.floor(Math.random()*snacks.length)]
          const snack = Matter.Bodies.rectangle(Math.random() * 375, -300, 75, 75, {
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
          Matter.Body.setAngularVelocity(snack, (Math.random() * SNACK_ROTATION) - (SNACK_ROTATION / 2))
        }

        const interval = setInterval(createSnack, 2000)
        Matter.Composite.add(world, [
            catcherL,
            catcherR
        ])


        // update
        // Matter.Events.on(engine, 'beforeUpdate', function() {
        //   Matter.Body.setAngularVelocity(catcher, 0)
        //   Matter.Body.setVelocity(catcher, {
        //     x: 0,
        //     y: 0
        //   })

        //   Matter.Body.setPosition( catcher, {
        //     x: catcher.position.x,
        //     y: catcherPosition
        //   })

        // })


  // add collision event handler
        Matter.Events.on(engine, 'collisionStart', function(event) {
            const pairs = event.pairs;
            pairs.forEach(pair => {
                const { bodyA, bodyB } = pair;
                    if (!CONSTRAINTS.current.get(bodyB)) {
                        const constraint = Matter.Constraint.create({
                            bodyA: bodyA,
                            bodyB: bodyB,
                            stiffness: .1,
                        });
                        Matter.World.add(world, constraint);
                        CONSTRAINTS.current.set(bodyB, constraint);
                    }
            });
        });


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

    return <canvas ref={CANVAS} />
}

export default CatchGame

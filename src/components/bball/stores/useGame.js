import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

export default create(subscribeWithSelector((set) => {
    return {
        score: 0,
        increment: () => set((state) => ({ score: state.score + 1 })),

    }
}))

import { useSelector, useDispatch } from "react-redux"
import { RootState } from "./app/store"
import { decrement, increment } from "./slices/counterSlice"
import { Button } from "@nextui-org/react"

export default function App() {
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div>
      <div className="flex items-center gap-2.5">
        <Button color="primary" aria-label="Increment value" onClick={() => dispatch(increment())}>
          Increment
        </Button>
        <div>{count}</div>
        <Button color="primary" aria-label="Decrement value" onClick={() => dispatch(decrement())}>
          Decrement
        </Button>
      </div>
    </div>
  )
}

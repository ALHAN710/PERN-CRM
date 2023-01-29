import { ReactNode } from "react"

export type Props = {
    children: ReactNode;
}

export type TErrorAPI = { message: string; field?: string }
import { useRowStore } from "../stores/useRowStore";
import { useMemo } from "react";

export default function useAltitudeChart() {
    const history = useRowStore((state) => (state.history))
    return useMemo(() => {
        return history
            .filter((_, index) => index % 60 === 0)
            .slice(-50)
            .map((row) => ({
                time: row?.time ? Math.round(row.time / 1000) : 0,
                altitude: row?.altitude ?? 0,
            }));
    }, [history])
}
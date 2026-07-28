const DEADBAND_RADIANOS = 0.5 * (Math.PI / 180);

export function isInvalidQuaternion(x, y, z, w) {
    if (x === undefined || y === undefined || z === undefined || w === undefined) return true;
    if (x === null || y === null || z === null || w === null) return true;
    if (x === 0 && y === 0 && z === 0 && w === 0) return true;
    return false;
}

export function calculateAngleDifference(q1, q2) {
    let dot = (q1.x * q2.x) + (q1.y * q2.y) + (q1.z * q2.z) + (q1.w * q2.w);
    dot = Math.max(-1.0, Math.min(1.0, dot));
    return 2 * Math.acos(Math.abs(dot));
}

export function exceedsDeadband(currentQ, newQ) {
    if (!currentQ) return true;
    return calculateAngleDifference(currentQ, newQ) >= DEADBAND_RADIANOS;
}

export function isEqualQuaternion(lastQ, x, y, z, w) {
    if (!lastQ) return false;

    const isExactMatch = 
        lastQ.x === x && 
        lastQ.y === y && 
        lastQ.z === z && 
        lastQ.w === w;

    if (isExactMatch) return true;

    const isAntipodalMatch = 
        lastQ.x === -x && 
        lastQ.y === -y && 
        lastQ.z === -z && 
        lastQ.w === -w;

    return isAntipodalMatch;
}
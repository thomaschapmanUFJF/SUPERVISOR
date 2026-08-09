const DEADBAND_RADIANOS = 0.5 * (Math.PI / 180);

export function isInvalidQuaternion(qx, qy, qz, qw) {
    if (qx === undefined || qy === undefined || qz === undefined || qw === undefined) return true;
    if (qx === null || qy === null || qz === null || qw === null) return true;
    if (qx === 0 && qy === 0 && qz === 0 && qw === 0) return true;
    return false;
}

export function isInvalidQuaternionObject(q) {
    if (!q) return true;
    return isInvalidQuaternion(q?.x, q?.y, q?.z, q?.w);
}

export function calculateAngleDifference(q1, q2) {
    let dot = (q1.x * q2.x) + (q1.y * q2.y) + (q1.z * q2.z) + (q1.w * q2.w);
    dot = Math.max(-1.0, Math.min(1.0, dot));
    return 2 * Math.acos(Math.abs(dot));
}

export function exceedsDeadband(currentQ, newQ) {
    if (isInvalidQuaternionObject(currentQ) || isInvalidQuaternionObject(newQ)) return true;
    return calculateAngleDifference(currentQ, newQ) >= DEADBAND_RADIANOS;
}

export function isEqualQuaternion(currentQ, x, y, z, w) {
    if (isInvalidQuaternionObject(currentQ) || isInvalidQuaternion(x,y,z,w)) return false;
    const isExactMatch = 
        currentQ.x === x && 
        currentQ.y === y && 
        currentQ.z === z && 
        currentQ.w === w;

    if (isExactMatch) return true;

    const isAntipodalMatch = 
        currentQ.x === -x && 
        currentQ.y === -y && 
        currentQ.z === -z && 
        currentQ.w === -w;

    return isAntipodalMatch;
}
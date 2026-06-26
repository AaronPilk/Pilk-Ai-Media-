export type OrbNodes = {
  positions: Float32Array;
  directions: Float32Array;
  randoms: Float32Array;
  delays: Float32Array;
  count: number;
};

export type OrbConnections = {
  positions: Float32Array;
  randoms: Float32Array;
  vertexCount: number;
};

/** Distributes `count` nodes on a sphere (fibonacci) for the neural-network orb. */
export function generateOrbNodes(count: number, radius = 1.6): OrbNodes {
  const positions = new Float32Array(count * 3);
  const directions = new Float32Array(count * 3);
  const randoms = new Float32Array(count);
  const delays = new Float32Array(count);
  const golden = Math.PI * (1 + Math.sqrt(5));

  for (let i = 0; i < count; i++) {
    const t = i / count;
    const inclination = Math.acos(1 - 2 * t);
    const azimuth = golden * i;
    const r = radius + (Math.random() - 0.5) * 0.12;
    const sinI = Math.sin(inclination);
    const x = r * sinI * Math.cos(azimuth);
    const y = r * Math.cos(inclination);
    const z = r * sinI * Math.sin(azimuth);

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;

    const inv = 1 / r;
    directions[i * 3] = x * inv;
    directions[i * 3 + 1] = y * inv;
    directions[i * 3 + 2] = z * inv;

    randoms[i] = Math.random();
    delays[i] = Math.random();
  }

  return { positions, directions, randoms, delays, count };
}

/** Connects each node to its nearest neighbors within `maxDist` to form network edges. */
export function buildConnections(
  nodes: OrbNodes,
  maxPerNode = 3,
  maxDist = 0.95
): OrbConnections {
  const { positions, count } = nodes;
  const linePos: number[] = [];
  const lineRand: number[] = [];
  const seen = new Set<string>();

  for (let i = 0; i < count; i++) {
    const ix = positions[i * 3];
    const iy = positions[i * 3 + 1];
    const iz = positions[i * 3 + 2];
    const neighbors: { j: number; d: number }[] = [];

    for (let j = 0; j < count; j++) {
      if (j === i) continue;
      const dx = positions[j * 3] - ix;
      const dy = positions[j * 3 + 1] - iy;
      const dz = positions[j * 3 + 2] - iz;
      const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
      if (d < maxDist) neighbors.push({ j, d });
    }
    neighbors.sort((a, b) => a.d - b.d);

    const limit = Math.min(maxPerNode, neighbors.length);
    for (let k = 0; k < limit; k++) {
      const j = neighbors[k].j;
      const key = i < j ? `${i}_${j}` : `${j}_${i}`;
      if (seen.has(key)) continue;
      seen.add(key);
      const r = Math.random();
      linePos.push(positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2]);
      lineRand.push(r);
      linePos.push(positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]);
      lineRand.push(r);
    }
  }

  return {
    positions: new Float32Array(linePos),
    randoms: new Float32Array(lineRand),
    vertexCount: lineRand.length,
  };
}

import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';

function Cloud({ position, scale = 1 }) {
    const group = useRef();
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        group.current.position.x = position[0] + Math.sin(state.clock.elapsedTime * 0.2) * 0.5;
        group.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
    });

    return (
        <group ref={group} position={position} scale={scale}>
            <mesh onPointerOver={() => setHovered(true)} onPointerOut={() => setHovered(false)}>
                <sphereGeometry args={[1, 16, 16]} />
                <meshStandardMaterial color={hovered ? "#ffffff" : "#f0f0f0"} />
            </mesh>
            <mesh position={[1, 0, 0]}>
                <sphereGeometry args={[0.8, 16, 16]} />
                <meshStandardMaterial color={hovered ? "#ffffff" : "#f0f0f0"} />
            </mesh>
            <mesh position={[-1, 0, 0]}>
                <sphereGeometry args={[0.8, 16, 16]} />
                <meshStandardMaterial color={hovered ? "#ffffff" : "#f0f0f0"} />
            </mesh>
        </group>
    );
}

function Grass({ position }) {
    const mesh = useRef();
    const [hovered, setHovered] = useState(false);

    useFrame((state) => {
        mesh.current.rotation.x = Math.sin(state.clock.elapsedTime + position[0]) * 0.1;
    });

    return (
        <mesh
            ref={mesh}
            position={position}
            onPointerOver={() => setHovered(true)}
            onPointerOut={() => setHovered(false)}
        >
            <cylinderGeometry args={[0.1, 0.1, 1, 8]} />
            <meshStandardMaterial color={hovered ? "#4CAF50" : "#2E7D32"} />
        </mesh>
    );
}

function Tree({ score = 0 }) {
    const group = useRef();
    const [currentScore, setCurrentScore] = useState(0);
    const [windStrength, setWindStrength] = useState(0);

    useFrame((state) => {
        // Hiệu ứng gió
        const wind = Math.sin(state.clock.elapsedTime) * 0.1;
        setWindStrength(wind);

        if (currentScore !== score) {
            setCurrentScore(score);
        }
    });

    const createLeaves = () => {
        const leaves = [];
        const baseHeight = 2;
        const heightStep = 2;
        const sizeStep = 0.5;

        // Thân cây
        leaves.push(
            <mesh key="trunk" position={[0, 0, 0]}>
                <cylinderGeometry args={[0.5, 0.5, 4, 8]} />
                <meshStandardMaterial color="#8B4513" />
            </mesh>
        );

        // Tán cây
        for (let i = 0; i < score + 1; i++) {
            const height = baseHeight + i * heightStep;
            const size = 2 - i * sizeStep;
            const color = `hsl(${120 - i * 10}, 70%, 40%)`;

            leaves.push(
                <mesh
                    key={`leaves-${i}`}
                    position={[0, height, 0]}
                    rotation={[windStrength, 0, 0]}
                >
                    <coneGeometry args={[size, 3, 8]} />
                    <meshStandardMaterial color={color} />
                </mesh>
            );
        }

        return leaves;
    };

    return (
        <group ref={group} scale={[1, 1, 1]}>
            {createLeaves()}
        </group>
    );
}

function Scene({ score }) {
    // Tạo mảng vị trí cho cỏ
    const grassPositions = Array.from({ length: 20 }, (_, i) => [
        Math.random() * 10 - 5,
        0,
        Math.random() * 10 - 5
    ]);

    // Tạo mảng vị trí cho mây
    const cloudPositions = [
        [-5, 8, -5],
        [5, 7, -3],
        [-3, 9, 4],
        [4, 8, 5]
    ];

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <Tree score={score} />
            {grassPositions.map((pos, i) => (
                <Grass key={`grass-${i}`} position={pos} />
            ))}
            {cloudPositions.map((pos, i) => (
                <Cloud key={`cloud-${i}`} position={pos} scale={0.5 + Math.random() * 0.5} />
            ))}
        </>
    );
}

export default function Tree3D({ score = 0 }) {
    return (
        <div className="tree-container">
            <Canvas
                camera={{ position: [0, 0, 10], fov: 50 }}
                style={{ background: 'transparent' }}
            >
                <Scene score={score} />
                <OrbitControls enableZoom={true} enablePan={true} enableRotate={true} />
            </Canvas>
        </div>
    );
} 
import { Shape, Vector2 } from 'three';

export interface SVGShapeConfig {
  path: string;
  color: string;
  position: { x: number; y: number; z: number };
  scale: number;
}

// 将SVG路径数据转换为Three.js Shape
export function createShapeFromSVGPath(pathData: string): Shape {
  const shape = new Shape();

  // 简化的SVG路径解析器
  const commands = pathData.match(/[MLHVCSQTAZ][^MLHVCSQTAZ]*/gi);

  if (!commands) return shape;

  let currentX = 0;
  let currentY = 0;

  commands.forEach(cmd => {
    const command = cmd[0].toUpperCase();
    const params = cmd.slice(1).trim().split(/[\s,]+/).map(Number);

    switch (command) {
      case 'M': // Move to
        currentX = params[0];
        currentY = params[1];
        shape.moveTo(currentX, currentY);
        break;

      case 'L': // Line to
        currentX = params[0];
        currentY = params[1];
        shape.lineTo(currentX, currentY);
        break;

      case 'C': // Cubic Bezier curve
        shape.bezierCurveTo(
          params[0], params[1], // control point 1
          params[2], params[3], // control point 2
          params[4], params[5]  // end point
        );
        currentX = params[4];
        currentY = params[5];
        break;

      case 'Q': // Quadratic Bezier curve
        shape.quadraticCurveTo(
          params[0], params[1], // control point
          params[2], params[3]  // end point
        );
        currentX = params[2];
        currentY = params[3];
        break;

      case 'Z': // Close path
        shape.closePath();
        break;
    }
  });

  return shape;
}

// 预定义的SVG形状配置
export const svgShapes: SVGShapeConfig[] = [
  {
    path: "M253.867 125.376C257.372 206.493 191.207 259.57 123.178 259.57C55.1486 259.57 0 201.955 0 130.884C0 59.8129 59.8967 0.195412 127.926 0.195412C193.02 -3.81038 253.867 54.305 253.867 125.376Z",
    color: "#0D0D0F",
    position: { x: 0, y: 0, z: 0 },
    scale: 0.01
  },
  {
    path: "M3.03918 73.7323L0.532891 36.6393L367.453 0.54877L370.461 37.6418L3.03918 73.7323Z",
    color: "#D14137",
    position: { x: -2, y: 1, z: 0.5 },
    scale: 0.008
  },
  {
    path: "M0.53527 3.03335L39.061 0.531674L81.5895 645.963L47.0664 648.465L0.53527 3.03335Z",
    color: "#D14137",
    position: { x: 0, y: -2, z: -0.5 },
    scale: 0.005
  },
  {
    path: "M0.654203 66.7893L10.6725 90.3323L158.944 23.2096L149.927 0.668397L0.654203 66.7893Z",
    color: "#D14137",
    position: { x: -3, y: -1, z: 1 },
    scale: 0.015
  },
  {
    path: "M0.672891 19.9454L11.822 44.2708L52.3643 26.0268L43.2423 0.68785L0.672891 19.9454Z",
    color: "#D14137",
    position: { x: 1.5, y: 0.5, z: -1 },
    scale: 0.02
  },
  {
    path: "M0.672324 93.84L4.67563 102.347L214.849 10.7714V0.763082L0.672324 93.84Z",
    color: "#D14137",
    position: { x: 1, y: -1.5, z: 0.8 },
    scale: 0.01
  },
  {
    path: "M0.643888 43.8924L111.768 0.649642L126.349 37.3557L15.2257 83.1125L0.643888 43.8924Z",
    color: "#D14137",
    position: { x: 2, y: 0.8, z: -0.8 },
    scale: 0.015
  }
];